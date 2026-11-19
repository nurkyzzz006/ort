import LayoutSite from "@/components/layout/LayoutSite";
import React, { FC, ReactNode } from "react";

interface ILayout {
  children: ReactNode;
}

const LayoutClient: FC<ILayout> = ({ children }) => {
  return <div>{children}</div>;
};

export default LayoutClient;
