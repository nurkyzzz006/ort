import DashboardShell from "@/components/layout/dashboard/DashboardShell";
import React, { FC, ReactNode } from "react";

interface ILayout {
  children: ReactNode;
}

const layout: FC<ILayout> = ({ children }) => <DashboardShell>{children}</DashboardShell>;

export default layout;
