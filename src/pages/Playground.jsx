import Map from "../components/common/Map";
import { useAllCamerasDetection } from "../hooks/useAllCamerasDetection";

const Playground = () => {
  const {
    cameras,
    detectionResults,
    isLoading,
    error,
    // isDetecting, // you can use this if you want to show a loading indicator
  } = useAllCamerasDetection();

  return (
    <div className="h-full">
      <Map
        cameras={cameras}
        detectionResults={detectionResults}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default Playground;
