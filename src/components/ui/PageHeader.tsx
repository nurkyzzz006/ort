import type { ReactNode } from "react";
import scss from "./PageHeader.module.scss";

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}

const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => (
  <header className={scss.header}>
    <div className={scss.text}>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
    {actions && <div className={scss.actions}>{actions}</div>}
  </header>
);

export default PageHeader;
