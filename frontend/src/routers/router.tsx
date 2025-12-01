import { createBrowserRouter, Navigate } from "react-router-dom";
import {
  DashboardPage,
  IndexLayout,
  IndexPage,
  DashboardLayout,
  QRPage,
  TransactionsPage,
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
        element: <Navigate to="/dashboard/chat" replace />,
      },
      {
        path: "chat",
        element: <DashboardPage />,
      },
      {
        path: "qr",
        element: <QRPage />,
      },
      {
        path: "transactions",
        element: <TransactionsPage />,
      },
    ],
  },
]);

export default router;
