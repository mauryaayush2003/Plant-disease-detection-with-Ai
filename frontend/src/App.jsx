import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "./context/LangContext";
import Landing from "./pages/Landing";
import Detect from "./pages/Detect";
import Chat from "./pages/Chat";
import Results from "./pages/Results";

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/detect" element={<Detect />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </BrowserRouter>
    </LangProvider>
  );
}
