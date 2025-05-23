import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { ConfigProvider } from "antd";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Lexend",
        },
        components: {
          Button: {
            defaultHoverBorderColor: "rgba(0, 188, 125, 1)",
            defaultHoverColor: "rgba(0, 188, 125, 1)",
          },
        },
      }}
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
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 2000,
            theme: {
              primary: "#4aed88",
            },
          },
          error: {
            duration: 2000,
            theme: {
              primary: "#ff4b4b",
            },
          },
        }}
      />
    </ConfigProvider>
  );
};

export default App;
