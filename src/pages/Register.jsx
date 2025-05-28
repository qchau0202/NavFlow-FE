import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox } from "antd";
import { register } from "../services/api";
import { toast } from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const { firstName, lastName, ...rest } = values;
      const payload = {
        ...rest,
        name: `${firstName} ${lastName}`,
      };
      await register(payload);
      toast.success("Registration successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    }
  };

  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="col-span-1 bg-emerald-500 flex justify-center items-center border-r border-gray-300">
        <div className="w-2/3">
          <img
            src="/bg_register.png"
            alt="register"
            className="w-full h-full object-cover"
          />
          <div>
            <h1 className="text-4xl font-bold text-center text-white">
              Join SmartRide Today!
            </h1>
            <p className="text-center text-white">
              Create your account and start booking rides with SmartRide.
            </p>
          </div>
        </div>
      </div>
      <div className="col-span-1 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-center text-emerald-500">
              Register
            </h1>
          </div>
          <Form
            name="register"
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  { required: true, message: "Please enter your first name" },
                ]}
              >
                <Input
                  placeholder="Enter your first name"
                  size="md"
                  className="rounded-md"
                />
              </Form.Item>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  { required: true, message: "Please enter your last name" },
                ]}
              >
                <Input
                  placeholder="Enter your last name"
                  size="md"
                  className="rounded-md"
                />
              </Form.Item>
            </div>
            
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please enter your email" }]}
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  size="md"
                  className="rounded-md"
                />
              </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please create a password" }]}
            >
              <Input.Password
                placeholder="Create a password"
                size="md"
                className="rounded-md"
              />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Confirm your password"
                size="md"
                className="rounded-md"
              />
            </Form.Item>

            <Form.Item
              name="terms"
              valuePropName="checked"
              rules={[
                { required: true, message: "You must agree to the terms" },
              ]}
            >
              <Checkbox className="text-gray-700">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-emerald-500 hover:text-emerald-600"
                >
                  Terms and Conditions
                </Link>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="md"
                className="w-full bg-emerald-500 hover:bg-emerald-600 font-semibold rounded-md"
                style={{ borderRadius: 8 }}
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-emerald-500 hover:text-emerald-600 font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
