"use client";
import { LuFileText } from "react-icons/lu";
import Button from "@/components/ui/Button";
import { Empty } from "@/components/ui/StateView";
import { useT } from "@/i18n";
import scss from "./DocumentPending.module.scss";

/**
 * Юридические документы (privacy / terms) готовит юрист (ТЗ 15, 22) —
 * текст не выдумываем, показываем честный статус.
 */
const DocumentPending = ({ kind }: { kind: "privacy" | "terms" }) => {
  const t = useT();
  return (
    <section className={`container ${scss.page}`}>
      <h1>{t.footer[kind]}</h1>
      <div className={scss.card}>
        <Empty
          icon={<LuFileText />}
          title={t.docs.pendingTitle}
          text={t.docs.pendingText}
          action={
            <Button href="/" variant="secondary" size="sm">
              {t.docs.home}
            </Button>
          }
        />
      </div>
    </section>
  );
};

export default DocumentPending;
