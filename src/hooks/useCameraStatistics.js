import { useMemo } from "react";
import {
  getDensityLevel,
  getVehicleChange,
  getMostCommonVehicle,
  getPeakHour,
  getHighestDensity,
} from "../utils/statistics";

export function useCameraStatistics(data) {
  return useMemo(() => {
    if (!data) {
      return {
        error: null,
        statistics: null,
      };
    }

    const {
      total_vehicles = 0,
      fullness = 0,
      timestamp,
      vehicle_types = {},
      average_confidence = 0,
      detections = [],
      previous_period_count = 0,
      flow_rate = 0,
      peak_hours = [],
      detection_accuracy = 0,
      frames_processed = 0,
    } = data;

    const densityLevel = getDensityLevel(fullness);
    const vehicleChange = getVehicleChange(
      total_vehicles,
      previous_period_count
    );
    const mostCommonVehicle = getMostCommonVehicle(vehicle_types);
    const highestDensity = getHighestDensity(fullness);
    const peakHour = getPeakHour(peak_hours);

    return {
      error: null,
      statistics: {
        densityLevel,
        fullness,
        flow_rate,
        vehicleChange,
        total_vehicles,
        vehicle_types,
        mostCommonVehicle,
        timestamp,
        peak_hours,
        average_confidence,
        detection_accuracy,
        frames_processed,
        detections,
        highestDensity,
        peakHour,
      },
    };
  }, [data]);
}
