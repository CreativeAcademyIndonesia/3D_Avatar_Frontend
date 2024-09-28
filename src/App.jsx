import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { UI } from "./components/UI";
import { Login } from "./page/login";
import { Mainavatar } from "./page/Mainavatar";
import { Dashboard } from "./page/dashboard";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useChat } from "./hooks/useChat";
import Swal from 'sweetalert2';
import { Register } from "./page/register";
import { ResetPassword } from "./page/ResetPassword";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useChat();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={
          <ProtectedRoute>
            <ResetPassword />
          </ProtectedRoute>
        } />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Mainavatar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
