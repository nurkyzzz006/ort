import React, { FC, ReactNode } from "react";
import scss from "./LayoutSite.module.scss";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import SideBar from "./side-bar/SideBar";

interface ILayout {
  children: ReactNode;
}

const LayoutSite: FC<ILayout> = ({ children }) => {
  return (
    <div className={scss.LayoutSite}>
      {/* <SideBar/> */}
      <Header />
      <div className={scss.main}>{children}</div>
      <Footer />
    </div>
  );
};

export default LayoutSite;
