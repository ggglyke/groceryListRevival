import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PrivateRoute({ authenticated, redirectTo = "/login" }) {
  const location = useLocation();
  console.log(
    "PrivateRoute authenticated =",
    authenticated,
    "from",
    location.pathname
  );
  return authenticated ? (
    <Outlet />
  ) : (
    <Navigate to={redirectTo} replace state={{ from: location }} />
  );
}
