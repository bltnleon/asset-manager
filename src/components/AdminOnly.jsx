import { Navigate, useOutletContext } from "react-router-dom";

function AdminOnly({ children }) {
  const { user } = useOutletContext();

  if (user.role !== "admin") {
    return <Navigate to="/dashboard/inventory" replace />;
  }

  return children;
}

export default AdminOnly;
