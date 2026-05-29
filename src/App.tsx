import { Route, Routes } from "react-router-dom";
import { BoothProvider } from "./context/BoothContext";
import { AdminScreen, BoothFlow } from "./screens";

export default function App() {
  return (
    <BoothProvider>
      <Routes>
        <Route path="/" element={<BoothFlow />} />
        <Route path="/admin" element={<AdminScreen />} />
      </Routes>
    </BoothProvider>
  );
}
