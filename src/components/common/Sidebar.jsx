import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Layers,
  Settings,
  LogOut,
  Store,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // Clear stored token
    navigate("/", { replace: true });  // Redirect to login page
  };

  // Active / inactive link styling
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      isActive
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`;

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard size={20} />,
      end: true,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <Package size={20} />,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <ShoppingCart size={20} />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <Users size={20} />,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: <Layers size={20} />,
    },
  ];

  return (
    <aside className="w-72 bg-[#0f1115] text-white h-screen p-6 flex flex-col border-r border-gray-800 overflow-y-auto">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Store size={24} className="text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">
          Velora <span className="text-indigo-500">Admin</span>
        </h1>
      </div>

      {/* Main Menu */}
      <div className="flex-1">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 mb-4">
          Main Menu
        </p>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={linkClass}
            >
              <span className="transition-transform duration-200 group-hover:scale-110">
                {item.icon}
              </span>
              <span className="font-medium text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Support */}
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 mt-10 mb-4">
          Support
        </p>

        <nav className="space-y-1">
          <NavLink to="/admin/settings" className={linkClass}>
            <Settings size={20} />
            <span className="font-medium text-sm">Settings</span>
          </NavLink>
        </nav>
      </div>

      {/* Footer / Admin Info & Logout */}
      <div className="pt-6 border-t border-gray-800">
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-sm">
            AD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Admin Name</span>
            <span className="text-xs text-gray-500">Super Admin</span>
          </div>
        </div>

        {/* Logout Button with onClick handler */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all group"
        >
          <LogOut
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}