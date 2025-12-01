import { lazy } from "react";
import Loadable from "@/components/utils/Loadable";

export const IndexPage = Loadable(lazy(() => import("@/pages/IndexPage")));
export const IndexLayout = Loadable(
  lazy(() => import("@/layouts/IndexLayout"))
);
export const DashboardLayout = Loadable(
  lazy(() => import("@/layouts/DashboardLayout"))
);
export const DashboardPage = Loadable(
  lazy(() => import("@/pages/DashboardPage"))
);
export const QRPage = Loadable(lazy(() => import("@/pages/QRPage")));
export const TransactionsPage = Loadable(
  lazy(() => import("@/pages/TransactionsPage"))
);
