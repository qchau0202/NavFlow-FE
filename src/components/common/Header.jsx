import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown } from "antd";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isGuest } = useAuth();

  const handleLogout = () => {
    logout();
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

  const renderUserSection = () => {
    if (!user) {
      return (
        <Link
          to="/login"
          className="text-emerald-500 hover:text-emerald-600 font-medium"
        >
          Login
        </Link>
      );
    }

    // Show username and a mock-avatar (first letter, capitalized)
    const displayName = isGuest ? "Guest User" : user.name;
    const avatarBg = isGuest ? "bg-gray-400" : "bg-emerald-500";
    const avatarText = isGuest ? (
      <UserOutlined />
    ) : (
      <span className="text-white font-bold text-lg">
        {user.name?.charAt(0).toUpperCase()}
      </span>
    );

    return (
      <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
        <div className="flex items-center gap-2 cursor-pointer">
          <p className="text-gray-700 font-semibold">{displayName}</p>
          <Avatar
            size={40}
            className={avatarBg}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {avatarText}
          </Avatar>
        </div>
      </Dropdown>
    );
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="grid grid-cols-3 p-4">
        <div className="col-span-1 text-lg md:text-2xl sm:text-lg font-bold text-emerald-600 px-6">
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
          {renderUserSection()}
        </div>
      </div>
    </div>
  );
};

export default Header;
