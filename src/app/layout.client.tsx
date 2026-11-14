import LayoutSite from "@/components/layout/LayoutSite";
import React, { FC, ReactNode } from "react";

interface ILayout {
  children: ReactNode;
}

const LayoutClient: FC<ILayout> = ({ children }) => {
  return (
    <div>
      <LayoutSite>{children}</LayoutSite>
    </div>
  );
};

export default LayoutClient;
