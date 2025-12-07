import { createBrowserRouter, Navigate } from "react-router-dom";
import {
  IndexLayout,
  IndexPage,
  DashboardLayout,
  ChatAreaPage,
  ChatListPage,
  QRPage,
  TenantEarningsPage,
} from "./pages";
import ChatPage from "@/pages/dashboard/ChatPage";

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
        element: <ChatPage />,
      },
      {
        path: "chat/:chatId",
        element: <ChatPage />,
      },
      {
        path: "qr",
        element: <QRPage />,
      },
      {
        path: "earnings",
        element: <TenantEarningsPage />,
      },
    ],
  },
]);

export default router;
