import { Outlet } from "react-router-dom";
import Header from "../common/Header";

const AppLayout = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
