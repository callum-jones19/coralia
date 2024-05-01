import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeScreen from "./HomeScreen";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

