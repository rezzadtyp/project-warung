import { createBrowserRouter, Navigate } from "react-router-dom";
import {
  IndexLayout,
  IndexPage,
  DashboardLayout,
  ChatAreaPage,
  ChatListPage,
  QRPage,
  TransactionsPage,
  TenantEarningsPage,
} from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexLayout />,
    children: [
      {
        path: "/",
        element: <IndexPage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/chat/new" replace />,
      },
      {
        path: "chat",
        element: <ChatListPage />,
      },
      {
        path: "chat/new",
        element: <ChatAreaPage />,
      },
      {
        path: "chat/:chatId",
        element: <ChatAreaPage />,
      },
      {
        path: "qr",
        element: <QRPage />,
      },
      {
        path: "transactions",
        element: <TransactionsPage />,
      },
      {
        path: "earnings",
        element: <TenantEarningsPage />,
      },
    ],
  },
]);

export default router;
