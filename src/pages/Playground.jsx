import { useEffect } from "react";
import Map from "../components/common/Map";
import { useAllCamerasDetection } from "../hooks/useAllCamerasDetection";

const Playground = () => {
  const { startAllDetections, stopAllDetections } = useAllCamerasDetection();

  // Start detections when component mounts
  useEffect(() => {
    startAllDetections();

    // Stop detections when component unmounts
    return () => {
      stopAllDetections();
    };
  }, [startAllDetections, stopAllDetections]);

  return (
    <div className="h-full">
      <Map />
    </div>
  );
};

export default Playground;
