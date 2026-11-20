"use client";
import { LuCheck } from "react-icons/lu";
import { useGetQuestionReports, useResolveQuestionReport, type UntypedResponse } from "@/api";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Empty, ErrorState, Skeleton } from "@/components/ui/StateView";
import { useT } from "@/i18n";
import { formatDate } from "@/i18n/format";
import roles from "../roles/roles.module.scss";
import { JsonView, MutationStatus, str } from "./shared";
import scss from "./admin.module.scss";

/**
 * Жалобы учеников на вопросы и объяснения (ТЗ 7, 8.1).
 * Схема элемента в Swagger не описана: показываем известные поля, если они есть,
 * иначе — сырой JSON. Значение status кроме "open" в Swagger не перечислено.
 */
const ReportsTab = () => {
  const t = useT();
  // Swagger знает только значение по умолчанию "open" — другие статусы не угадываем
  const status = "open";
  const reports = useGetQuestionReports({ status });
  const resolve = useResolveQuestionReport();

  const item = (r: UntypedResponse, i: number) => {
    const id = str(r, "id");
    const kind = str(r, "kind");
    const comment = str(r, "comment");
    const created = str(r, "created_at");
    const question = str(r, "question_version_id");
    return (
      <li key={id ?? i}>
        <div className={roles.grow}>
          <strong>{kind ?? t.adm.report}</strong>
          <span>
            {created && formatDate(created)}
            {question && ` · ${question.slice(0, 8)}…`}
          </span>
          {comment ? <p className={scss.muted}>{comment}</p> : !kind && <JsonView value={r} />}
        </div>
        {id && (
          <Button
            size="sm"
            icon={<LuCheck />}
            loading={resolve.isPending && resolve.variables?.reportId === id}
            onClick={() => resolve.mutate({ reportId: id })}
          >
            {t.adm.resolve}
          </Button>
        )}
      </li>
    );
  };

  return (
    <Card
      title={t.adm.reports}
    >
      {reports.isPending ? (
        <Skeleton height={120} />
      ) : reports.isError ? (
        <ErrorState error={reports.error} onRetry={() => reports.refetch()} />
      ) : reports.data.length === 0 ? (
        <Empty icon={<LuCheck />} title={t.adm.noReports} />
      ) : (
        <ul className={roles.list}>{reports.data.map(item)}</ul>
      )}
      <MutationStatus error={resolve.error} />
    </Card>
  );
};

export default ReportsTab;
