"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LuActivity, LuDatabase, LuGauge, LuRefreshCw, LuServer, LuShieldCheck } from "react-icons/lu";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import { Skeleton } from "@/components/ui/StateView";
import DemoNotice, { useL } from "@/demo/DemoNotice";
import { auditLog, backups, metrics, services } from "@/demo/data";
import { useT } from "@/i18n";
import { formatDate } from "@/i18n/format";
import { useSettings } from "@/settings/SettingsProvider";
import layout from "../sidebar/layout.module.scss";
import scss from "./roles.module.scss";

interface Probe {
  ok: boolean;
  status: number;
  latencyMs: number | null;
}

interface HealthResponse {
  health: Probe;
  ready: Probe;
  checkedAt: string;
}

// Реальная проверка доступности бэкенда через BFF (/api/system/health)
const useBackendHealth = () =>
  useQuery({
    queryKey: ["system", "health"],
    queryFn: async () => (await axios.get<HealthResponse>("/api/system/health")).data,
    refetchInterval: 30_000,
  });

/** Системный администратор: состояние сервисов, метрики, бэкапы, аудит (ТЗ 10, 14, 17) */
const System = () => {
  const t = useT();
  const l = useL();
  const { locale } = useSettings();
  const health = useBackendHealth();

  const probeBadge = (p: Probe | undefined) =>
    !p ? null : p.ok ? (
      <Badge tone="success">OK · {p.latencyMs} ms</Badge>
    ) : (
      <Badge tone="danger">{p.status ? `HTTP ${p.status}` : t.system.unreachable}</Badge>
    );

  return (
    <>
      <PageHeader
        title={t.system.title}
        subtitle={t.system.subtitle}
        actions={
          <Button variant="secondary" icon={<LuRefreshCw />} loading={health.isFetching} onClick={() => health.refetch()}>
            {t.system.check}
          </Button>
        }
      />

      {/* Реальные данные */}
      <Card title={t.system.backendApi} className={scss.mb}>
        {health.isPending ? (
          <Skeleton height={60} />
        ) : (
          <ul className={scss.list}>
            <li>
              <span className={`${scss.dot} ${health.data?.health.ok ? scss.dot_ok : scss.dot_down}`} aria-hidden />
              <div className={scss.grow}>
                <strong>/health</strong>
                <span>{t.system.healthText}</span>
              </div>
              {probeBadge(health.data?.health)}
            </li>
            <li>
              <span className={`${scss.dot} ${health.data?.ready.ok ? scss.dot_ok : scss.dot_down}`} aria-hidden />
              <div className={scss.grow}>
                <strong>/ready</strong>
                <span>{t.system.readyText}</span>
              </div>
              {probeBadge(health.data?.ready)}
            </li>
          </ul>
        )}
      </Card>

      <DemoNotice endpoints="GET /admin/system/services · /metrics · /backups · /audit-logs" />

      <div className={layout.stats}>
        <StatCard icon={<LuGauge />} label="API p95" value={`${metrics.p95} ms`} hint={t.system.p95Hint} />
        <StatCard icon={<LuActivity />} tone="danger" label={t.system.errorRate} value={`${(metrics.errorRate * 100).toFixed(1)}%`} />
        <StatCard icon={<LuServer />} tone="success" label="Uptime" value={`${(metrics.uptime * 100).toFixed(2)}%`} hint={t.system.uptimeHint} />
        <StatCard icon={<LuShieldCheck />} tone="info" label={t.system.aiCalls} value={metrics.aiCallsDay} />
      </div>

      <div className={layout.columns}>
        <div className={layout.stack}>
          <Card title={t.system.services}>
            <ul className={scss.list}>
              {services.map((s) => (
                <li key={s.name}>
                  <span className={`${scss.dot} ${scss[`dot_${s.state}`]}`} aria-hidden />
                  <div className={scss.grow}>
                    <strong>
                      {s.name} <small>· {s.version}</small>
                    </strong>
                    <span>{l(s.role)}</span>
                  </div>
                  <Badge tone={s.state === "ok" ? "success" : s.state === "degraded" ? "warning" : "danger"}>
                    {t.system.state[s.state]}
                    {s.latencyMs !== null && ` · ${s.latencyMs} ms`}
                  </Badge>
                </li>
              ))}
            </ul>
          </Card>

          <Card title={t.system.audit} padding="none">
            <div className={scss.tableWrap}>
              <table className={scss.table}>
                <thead>
                  <tr>
                    <th>{t.tests.columns.date}</th>
                    <th>{t.system.actor}</th>
                    <th>{t.system.action}</th>
                    <th>{t.system.object}</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLog.map((a) => (
                    <tr key={a.at}>
                      <td>{formatDate(a.at, locale)}</td>
                      <td>{a.actor}</td>
                      <td className={scss.strong}>{l(a.action)}</td>
                      <td>
                        <code>{a.object}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className={layout.stack}>
          <Card title={t.system.backups}>
            <ul className={scss.list}>
              {backups.map((b) => (
                <li key={b.at}>
                  <LuDatabase aria-hidden />
                  <div className={scss.grow}>
                    <strong>{formatDate(b.at, locale)}</strong>
                    <span>
                      {l(b.kind)} · {b.size}
                    </span>
                  </div>
                  <Badge tone={b.ok ? "success" : "danger"}>{b.ok ? "OK" : t.system.failed}</Badge>
                </li>
              ))}
            </ul>
            <p className={scss.muted}>{t.system.backupNote}</p>
          </Card>
        </div>
      </div>
    </>
  );
};

export default System;
