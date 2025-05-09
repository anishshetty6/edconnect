"use client";

import { type ReactNode, useState } from "react";
import { Link , useLocation, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Calendar,
  PenTool,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useAuth, type UserData, type StudentUser } from "../../hooks/useAuth";

interface StudentLayoutProps {
  children: ReactNode;
}

const StudentLayout = ({ children }: StudentLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Type guard to check if user is a StudentUser
  const isStudentUser = (user: UserData | null): user is StudentUser => {
    return user !== null && 'sapId' in user && 'standard' in user;
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed z-50 p-2 bg-purple-600 rounded-md shadow-lg text-white md:hidden top-4 left-4"
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
        <div className="flex items-center justify-center h-16 px-6 bg-purple-600 text-white">
          <GraduationCap className="mr-2" size={24} />
          <h1 className="text-xl font-bold">Student Portal</h1>
        </div>

        <nav className="px-4 py-6 space-y-2">
          <Link
            to="/student/dashboard"
            className={`flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors ${
              isActive("/student/dashboard")
                ? "bg-purple-100 text-purple-700 font-medium"
                : "hover:bg-purple-50"
            }`}
          >
            <LayoutDashboard className="mr-3" size={20} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/student/subjects"
            className={`flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors ${
              isActive("/student/subjects")
                ? "bg-purple-100 text-purple-700 font-medium"
                : "hover:bg-purple-50"
            }`}
          >
            <BookOpen className="mr-3" size={20} />
            <span>Subjects</span>
          </Link>

          <Link
            to="/student/calendar"
            className={`flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors ${
              isActive("/student/calendar")
                ? "bg-purple-100 text-purple-700 font-medium"
                : "hover:bg-purple-50"
            }`}
          >
            <Calendar className="mr-3" size={20} />
            <span>Calendar</span>
          </Link>

          <Link
            to="/student/practice"
            className={`flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors ${
              isActive("/student/practice")
                ? "bg-purple-100 text-purple-700 font-medium"
                : "hover:bg-purple-50"
            }`}
          >
            <PenTool className="mr-3" size={20} />
            <span>Practice</span>
          </Link>
        </nav>

        <div className="border-t border-gray-200 pt-4 space-y-4">
          <div className="px-4 py-2">
            <p className="text-sm text-gray-500">Student Name</p>
            <p className="text-sm font-medium text-gray-900">
              {isStudentUser(user) ? user.name : 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              SAP ID: {isStudentUser(user) ? user.sapId : 'N/A'}
            </p>
            <p className="text-xs text-gray-500">
              Standard: {isStudentUser(user) ? user.standard : 'N/A'}
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

export default StudentLayout;
