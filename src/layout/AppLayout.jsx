import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";

const AppLayout = () => {
  return (
    <div className="grid grid-rows-12 h-screen [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      <div className="row-span-1">
        <Header />
      </div>
      <div className="row-span-11">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
