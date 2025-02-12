
import { Home, Clock, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const NavigationBar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6 flex justify-around items-center">
      <Link
        to="/"
        className={`flex flex-col items-center space-y-1 ${
          isActive("/") ? "text-primary" : "text-gray-500"
        }`}
      >
        <Home size={24} />
        <span className="text-xs">Inicio</span>
      </Link>
      <Link
        to="/history"
        className={`flex flex-col items-center space-y-1 ${
          isActive("/history") ? "text-primary" : "text-gray-500"
        }`}
      >
        <Clock size={24} />
        <span className="text-xs">Historial</span>
      </Link>
      <Link
        to="/settings"
        className={`flex flex-col items-center space-y-1 ${
          isActive("/settings") ? "text-primary" : "text-gray-500"
        }`}
      >
        <Settings size={24} />
        <span className="text-xs">Ajustes</span>
      </Link>
    </nav>
  );
};

export default NavigationBar;
