"use client";

import { type ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  School,
  LayoutDashboard,
  Users,
  FileText,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface SchoolLayoutProps {
  children: ReactNode;
}

const SchoolLayout = ({ children }: SchoolLayoutProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate("/login",{replace: true});
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed z-50 p-2 bg-green-600 rounded-md shadow-lg text-white md:hidden top-4 left-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-center h-16 px-6 bg-green-600 text-white">
          <School className="mr-2" size={24} />
          <h1 className="text-xl font-bold">School Portal</h1>
        </div>

        <nav className="flex flex-col h-[calc(100%-4rem)] px-4 py-6">
          <div className="flex-1 space-y-2">
            <Link
              to="/school/dashboard"
              className={`flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors ${
                isActive("/school/dashboard")
                  ? "bg-green-100 text-green-700 font-medium"
                  : "hover:bg-green-50"
              }`}
            >
              <LayoutDashboard className="mr-3" size={20} />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/school/requests"
              className={`flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors ${
                isActive("/school/requests")
                  ? "bg-green-100 text-green-700 font-medium"
                  : "hover:bg-green-50"
              }`}
            >
              <FileText className="mr-3" size={20} />
              <span>Requests</span>
            </Link>

            <Link
              to="/school/students"
              className={`flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors ${
                isActive("/school/students")
                  ? "bg-green-100 text-green-700 font-medium"
                  : "hover:bg-green-50"
              }`}
            >
              <Users className="mr-3" size={20} />
              <span>Students</span>
            </Link>
          </div>

          {/* School Name and Logout Section */}
          <div className="border-t border-gray-200 pt-4 space-y-4">
            <div className="px-4 py-2">
              <p className="text-sm text-gray-500">School Name</p>
              <p className="text-sm font-medium text-gray-900">
                {user?.schoolName}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="mr-3" size={20} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto w-full">
        <main className="p-6 h-full">{children}</main>
      </div>
    </div>
  );
};

export default SchoolLayout;
