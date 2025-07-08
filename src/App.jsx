import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { UI } from "./components/UI";
import { Login } from "./page/login";
import { Mainavatar } from "./page/Mainavatar";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useChat } from "./hooks/useChat";
import Swal from 'sweetalert2';
import { Register } from "./page/register";
import { ResetPassword } from "./page/ResetPassword";
import { Dashboard } from "./page/dashboard";
import { ChatDetail } from "./page/ChatDetail";
import { UserManagement } from "./page/UserManagement";
import { ChatProvider } from "./hooks/useChat";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useChat();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { isAuthenticated, role } = useChat();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role !== 'admin') return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  return (
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
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/dashboard/detail/:nama"
        element={
          <AdminRoute>
            <ChatDetail />
          </AdminRoute>
        }
      />
      <Route
        path="/dashboard/users"
        element={
          <AdminRoute>
            <UserManagement />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ChatProvider>
      <Router>
        <AppRoutes />
      </Router>
    </ChatProvider>
  );
}

export default App;
