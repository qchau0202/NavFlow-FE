import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import AppLayout from "../components/layout/AppLayout";

// Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   // TODO: Implement authentication check
//   const isAuthenticated = true; // This should be replaced with actual auth check
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };

// Public Route Component
// const PublicRoute = ({ children, allowAuthenticated = false }) => {
//   // TODO: Implement authentication check
//   const isAuthenticated = false; // This should be replaced with actual auth check
//   return !isAuthenticated || allowAuthenticated ? (
//     children
//   ) : (
//     <Navigate to="/" replace />
//   );
// };

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: "dashboard",
    element: <Dashboard />,
  },
]);

export default router;
