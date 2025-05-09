import { useNavigate } from "react-router-dom";
import { useAuth, type UserData, type SchoolUser, type VolunteerUser, type StudentUser } from "../hooks/useAuth";

// Type guard functions
const isSchoolUser = (user: UserData | null): user is SchoolUser => {
  return user !== null && 'schoolName' in user;
};

const isNamedUser = (user: UserData | null): user is VolunteerUser | StudentUser => {
  return user !== null && 'name' in user;
};

const Navbar = () => {
  const { user , logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user ? (isNamedUser(user) ? user.name : isSchoolUser(user) ? user.schoolName : '') : '';

  return (
    <nav className="bg-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* ...existing code... */}
          </div>

          <div className="flex items-center">
            <span className="mr-4">{displayName}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
