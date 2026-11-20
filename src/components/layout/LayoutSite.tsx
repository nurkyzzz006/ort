import React, { FC, ReactNode } from "react";
import scss from "./LayoutSite.module.scss";
import Header from "./header/Header";
import Footer from "./footer/Footer";

interface ILayout {
  children: ReactNode;
}

const LayoutSite: FC<ILayout> = ({ children }) => (
  <div className={scss.layout}>
    <Header />
    <main className={scss.main}>{children}</main>
    <Footer />
  </div>
);

export default LayoutSite;
