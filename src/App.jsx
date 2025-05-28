import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { ConfigProvider } from "antd";
import { Toaster } from "react-hot-toast";
import antdTheme from "./contexts/ThemeContext";
const App = () => {
  return (
    <ConfigProvider
      theme={antdTheme}
    >
      <RouterProvider
        router={router}
        fallbackElement={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }
      />
      <Toaster
        position="top-right"
      />
    </ConfigProvider>
  );
};

export default App;
