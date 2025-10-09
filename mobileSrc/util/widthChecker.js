import { Dimensions } from "react-native";

export default function DeviceType() {
  const { width } = Dimensions.get("window");

  let deviceType = "mobile";

  // Determine device type based on window width
  if (width <= 640) {
    deviceType = "mobile";
  } else if (width > 640 && width <= 1008) {
    deviceType = "tablet";
  } else if (width > 1008) {
    deviceType = "desktop";
  }

  return deviceType;
}
