import Link from "next/link";
import scss from "./common.module.scss";

interface LogoProps {
  href?: string;
  subtitle: string;
  inverted?: boolean;
}

/** Логотип ORTO: фиолетовый знак + название */
const Logo = ({ href = "/", subtitle, inverted }: LogoProps) => (
  <Link href={href} className={[scss.logo, inverted ? scss.inverted : ""].join(" ")}>
    <span className={scss.mark} aria-hidden>
      <span />
    </span>
    <span className={scss.name}>
      <strong>ORTO</strong>
      <small>{subtitle}</small>
    </span>
  </Link>
);

export default Logo;
