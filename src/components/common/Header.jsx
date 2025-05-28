import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown } from "antd";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { getCurrentUser } from "../../services/api";
import { useEffect, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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
  ];

  const dropdownItems = [
    {
      key: "1",
      label: (
        <Link to="/profile" className="flex justify-center font-bold">
          Profile
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <div className="flex justify-center">
          <button
            onClick={() => handleLogout()}
            className="text-red-500 cursor-pointer font-bold"
          >
            Logout
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="grid grid-cols-3 p-4">
        <div className="col-span-1 text-lg md:text-2xl sm:text-lg font-medium text-gray-800 px-6">
          <Link to="/">NavFlow</Link>
        </div>
        <div className="col-span-1">
          <ul className="flex items-center justify-center space-x-6">
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
                  <span className="md:text-lg sm:text-base">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-1 flex items-center justify-end gap-4 px-6">
          <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
            <div className="flex items-center gap-2 cursor-pointer">
              <p>{user?.name}</p>
              <Avatar size={40}>
                <UserOutlined />
              </Avatar>
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Header;
