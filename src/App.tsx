import { Route, Routes } from "react-router-dom";
import { BoothProvider } from "./context/BoothContext";
import { AdminScreen, BoothFlow } from "./screens";
import { ShareMobileScreen } from "./screens/ShareMobileScreen";

export default function App() {
  return (
    <Routes>
      <Route path="/s/:shareId" element={<ShareMobileScreen />} />
      <Route
        path="/*"
        element={
          <BoothProvider>
            <Routes>
              <Route path="/" element={<BoothFlow />} />
              <Route path="/admin" element={<AdminScreen />} />
            </Routes>
          </BoothProvider>
        }
      />
    </Routes>
  );
}
