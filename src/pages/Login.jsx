import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox, Divider } from "antd";
import { login } from "../services/api";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { loginAsGuest } = useAuth();

  const onFinish = async (values) => {
    try {
      const res = await login(values);
      localStorage.setItem("token", res.data.access_token);
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Login failed");
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    toast.success("Logged in as guest!");
    navigate("/");
  };

  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="col-span-1 bg-emerald-500 flex justify-center items-center border-r border-gray-300">
        <div className="w-2/3">
          <img
            src="/bg_login.png"
            alt="login"
            className="w-full h-full object-cover"
          />
          <div>
            <h1 className="text-4xl font-bold text-center text-white">
              Welcome to NavFlow!
            </h1>
            <p className="text-center text-white">
              NavFlow is a platform where you can find the best route for your
              journey.
            </p>
          </div>
        </div>
      </div>
      <div className="col-span-1 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-[450px]">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-center text-emerald-500">
              Login
            </h1>
          </div>

          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            className="space-y-6"
            requiredMark={false}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please enter your email" }]}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                size="large"
                className="rounded-md"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password
                placeholder="Enter your password"
                size="large"
                className="rounded-md"
              />
            </Form.Item>

            <div className="flex items-center justify-between mb-2">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-gray-700">Remember me</Checkbox>
              </Form.Item>
              <Link
                to="/forgot-password"
                className="text-sm text-emerald-500 hover:text-emerald-600"
              >
                Forgot password?
              </Link>
            </div>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="w-full bg-emerald-500 hover:bg-emerald-600 font-semibold rounded-md"
                style={{ borderRadius: 8 }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <Divider className="my-6">or</Divider>

          <Button
            type="default"
            size="large"
            className="w-full font-semibold rounded-md"
            style={{ borderRadius: 8 }}
            onClick={handleGuestLogin}
          >
            Continue as Guest
          </Button>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-emerald-500 hover:text-emerald-600 font-medium"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
