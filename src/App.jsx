// radhe radhe

import "./fonts/fonts.css";
import { Route, Routes } from "react-router";
import Home from "./pages/home/Home";
import Video from "./pages/video/Video";

function App() {
  return (
    <>
      <Home />
      <Routes>
        <Route path="/video/:id" element={<Video />} />
      </Routes>
    </>
  );
}

export default App;
