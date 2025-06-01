import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Playground from "../pages/Playground";
import AppLayout from "../layout/AppLayout";
import LandingPage from "../pages/LandingPage";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { useAuth } from "../contexts/AuthContext";
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "/playground",
        element: <Playground />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
