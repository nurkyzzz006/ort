"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError, useSaveAnswer, type SaveAnswerBody } from "@/api";

export type SaveStatus = "idle" | "saving" | "saved" | "offline" | "error";

type Queue = Record<string, SaveAnswerBody>; // questionId → последнее изменение

const storageKey = (sessionId: string) => `orto-exam-queue-${sessionId}`;

const readQueue = (sessionId: string): Queue => {
  try {
    const raw = localStorage.getItem(storageKey(sessionId));
    return raw ? (JSON.parse(raw) as Queue) : {};
  } catch {
    return {};
  }
};

const writeQueue = (sessionId: string, queue: Queue) => {
  try {
    if (Object.keys(queue).length === 0) localStorage.removeItem(storageKey(sessionId));
    else localStorage.setItem(storageKey(sessionId), JSON.stringify(queue));
  } catch {
    // хранилище недоступно — очередь живёт только в памяти
  }
};

const RETRY_MS = 5_000;

/**
 * Автосохранение ответов с офлайн-очередью (ТЗ 3.2, 13.2):
 * - каждое изменение сразу уходит на сервер (PUT …/answers/{id});
 * - при потере сети изменения копятся в localStorage и отправляются
 *   при восстановлении связи (событие online) или по таймеру;
 * - сервер применяет только изменения с бо́льшим seq — повтор безопасен;
 * - очередь хранит лишь последнее изменение по каждому вопросу (ограничена).
 * Ответы — не секретные данные; токены здесь не хранятся.
 */
export const useAutosave = (sessionId: string) => {
  // mutateAsync стабилен между рендерами (экран перерисовывается каждую секунду)
  const { mutateAsync } = useSaveAnswer();
  const queueRef = useRef<Queue>({});
  const flushingRef = useRef<Promise<void> | null>(null);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [pending, setPending] = useState(0);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const sync = useCallback(() => {
    writeQueue(sessionId, queueRef.current);
    setPending(Object.keys(queueRef.current).length);
  }, [sessionId]);

  const run = useCallback(async () => {
    while (Object.keys(queueRef.current).length > 0) {
      const [questionId, data] = Object.entries(queueRef.current)[0];
      // Пока шёл запрос, по вопросу могло появиться новое изменение — его не трогаем
      const dropIfSame = () => {
        if (queueRef.current[questionId]?.seq === data.seq) delete queueRef.current[questionId];
        sync();
      };
      setStatus("saving");
      try {
        await mutateAsync({ sessionId, questionId, data });
        dropIfSame();
        setLastSavedAt(new Date());
      } catch (error) {
        if (error instanceof ApiError && error.isNetworkError) {
          setStatus("offline");
          return; // повторим при восстановлении сети
        }
        // 409/422: сессия закрыта или изменение отклонено — не повторяем бесконечно
        dropIfSame();
        setStatus("error");
        return;
      }
    }
    setStatus("saved");
  }, [mutateAsync, sessionId, sync]);

  /** Отправить очередь. Параллельные вызовы ждут одну и ту же отправку. */
  const flush = useCallback((): Promise<void> => {
    if (!flushingRef.current) {
      flushingRef.current = run().finally(() => {
        flushingRef.current = null;
      });
    }
    return flushingRef.current;
  }, [run]);

  // Восстанавливаем очередь после перезагрузки страницы
  useEffect(() => {
    queueRef.current = readQueue(sessionId);
    sync();
    if (Object.keys(queueRef.current).length > 0) void flush();
    // flush стабилен по смыслу; запускаем только при смене сессии
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Повтор при восстановлении сети и по таймеру
  useEffect(() => {
    const retry = () => {
      if (Object.keys(queueRef.current).length > 0) void flush();
    };
    window.addEventListener("online", retry);
    const timer = window.setInterval(retry, RETRY_MS);
    return () => {
      window.removeEventListener("online", retry);
      window.clearInterval(timer);
    };
  }, [flush]);

  const save = useCallback(
    (questionId: string, data: SaveAnswerBody) => {
      queueRef.current[questionId] = data;
      sync();
      void flush();
    },
    [flush, sync],
  );

  /** Изменения из очереди — поверх данных сервера (не потерять несохранённое) */
  const queued = useCallback(() => ({ ...queueRef.current }), []);

  return { save, flush, status, pending, lastSavedAt, queued };
};
