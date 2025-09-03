import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user")); // example, adjust to your auth setup

  if (!user) {
    // not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // logged in but not authorized → redirect to home
    return <Navigate to="/" replace />;
  }

  return children; // authorized → render child
};

export default ProtectedRoute;
