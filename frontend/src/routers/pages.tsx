import { lazy } from "react";
import Loadable from "@/components/utils/Loadable";

export const IndexPage = Loadable(lazy(() => import("@/pages/IndexPage")));
export const IndexLayout = Loadable(
  lazy(() => import("@/layouts/IndexLayout"))
);
export const DashboardLayout = Loadable(
  lazy(() => import("@/layouts/DashboardLayout"))
);
export const ChatListPage = lazy(
  () => import("@/pages/dashboard/ChatListPage")
);

export const ChatAreaPage = Loadable(
  lazy(() => import("@/pages/dashboard/ChatAreaPage"))
);
export const QRPage = Loadable(lazy(() => import("@/pages/dashboard/QRPage")));
export const TransactionsPage = Loadable(
  lazy(() => import("@/pages/dashboard/TransactionsPage"))
);
export const TenantEarningsPage = Loadable(
  lazy(() => import("@/pages/dashboard/TenantEarningsPage"))
);
