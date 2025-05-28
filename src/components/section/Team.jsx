import { Avatar } from "antd";

const Team = () => {
  const teamMembers = [
    {
      name: "Nguyễn Thị Tuyết Nhung",
      role: "Team member",
      image: "/Nhung.jpg",
    },
    {
      name: "Lý Hùng Quốc Châu",
      role: "Team member",
      image: "/Chou.jpg",
    },
    {
      name: "Lê Hữu Thành",
      role: "Team member",
      image: "/Kaka.jpg",
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
