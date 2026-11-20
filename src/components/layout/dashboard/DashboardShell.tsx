"use client";
import { useState, type ReactNode } from "react";
import { useT } from "@/i18n";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import scss from "./Dashboard.module.scss";

/** Каркас кабинета: тёмный сайдбар + верхняя панель + контент */
const DashboardShell = ({ children }: { children: ReactNode }) => {
  const t = useT();
  // Мобильное меню закрывается при клике по пункту (onNavigate) или по фону
  const [open, setOpen] = useState(false);

  return (
    <div className={scss.shell}>
      <a href="#main" className={scss.skip}>
        {t.common.skipToContent}
      </a>
      <Sidebar open={open} onNavigate={() => setOpen(false)} />
      {open && (
        <button
          type="button"
          className={scss.overlay}
          aria-label={t.common.closeMenu}
          onClick={() => setOpen(false)}
        />
      )}
      <div className={scss.body}>
        <Topbar onMenu={() => setOpen(true)} />
        <main id="main" className={scss.main}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
