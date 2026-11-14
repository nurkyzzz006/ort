import Image from "next/image";
import scss from "./Footer.module.scss";
import logo from "@/assets/logo_ort.svg";
import { footerLinks } from "@/components/ui/Language";
const Footer = () => {
  return (
    <div id={scss.Footer}>
      <div className="container">
        <div className={scss.content}>
          <div className={scss.logo}>
            <Image src={logo} alt="Logo" width={40} height={40} />
            <div className={scss.logo_name}>
              <p> 2026 - Кыргыз Республикасы</p>
            </div>
          </div>
          <div className={scss.help}>
            {footerLinks.map((link, index) => (
              <a key={index} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
