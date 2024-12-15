import { BrowserRouter, Route, Routes } from "react-router";
import HomeScreen from "./screens/HomeScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import SettingsScreen from "./screens/SettingsScreen";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/home"
            element={<HomeScreen />}
          />
          <Route
            path="/"
            element={<OnboardingScreen />}
          />
          <Route
            path="/settings"
            element={<SettingsScreen />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
