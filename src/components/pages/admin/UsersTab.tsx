"use client";
import { useState } from "react";
import { useGetAdminUsers, useSession, useSetUserRoles, type AdminUser, type RoleCode } from "@/api";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Empty, ErrorState, Skeleton } from "@/components/ui/StateView";
import { useT } from "@/i18n";
import { formatDate } from "@/i18n/format";
import roles from "../roles/roles.module.scss";
import { MutationStatus } from "./shared";
import scss from "./admin.module.scss";

const ROLES: RoleCode[] = ["student", "editor", "expert", "admin"];
const PAGE = 50;

/** Пользователи и роли (ТЗ 2.1: роли назначает только администратор, всё в audit log) */
const UsersTab = () => {
  const t = useT();
  const [offset, setOffset] = useState(0);
  const users = useGetAdminUsers({ limit: PAGE, offset });

  return (
    <Card title={t.adminPanel.users} padding="none">
      {users.isPending ? (
        <Skeleton height={200} />
      ) : users.isError ? (
        <ErrorState error={users.error} onRetry={() => users.refetch()} />
      ) : users.data.items.length === 0 ? (
        <Empty title={t.adm.noUsers} />
      ) : (
        <>
          <div className={roles.tableWrap}>
            <table className={roles.table}>
              <thead>
                <tr>
                  <th>{t.adm.user}</th>
                  <th>{t.mistakes.columns.status}</th>
                  <th>{t.adm.roles}</th>
                  <th>{t.tests.columns.date}</th>
                </tr>
              </thead>
              <tbody>
                {users.data.items.map((u) => (
                  <UserRow key={u.id} user={u} createdAt={formatDate(u.created_at)} />
                ))}
              </tbody>
            </table>
          </div>
          <div className={scss.filters}>
            <span className={scss.muted}>
              {offset + 1}–{offset + users.data.items.length} / {users.data.total}
            </span>
            <Button size="sm" variant="secondary" disabled={offset === 0} onClick={() => setOffset((o) => Math.max(0, o - PAGE))}>
              {t.common.prev}
            </Button>
            <Button size="sm" variant="secondary" disabled={offset + PAGE >= users.data.total} onClick={() => setOffset((o) => o + PAGE)}>
              {t.common.next}
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

const UserRow = ({ user, createdAt }: { user: AdminUser; createdAt: string }) => {
  const t = useT();
  const { user: me } = useSession();
  const setRoles = useSetUserRoles();
  const [draft, setDraft] = useState<string[]>(user.roles);
  const changed = draft.slice().sort().join() !== user.roles.slice().sort().join();
  const isMe = me?.id === user.id;

  const toggle = (r: RoleCode) =>
    setDraft((d) => (d.includes(r) ? d.filter((x) => x !== r) : [...d, r]));

  return (
    <tr>
      <td>
        <div className={roles.person}>
          <span className={roles.avatar} aria-hidden>
            {(user.display_name || user.email || "?")[0].toUpperCase()}
          </span>
          <div>
            <strong>{user.display_name || "—"}</strong>
            <small>{user.email}</small>
          </div>
        </div>
      </td>
      <td>
        <Badge tone={user.status === "active" ? "success" : user.status === "blocked" ? "warning" : "danger"}>
          {t.adm.userStatus[user.status]}
        </Badge>
      </td>
      <td>
        <div className={scss.chips}>
          {ROLES.map((r) => (
            <label key={r}>
              <input
                type="checkbox"
                checked={draft.includes(r)}
                // Не даём админу случайно снять с себя роль admin
                disabled={isMe && r === "admin"}
                onChange={() => toggle(r)}
              />
              {t.adm.roleNames[r]}
            </label>
          ))}
          {changed && (
            <Button
              size="sm"
              loading={setRoles.isPending}
              disabled={draft.length === 0}
              onClick={() => setRoles.mutate({ userId: user.id, data: { roles: draft as RoleCode[] } })}
            >
              {t.common.save}
            </Button>
          )}
        </div>
        <MutationStatus error={setRoles.error} />
      </td>
      <td>{createdAt}</td>
    </tr>
  );
};

export default UsersTab;
