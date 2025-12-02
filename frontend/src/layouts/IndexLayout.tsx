import Navbar from "@/components/shared/Navbar";
import { Outlet } from "react-router-dom";

const IndexLayout = () => {
  return (
    <>
    <Navbar/>
      <Outlet />
    </>
  );
};

export default IndexLayout;
