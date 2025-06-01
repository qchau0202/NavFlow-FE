import { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      updateUser({
        ...user,
        ...values,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // If user is not logged in or is a guest
  if (!user || user.role === "guest") {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Card className="mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile</h1>
            <p className="text-gray-600">
              Please log in to view and edit your profile.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Card className="mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            username: user.username,
            email: user.email,
            // Add other fields as needed
          }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[
              {
                required: true,
                message: "Please input your current password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600"
            >
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;
