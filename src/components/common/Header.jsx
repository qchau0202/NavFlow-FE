import { HomeOutlined, DashboardOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Home",
    },
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
  ];

  return (
    <div className="absolute top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-[1920px] mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-lg font-medium text-gray-800">NavFlow</div>
          <nav>
            <ul className="flex space-x-4">
              {menuItems.map((item) => (
                <li key={item.key}>
                  <button
                    onClick={() => navigate(item.key)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                      location.pathname === item.key
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;
