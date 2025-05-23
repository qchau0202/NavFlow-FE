import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "/",
      label: "Home",
    },
    {
      key: "/playground",
      label: "Playground",
    },
    {
      key: "/dashboard",
      label: "Dashboard",
    },
    {
      key: "/profile",
      label: "Profile",
    },
  ];

  return (
    <>
      <div className="h-full bg-white border-b border-gray-200">
        <div className="grid grid-cols-3 p-4">
          <div className="col-span-1 text-lg md:text-2xl sm:text-lg font-medium text-gray-800 px-6">
            NavFlow
          </div>
          <div className="col-span-1 ">
            <ul className="flex items-center justify-center space-x-6 ">
              {menuItems.map((item) => (
                <li key={item.key}>
                  <button
                    onClick={() => navigate(item.key)}
                    className={`flex items-center gap-2 px-3 py-1.5 transition-colors ${
                      location.pathname === item.key
                        ? "border-b-2 border-emerald-500 text-emerald-500"
                        : "hover:text-emerald-500 hover:cursor-pointer text-black"
                    }`}
                  >
                    <span className="md:text-lg sm:text-base">
                      {item.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-1 flex items-center justify-end gap-4 px-6">
            <h1 className="md:text-lg sm:text-base">User</h1>
            <Avatar size={40}>
              <UserOutlined />
            </Avatar>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
