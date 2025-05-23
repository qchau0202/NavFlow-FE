import {
  GithubOutlined,
  LinkedinOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Avatar, Tooltip } from "antd";

const Team = () => {
  const teamMembers = [
    {
      name: "Nguyễn Thị Tuyết Nhung",
      role: "Team member",
      image: "https://placehold.co/300x400",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "mailto:john@example.com",
    },
    {
      name: "Lý Hùng Quốc Châu",
      role: "Team member",
      image: "https://placehold.co/300x400",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "mailto:jane@example.com",
    },
    {
      name: "Lê Hữu Thành",
      role: "Team member",
      image: "https://placehold.co/300x400",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "mailto:mike@example.com",
    },
  ];

  return (
    <div className="h-screen w-full snap-start bg-white flex flex-col items-center justify-center gap-12 border-b border-gray-200 pb-24">
      <h2 className="text-3xl md:text-5xl sm:text-3xl font-bold text-emerald-700">
        Our Team
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl px-4">
        {teamMembers.map((member, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow"
          >
            <Avatar src={member.image} size={200} className="mb-4 rounded-xl" />
            <h3 className="text-xl font-semibold text-emerald-700 mb-1">
              {member.name}
            </h3>
            <p className="text-gray-600 mb-4">{member.role}</p>
            <div className="flex gap-4">
              <Tooltip title="GitHub">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  <GithubOutlined className="text-2xl" />
                </a>
              </Tooltip>
              <Tooltip title="LinkedIn">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  <LinkedinOutlined className="text-2xl" />
                </a>
              </Tooltip>
              <Tooltip title="Email">
                <a
                  href={member.email}
                  className="text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  <MailOutlined className="text-2xl" />
                </a>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
