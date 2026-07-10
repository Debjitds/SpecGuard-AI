import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { DashboardProvider } from "@/context/DashboardContext";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import DashboardPage from "@/pages/DashboardPage";
import type { ReactNode } from "react";

/** Wraps protected routes; redirects to /auth when there is no session. */
function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null; // AuthProvider restores session synchronously
  if (!user) return <Navigate to="/auth" replace state={{ from: location }} />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardProvider>
              <DashboardPage />
            </DashboardProvider>
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
