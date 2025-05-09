import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import Landing from "./pages/landing"; // Add this import

// Page imports
import Login from "./pages/auth/login";
import SchoolSignup from "./pages/auth/school-signup";
import VolunteerSignup from "./pages/auth/volunteer-signup";

import SchoolHome from "./pages/school";
import SchoolDashboard from "./pages/school/dashboard";
import RequestsPage from "./pages/school/requests";
import StudentsPage from "./pages/school/students";

import VolunteerHome from "./pages/volunteer";
import VolunteerDashboard from "./pages/volunteer/dashboard";
import CalendarPage from "./pages/volunteer/calendar";
import VolunteerProfile from "./pages/volunteer/profile";
import CreateTestPage from "./pages/volunteer/create-test";
import MeetPage from "./pages/volunteer/meet";

import StudentHome from "./pages/student";
import StudentDashboard from "./pages/student/dashboard";
import SubjectsPage from "./pages/student/subjects";
import StudentCalendarPage from "./pages/student/calendar";
import PracticePage from "./pages/student/practice";
import TestPage from "./pages/student/test";
import TestResults from "./pages/student/test-results";

function App() {
  const { isAuthenticated, userType, isInitialized } = useAuth();

  // Show loading state while authentication is initializing
  if (!isInitialized) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />{" "}
        {/* Add Landing as default route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={`/${userType}/dashboard`} replace />
            ) : (
              <Login />
            )
          }
        />
        <Route path="/signup/school" element={<SchoolSignup />} />
        <Route path="/signup/volunteer" element={<VolunteerSignup />} />
        <Route path="/meet/:roomId" element={<MeetPage />} />
        {/* Protected School Routes */}
        <Route
          path="/school"
          element={
            <ProtectedRoute allowedUserType="school">
              <SchoolHome />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<SchoolDashboard />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route index element={<Navigate to="/school/dashboard" replace />} />
        </Route>
        {/* Protected Volunteer Routes */}
        <Route
          path="/volunteer"
          element={
            <ProtectedRoute allowedUserType="volunteer">
              <VolunteerHome />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<VolunteerDashboard />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="profile" element={<VolunteerProfile />} />
          <Route path="create-test" element={<CreateTestPage />} />
          <Route
            index
            element={<Navigate to="/volunteer/dashboard" replace />}
          />
        </Route>
        {/* Protected Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedUserType="student">
              <StudentHome />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="calendar" element={<StudentCalendarPage />} />
          <Route path="practice" element={<PracticePage />} />
          <Route path="test/:testId" element={<TestPage />} />
          <Route path="test/results" element={<TestResults />} />
          <Route index element={<Navigate to="/student/dashboard" replace />} />
        </Route>
        {/* Default redirect */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to={`/${userType}/dashboard`} replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
