// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const ProtectedRoute = ({ children, roles }) => {
//   const { isAuthenticated, role } = useSelector((state) => state.auth);
  
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (roles && !roles.includes(role)) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, role, loading } = useSelector(
    (state) => state.auth
  );

  const location = useLocation();

  // 1️⃣ Wait until auth state is resolved (important for JWT/cookie apps)
  if (loading) {
    return null; // or return <Loader />
  }

  // 2️⃣ If not logged in → redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}   // 👈 remember intended route
      />
    );
  }

  // 3️⃣ If role is not allowed → redirect to Unauthorized page
  if (roles && !roles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4️⃣ Authorized → render page
  return children;
};

export default ProtectedRoute;

