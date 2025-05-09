import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { School, UserPlus, User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getApiUrl } from "../../utils/api";

type UserType = "school" | "volunteer" | "student";


type StyleConfig = {
  button: string;
  selected: string;
  unselected: string;
};


interface LoginCredentials {
  school: {
    udiseNumber: string;
    password: string;
  };
  volunteer: {
    email: string;
    password: string;
  };
  student: {
    rollNumber: string;
    password: string;
  };
}

const userTypeStyles: Record<UserType, StyleConfig> = {
  school: {
    button: "bg-green-600 hover:bg-green-700",
    selected: "bg-green-600 text-white",
    unselected: "bg-gray-100 text-gray-600",
  },
  volunteer: {
    button: "bg-blue-600 hover:bg-blue-700",
    selected: "bg-blue-600 text-white",
    unselected: "bg-gray-100 text-gray-600",
  },
  student: {
    button: "bg-purple-600 hover:bg-purple-700",
    selected: "bg-purple-600 text-white",
    unselected: "bg-gray-100 text-gray-600",
  },
};

const Login = () => {
  const [userType, setUserType] = useState<UserType>("school");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const userTypes = [
    { type: "school" as const, icon: School, label: "School" },
    { type: "volunteer" as const, icon: UserPlus, label: "Volunteer" },
    { type: "student" as const, icon: User, label: "Student" },
  ] as const;

  const [credentials, setCredentials] = useState<LoginCredentials>({
    school: { udiseNumber: "", password: "" },
    volunteer: { email: "", password: "" },
    student: { rollNumber: "", password: "" },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [userType]: {
        ...prev[userType],
        [name]: value,
      },
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const endpoint = getApiUrl(`/api/${userType}/login`);
      let loginData;

      switch (userType) {
        case "school":
          loginData = {
            udiseNumber: credentials.school.udiseNumber,
            password: credentials.school.password,
          };
          break;
        case "volunteer":
          loginData = {
            email: credentials.volunteer.email,
            password: credentials.volunteer.password,
          };
          break;
        case "student":
          loginData = {
            sapId: credentials.student.rollNumber, // Changed to match API
            password: credentials.student.password,
          };
          break;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Login and then navigate
      await login(data, userType);
      navigate(`/${userType}/dashboard`, { replace: true });
    } catch (error: any) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderInputFields = () => {
    switch (userType) {
      case "school":
        return (
          <div className="space-y-4">
            <input
              name="udiseNumber"
              type="text"
              required
              value={credentials.school.udiseNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="UDISE Number"
            />
            <input
              name="password"
              type="password"
              required
              value={credentials.school.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Password"
            />
          </div>
        );

      case "volunteer":
        return (
          <div className="space-y-4">
            <input
              name="email"
              type="email"
              required
              value={credentials.volunteer.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Email Address"
            />
            <input
              name="password"
              type="password"
              required
              value={credentials.volunteer.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Password"
            />
          </div>
        );

      case "student":
        return (
          <div className="space-y-4">
            <input
              name="rollNumber"
              type="text"
              required
              value={credentials.student.rollNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Roll Number"
            />
            <input
              name="password"
              type="password"
              required
              value={credentials.student.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Password"
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Login</h2>
          {error && (
            <div className="mt-4 p-2 bg-red-100 text-red-600 rounded">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-4">
          {userTypes.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => setUserType(type)}
              className={`flex items-center p-2 rounded ${
                userType === type
                  ? userTypeStyles[type].selected
                  : userTypeStyles[type].unselected
              }`}
            >
              <Icon className="mr-2" size={18} />
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {renderInputFields()}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 text-white rounded-md ${userTypeStyles[userType].button}`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-4">
          {userType !== "student" && (
            <Link
              to={`/signup/${userType}`}
              className="text-blue-600 hover:text-blue-700"
            >
              Don't have an account? Sign up
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
