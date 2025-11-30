import { createBrowserRouter } from "react-router-dom";
import { IndexLayout, IndexPage } from "./pages";

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
]);

export default router;
