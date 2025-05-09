import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { School } from "lucide-react";
import { getApiUrl } from "../../utils/api";

const SchoolSignup = () => {
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolAddress: "",
    udiseNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.schoolName.trim()) {
      newErrors.schoolName = "School name is required";
    }

    if (!formData.schoolAddress.trim()) {
      newErrors.schoolAddress = "School address is required";
    }

    if (!formData.udiseNumber.trim()) {
      newErrors.udiseNumber = "UDISE number is required";
    } else if (!/^\d+$/.test(formData.udiseNumber)) {
      newErrors.udiseNumber = "UDISE number must contain only digits";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...schoolData } = formData;

      const response = await fetch(getApiUrl("/api/school/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schoolData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Show success message (you might want to add a toast notification here)
      console.log(data.message);

      // Redirect to login page
      navigate("/login");
    } catch (error: any) {
      console.error("Signup failed:", error);
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "Registration failed. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <School className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create School Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="schoolName"
                className="block text-sm font-medium text-gray-700"
              >
                School Name
              </label>
              <input
                id="schoolName"
                name="schoolName"
                type="text"
                required
                value={formData.schoolName}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.schoolName ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
              />
              {errors.schoolName && (
                <p className="mt-1 text-sm text-red-600">{errors.schoolName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="schoolAddress"
                className="block text-sm font-medium text-gray-700"
              >
                School Address
              </label>
              <textarea
                id="schoolAddress"
                name="schoolAddress"
                required
                value={formData.schoolAddress}
                onChange={handleChange}
                rows={3}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.schoolAddress ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
              />
              {errors.schoolAddress && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.schoolAddress}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="udiseNumber"
                className="block text-sm font-medium text-gray-700"
              >
                School UDISE Number
              </label>
              <input
                id="udiseNumber"
                name="udiseNumber"
                type="text"
                required
                value={formData.udiseNumber}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.udiseNumber ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
              />
              {errors.udiseNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.udiseNumber}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.confirmPassword ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchoolSignup;
