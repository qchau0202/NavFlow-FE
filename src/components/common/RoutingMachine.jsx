import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import {
  FaMapMarkerAlt,
  FaFlagCheckered,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaCircle,
} from "react-icons/fa";

const getInstructionIcon = (text, index, total) => {
  if (index === 0)
    return <FaMapMarkerAlt className="text-blue-500 mr-2 min-w-5" />;
  if (index === total - 1)
    return <FaFlagCheckered className="text-green-500 mr-2 min-w-5" />;
  if (/left/i.test(text))
    return <FaArrowLeft className="text-indigo-500 mr-2 min-w-5" />;
  if (/right/i.test(text))
    return <FaArrowRight className="text-indigo-500 mr-2 min-w-5" />;
  if (/straight|continue/i.test(text))
    return <FaArrowUp className="text-indigo-500 mr-2 min-w-5" />;
  if (/circle|roundabout/i.test(text))
    return <FaCircle className="text-yellow-500 mr-2 min-w-5" />;
  return <FaArrowUp className="text-gray-400 mr-2 min-w-5" />;
};

const RoutingMachine = ({ waypoints, color = "#3388ff", weight = 3 }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: waypoints.map((point) => L.latLng(point[0], point[1])),
      routeWhileDragging: false,
      show: true,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color, weight }],
      },
    }).addTo(map);

    setTimeout(() => {
      const instructions = document.querySelector(".leaflet-routing-container");
      if (instructions) {
        instructions.className =
          "z-[2000] bg-white rounded-xl shadow-xl px-5 py-4 max-w-sm min-w-[220px] overflow-y-auto text-base text-gray-800 font-[Lexend]";
        instructions.style.fontFamily = "Lexend, sans-serif";
        instructions.style.zIndex = 2000;
        // Style headings and lists
        instructions.querySelectorAll("h2, h3").forEach((h) => {
          h.className = "text-lg font-semibold mb-2";
        });
        instructions.querySelectorAll("ol").forEach((ol) => {
          ol.className = "pl-5";
        });
        // Enhance each instruction row with icons and flex
        const items = instructions.querySelectorAll("li");
        items.forEach((li, idx) => {
          li.className = "mb-2 leading-relaxed flex items-center gap-2";
          // Remove any previous icon span
          if (
            li.firstChild &&
            li.firstChild.classList &&
            li.firstChild.classList.contains("routing-icon")
          ) {
            li.removeChild(li.firstChild);
          }
          // Create a span for the icon
          const iconSpan = document.createElement("span");
          iconSpan.className = "routing-icon flex-shrink-0";
          // Render the icon as SVG using React Icons
          let icon = getInstructionIcon(li.textContent, idx, items.length);
          // Render icon to string and set as innerHTML
          const temp = document.createElement("span");
          temp.appendChild(icon.type(icon.props));
          iconSpan.innerHTML = temp.innerHTML;
          li.prepend(iconSpan);
        });
      }
    }, 0);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, waypoints, color, weight]);

  return null;
};

export default RoutingMachine;
