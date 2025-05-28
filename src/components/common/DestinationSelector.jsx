 import React from "react";

 const DestinationSelector = ({
   cameras,
   selectedDestinations,
   onDestinationSelect,
   trafficData,
 }) => {
   return (
     <div className="absolute top-0 left-0 w-64 z-[1000] p-4 h-full">
       <div className="h-full bg-white rounded-lg shadow-lg p-4 border border-gray-200 flex flex-col">
         <h3 className="text-lg font-semibold mb-4">Select Destinations</h3>
         <div className="flex-1 overflow-y-auto">
           {cameras.map((camera) => (
             <div
               key={camera.id}
               className={`p-2 rounded cursor-pointer transition-colors ${
                 selectedDestinations.find((dest) => dest.id === camera.id)
                   ? "bg-blue-100 border border-blue-500"
                   : "hover:bg-gray-100 border border-transparent"
               }`}
               onClick={() => onDestinationSelect(camera)}
             >
               <p className="font-medium">{camera.name}</p>
               <p className="text-sm text-gray-600">
                 Status:{" "}
                 <span
                   className={`text-${
                     camera.status === "active" ? "green" : "red"
                   }-500`}
                 >
                   {camera.status}
                 </span>
               </p>
             </div>
           ))}
         </div>
         {trafficData.length > 0 && (
           <div className="mt-4">
             <h4 className="font-semibold mb-2">Route Traffic Data:</h4>
             <div className="max-h-32 overflow-y-auto">
               {trafficData.map((pathData, idx) => (
                 <div key={idx} className="text-sm text-gray-700">
                   Path {idx + 1}:
                   <ul className="ml-4">
                     {pathData.map((segment, segIdx) => (
                       <li key={segIdx}>
                         Segment {segIdx + 1}: {segment.fullness.toFixed(2)}%
                         full ({segment.total_vehicles} vehicles)
                       </li>
                     ))}
                   </ul>
                 </div>
               ))}
             </div>
           </div>
         )}
       </div>
     </div>
   );
 };

 export default DestinationSelector;