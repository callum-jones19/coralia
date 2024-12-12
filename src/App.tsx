import { BrowserRouter, Route, Routes } from "react-router";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import OnboardingScreen from "./screens/OnboardingScreen";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route
            path="/"
            element={<HomeScreen />}
          /> */}
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
