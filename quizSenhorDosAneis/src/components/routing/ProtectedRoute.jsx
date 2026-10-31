import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingScreen from "../LoadingScreen";

// Só deixa entrar com sessão válida; enquanto reidrata a sessão (F5), mostra o carregamento
function ProtectedRoute({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") return <LoadingScreen message="Reunindo a Sociedade..." />;
  if (status !== "authenticated") return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

export default ProtectedRoute;
