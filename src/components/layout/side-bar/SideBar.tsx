import Image from "next/image";
import scss from "./SideBar.module.scss";
import logo from "@/assets/logo_ort.svg";
import { sideBarLinks } from "@/components/ui/Language";
import { BiCheckShield } from "react-icons/bi";

const SideBar = () => {
  return (
    <div id={scss.SideBar}>
      <div className="container">
        <div className={scss.content}>
          <div className={scss.logo}>
            <Image src={logo} alt="Logo" width={40} height={40} />
            <div className={scss.logo_name}>
              <h1>ORT</h1>
              <p>ЖРТ ОРТ ДАЯРДЫК</p>
            </div>
          </div>

          <div className={scss.menu}>
            <h4>ОКУУ</h4>

            <div className={scss.nav}>
              {sideBarLinks.map((link, index) => (
                <a key={index} href={link.href}>
                  <span className={scss.icon}>{link.icon}</span>
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className={scss.menu}>
            <h4>БАШКАРУУ</h4>

            <a className={scss.admin} href="/admin">
              <span className={scss.icon}>
                <BiCheckShield />
              </span>
              <span>Админ панель</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;