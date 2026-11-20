import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import scss from "./Button.module.scss";

type Variant = "primary" | "secondary" | "soft" | "ghost" | "dark" | "danger";
type Size = "sm" | "md" | "lg";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  children?: ReactNode;
  className?: string;
}

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type LinkProps = CommonProps & { href: string; onClick?: () => void; "aria-label"?: string };

const classes = ({ variant = "primary", size = "md", fullWidth, className }: CommonProps) =>
  [scss.button, scss[variant], scss[size], fullWidth ? scss.full : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

const Content = ({ icon, iconRight, loading, children }: CommonProps) => (
  <>
    {loading ? <LuLoaderCircle className={scss.spin} aria-hidden /> : icon}
    {children !== undefined && <span>{children}</span>}
    {iconRight}
  </>
);

/** Кнопка или ссылка в стиле дизайн-системы ORTO */
const Button = (props: ButtonProps | LinkProps) => {
  if (props.href !== undefined) {
    const { href, onClick, "aria-label": ariaLabel } = props;
    return (
      <Link href={href} className={classes(props)} onClick={onClick} aria-label={ariaLabel}>
        <Content {...props} />
      </Link>
    );
  }

  // Собственные пропсы забираем, остальные (onClick, aria-*) передаём в <button>
  const {
    variant,
    size,
    icon,
    iconRight,
    fullWidth,
    loading,
    children,
    className,
    disabled,
    type = "button",
    ...rest
  } = props;

  return (
    <button
      type={type}
      className={classes({ variant, size, fullWidth, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      <Content icon={icon} iconRight={iconRight} loading={loading}>
        {children}
      </Content>
    </button>
  );
};

export default Button;
