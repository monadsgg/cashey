import { Outlet, Navigate } from "react-router";
import AppLayout from "../layouts/AppLayout";
import { isAuthenticated } from "../utils/auth";

function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export default ProtectedRoute;
