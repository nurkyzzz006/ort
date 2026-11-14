import SideBar from "@/components/layout/side-bar/SideBar";
import React, { FC, ReactNode } from "react";

interface ILayout {
  children: ReactNode;
}

const layout: FC<ILayout> = ({ children }) => {
  return (
    <div>
      <SideBar />
      {children}
    </div>
  );
};

export default layout;
