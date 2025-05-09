"use client";

import { type ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  UserPlus,
  LayoutDashboard,
  Calendar,
  User,
  Menu,
  X,
  LogOut,
  PenTool,
} from "lucide-react";
import { useAuth, type UserData, type VolunteerUser } from "../../hooks/useAuth";

interface VolunteerLayoutProps {
  children: ReactNode;
}

const VolunteerLayout = ({ children }: VolunteerLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  // Add type guard for VolunteerUser
  const isVolunteerUser = (user: UserData | null): user is VolunteerUser => {
    return user !== null && 'email' in user && 'experience' in user;
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed z-50 p-2 bg-blue-600 rounded-md shadow-lg text-white md:hidden top-4 left-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-center h-16 px-6 bg-blue-600 text-white">
          <UserPlus className="mr-2" size={24} />
          <h1 className="text-xl font-bold">Volunteer</h1>
        </div>

        <nav className="px-4 py-6 space-y-2">
          <Link
            to="/volunteer/dashboard"
            className={`flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors ${
              isActive("/volunteer/dashboard")
                ? "bg-blue-100 text-blue-700 font-medium"
                : "hover:bg-blue-50"
            }`}
          >
            <LayoutDashboard className="mr-3" size={20} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/volunteer/calendar"
            className={`flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors ${
              isActive("/volunteer/calendar")
                ? "bg-blue-100 text-blue-700 font-medium"
                : "hover:bg-blue-50"
            }`}
          >
            <Calendar className="mr-3" size={20} />
            <span>Calendar</span>
          </Link>

          <Link
            to="/volunteer/profile"
            className={`flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors ${
              isActive("/volunteer/profile")
                ? "bg-blue-100 text-blue-700 font-medium"
                : "hover:bg-blue-50"
            }`}
          >
            <User className="mr-3" size={20} />
            <span>Profile</span>
          </Link>

          <Link
            to="/volunteer/create-test"
            className={`flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors ${
              isActive("/volunteer/create-test")
                ? "bg-blue-100 text-blue-700 font-medium"
                : "hover:bg-blue-50"
            }`}
          >
            <PenTool className="mr-3" size={20} />
            <span>Create Test</span>
          </Link>
        </nav>

        <div className="border-t border-gray-200 pt-4 space-y-4">
          <div className="px-4 py-2">
            <p className="text-sm text-gray-500">Volunteer Name</p>
            <p className="text-sm font-medium text-gray-900">
              {isVolunteerUser(user) ? user.name : 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {isVolunteerUser(user) ? user.email : 'N/A'}
            </p>
          </div>

          <button
            onClick={() => {
              logout();
              navigate("/login",{replace: true});
            }}
            className="flex items-center w-full px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3" size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto w-full">
        <main className="p-6 h-full">{children}</main>
      </div>
    </div>
  );
};

export default VolunteerLayout;
