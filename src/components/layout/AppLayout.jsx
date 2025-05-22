import { Outlet } from "react-router-dom";
import Header from "../common/Header";

const AppLayout = () => {
  return (
    <div className="relative h-screen w-screen">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
