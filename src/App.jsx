import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { UI } from "./components/UI";
import { Login } from "./page/login";
import { Mainavatar } from "./page/Mainavatar";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useChat } from "./hooks/useChat";

function App() {
  const { token } = useChat();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Mainavatar />} />
      </Routes>
    </Router>
  );
}

export default App;
