import { FaTrafficLight, FaChartBar, FaMapMarkedAlt } from "react-icons/fa";
const Features = () => {
  const features = [
    {
      icon: <FaTrafficLight className="text-emerald-500 text-3xl mb-4" />,
      title: "Predicts Congestions",
      desc: "Predicts congestions based on camera data for smarter travel.",
    },
    {
      icon: <FaChartBar className="text-emerald-500 text-3xl mb-4" />,
      title: "Admin Dashboard",
      desc: "View statistical data from each camera in a powerful dashboard.",
    },
    {
      icon: <FaMapMarkedAlt className="text-emerald-500 text-3xl mb-4" />,
      title: "User-friendly Map UI",
      desc: "Interact with an intuitive map to plan and optimize your route.",
    },
  ];

  return (
    <div className="h-screen w-full snap-start bg-emerald-50 flex flex-col items-center justify-center gap-12 border-b border-gray-200 pb-24">
      <h2 className="text-3xl md:text-5xl sm:text-3xl font-bold text-emerald-700">
        Key Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center text-center border border-emerald-100 hover:shadow-xl transition-shadow"
          >
            {feature.icon}
            <h3 className="text-xl md:text-2xl sm:text-xl font-semibold text-emerald-700 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 md:text-lg sm:text-base">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Features;
