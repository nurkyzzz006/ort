"use client";
import { navLinks } from "@/components/ui/Language";
import scss from "./Header.module.scss";
import logo from "@/assets/logo_ort.svg";
import { FaArrowRightLong } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  return (
    <div id={scss.Header}>
      <div className="container">
        <div className={scss.content}>
          <div className={scss.logo_part}>
            <Image src={logo} alt="Logo" width={40} height={40} />
            <div className={scss.logo_name}>
              <h1>ОРТ</h1>
              <p>ЖРТ ОРТ</p>
            </div>
          </div>
          <div className={scss.nav_part}>
            <nav className={scss.nav}>
              {navLinks.map((link, index) => (
                <a key={index} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div className={scss.icon_part}>
            <div className={scss.lang}>
              <p>ky</p> <p>ru</p>
            </div>
            <button>Войти</button>
            <button onClick={() => router.push("/register")}>
              Начать бесплатно <FaArrowRightLong />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
