import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute({ authenticated, isAdmin }) {
  if (!authenticated) return <Navigate to="/login" replace />;
  return isAdmin ? <Outlet /> : <Navigate to="/lists" replace />;
}
