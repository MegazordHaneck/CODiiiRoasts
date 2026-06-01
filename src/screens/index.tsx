import { BottomFlameBar } from "../components/BottomFlameBar";
import { useBooth } from "../context/BoothContext";
import { AdminScreen } from "./AdminScreen";
import { AttractScreen } from "./AttractScreen";
import boothStyles from "./BoothFlow.module.css";
import { IntakeScreen } from "./IntakeScreen";
import { IntensityScreen } from "./IntensityScreen";
import { PitchScreen } from "./PitchScreen";
import { RoastScreen } from "./RoastScreen";
import { ScanScreen } from "./ScanScreen";
import { ShareScreen } from "./ShareScreen";
import { ViolationsScreen } from "./ViolationsScreen";

export function BoothFlow() {
  const { screen } = useBooth();

  let content;
  switch (screen) {
    case "attract":
      content = <AttractScreen />;
      break;
    case "intake":
      content = <IntakeScreen />;
      break;
    case "intensity":
      content = <IntensityScreen />;
      break;
    case "scan":
      content = <ScanScreen />;
      break;
    case "roast":
      content = <RoastScreen />;
      break;
    case "violations":
      content = <ViolationsScreen />;
      break;
    case "pitch":
      content = <PitchScreen />;
      break;
    case "share":
      content = <ShareScreen />;
      break;
    default:
      content = <AttractScreen />;
  }

  return (
    <>
      <BottomFlameBar />
      <div className={boothStyles.shell}>{content}</div>
    </>
  );
}

export { AdminScreen };
