import { useBooth } from "../context/BoothContext";
import { AdminScreen } from "./AdminScreen";
import { AttractScreen } from "./AttractScreen";
import { IntakeScreen } from "./IntakeScreen";
import { IntensityScreen } from "./IntensityScreen";
import { PitchScreen } from "./PitchScreen";
import { RoastScreen } from "./RoastScreen";
import { ScanScreen } from "./ScanScreen";
import { ShareScreen } from "./ShareScreen";
import { ViolationsScreen } from "./ViolationsScreen";

export function BoothFlow() {
  const { screen } = useBooth();

  switch (screen) {
    case "attract":
      return <AttractScreen />;
    case "intake":
      return <IntakeScreen />;
    case "intensity":
      return <IntensityScreen />;
    case "scan":
      return <ScanScreen />;
    case "roast":
      return <RoastScreen />;
    case "violations":
      return <ViolationsScreen />;
    case "pitch":
      return <PitchScreen />;
    case "share":
      return <ShareScreen />;
    default:
      return <AttractScreen />;
  }
}

export { AdminScreen };
