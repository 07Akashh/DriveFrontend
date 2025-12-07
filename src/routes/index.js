import { useRoutes } from "react-router-dom";
import MainRoutes from "./MainRoutes";
import { useAuth } from "../context/AuthContext";

export default function ThemeRoutes() {
  const { user, accessToken, loading, isLoggedIn } = useAuth();
  const routing = useRoutes(MainRoutes(isLoggedIn, user, accessToken));

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner w-8 h-8" />
      </div>
    );
  }

  return <>{routing}</>;
}
