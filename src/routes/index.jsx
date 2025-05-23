import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Playground from "../pages/Playground";
import AppLayout from "../layout/AppLayout";
import LandingPage from "../pages/LandingPage";
import Profile from "../pages/Profile";
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
]);

export default router;
