import { RouterProvider } from "react-router-dom";
import router from "./routers/router";
import { AuthProvider } from "./providers/AuthProvider";

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
