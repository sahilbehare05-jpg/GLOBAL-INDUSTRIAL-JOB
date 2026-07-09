import { useAuth } from "../context/AuthContext";

// Simple helper hook that returns auth state so pages/components
// can decide whether to render or redirect. Actual redirect logic
// lives in the ProtectedRoute / AdminRoute components.
const useProtectedRoute = () => {
  const { user, loading } = useAuth();
  return { user, loading, isAuthenticated: !!user };
};

export default useProtectedRoute;
