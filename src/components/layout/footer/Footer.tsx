"use client";
import Link from "next/link";
import { useT } from "@/i18n";
import scss from "./Footer.module.scss";

const LINKS = [
  { key: "privacy", href: "/privacy" },
  { key: "terms", href: "/terms" },
  { key: "telegram", href: "/dashboard/settings#telegram" },
] as const;

const Footer = () => {
  const t = useT();
  return (
    <footer className={scss.footer}>
      <div className={`container ${scss.content}`}>
        <div className={scss.brand}>
          <span className={scss.mark} aria-hidden>
            <span />
          </span>
          <p>© 2026 · {t.footer.country}</p>
        </div>
        <nav className={scss.links} aria-label={t.footer.title}>
          {LINKS.map((l) => (
            <Link key={l.key} href={l.href}>
              {t.footer[l.key]}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
