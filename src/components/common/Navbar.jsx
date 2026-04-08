import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  LogOut,
  User,
  Settings,
  ChevronRight,
  Home,
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    if (isLoggingOut) return; // prevent double click

    // Trigger animation
    setIsLoggingOut(true);

    // Wait for animation to complete (300ms), then logout
    setTimeout(() => {
      localStorage.removeItem("adminToken");
      navigate("/", { replace: true });
    }, 300);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-20 relative">
      {/* Left: Breadcrumbs & Page Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-gray-400">
          <Home size={16} />
          <ChevronRight size={14} />
        </div>
        <h2 className="text-sm font-semibold text-gray-800 tracking-tight">
          Admin Dashboard
        </h2>
      </div>

      {/* Center: Global Search */}
      <div className="hidden md:flex relative w-96">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search for orders, users or products..."
          className="w-full bg-gray-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
        />
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg relative transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Settings */}
        <Link to="/admin/settings">
          <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
            <Settings size={20} />
          </button>
        </Link>

        <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>

        {/* User Profile & Logout Button with Animation */}
        <div className="flex items-center gap-3 pl-2 group cursor-pointer relative">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-gray-900">Velora Admin</p>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter">
              Superuser
            </p>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 cursor-pointer bg-gray-900 text-white p-1 pr-3 rounded-full hover:bg-gray-800 transition-all relative overflow-hidden"
          >
            <div className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] font-bold relative z-10">
              VA
            </div>
            <LogOut size={14} className="text-gray-400 relative z-10" />

            {/* Ripple animation element */}
            {isLoggingOut && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="absolute w-0 h-0 bg-white/30 rounded-full animate-logout-ripple"></span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Add custom keyframe animation */}
      <style>{`
        @keyframes logoutRipple {
          0% {
            width: 0;
            height: 0;
            opacity: 0.6;
          }
          100% {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }
        .animate-logout-ripple {
          animation: logoutRipple 0.3s ease-out forwards;
        }
      `}</style>
    </header>
  );
}