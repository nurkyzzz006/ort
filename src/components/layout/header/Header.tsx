"use client";
import Link from "next/link";
import { useState } from "react";
import { LuArrowRight, LuMenu, LuX } from "react-icons/lu";
import { useSession } from "@/api";
import Button from "@/components/ui/Button";
import { useT } from "@/i18n";
import LanguageSwitch from "../common/LanguageSwitch";
import Logo from "../common/Logo";
import ThemeSwitch from "../common/ThemeSwitch";
import { LANDING_NAV } from "../nav";
import scss from "./Header.module.scss";

const Header = () => {
  const t = useT();
  const { isAuthenticated } = useSession();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const actions = isAuthenticated ? (
    <Button href="/dashboard" iconRight={<LuArrowRight />} onClick={close}>
      {t.nav.cabinet}
    </Button>
  ) : (
    <>
      <Button href="/login" variant="secondary" onClick={close}>
        {t.nav.login}
      </Button>
      <Button href="/register" iconRight={<LuArrowRight />} onClick={close}>
        {t.nav.startFree}
      </Button>
    </>
  );

  return (
    <header className={scss.header}>
      <div className={`container ${scss.content}`}>
        <Logo subtitle={t.brand.short} />

        <nav className={scss.nav} aria-label={t.nav.main}>
          {LANDING_NAV.map((link) => (
            <Link key={link.key} href={link.href}>
              {t.nav.landing[link.key]}
            </Link>
          ))}
        </nav>

        <div className={scss.actions}>
          <LanguageSwitch />
          <ThemeSwitch />
          <div className={scss.desktopOnly}>{actions}</div>
          <button
            type="button"
            className={scss.burger}
            aria-expanded={open}
            aria-controls="landing-menu"
            aria-label={open ? t.common.closeMenu : t.common.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <LuX /> : <LuMenu />}
          </button>
        </div>
      </div>

      {open && (
        <div id="landing-menu" className={scss.mobileMenu}>
          <nav aria-label={t.nav.main}>
            {LANDING_NAV.map((link) => (
              <Link key={link.key} href={link.href} onClick={close}>
                {t.nav.landing[link.key]}
              </Link>
            ))}
          </nav>
          <div className={scss.mobileActions}>{actions}</div>
        </div>
      )}
    </header>
  );
};

export default Header;
