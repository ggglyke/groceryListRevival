import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PrivateRoute({ authenticated, redirectTo = "/login" }) {
  const location = useLocation();
  return authenticated ? (
    <Outlet />
  ) : (
    <Navigate to={redirectTo} replace state={{ from: location }} />
  );
}
