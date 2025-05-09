import type React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { GraduationCap, BookOpen, Calendar, PenTool } from "lucide-react";
import { Link } from "react-router-dom";
import { getApiUrl } from "../../utils/api";

interface Meeting {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  standard: number;
  location: string;
  description: string;
  volunteerId: string;
}

interface Test {
  id: string;
  title: string;
  subject: string;
  standard: string;
  duration: number;
  description: string;
  volunteerId: string;
  questionCount: number;
}

const StudentDashboard = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user && "standard" in user) {
        try {
          const [meetingsRes, testsRes] = await Promise.all([
            axios.get(getApiUrl(`/api/meetings/byStandard/${user.standard}`)),
            axios.get(getApiUrl(`/api/tests/standard/${user.standard}`)),
          ]);
          setMeetings(meetingsRes.data);
          setTests(testsRes.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <GraduationCap className="mr-2 text-purple-600" size={28} />
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="My Subjects"
          value="3"
          icon={<BookOpen className="text-purple-600" size={24} />}
          link="/student/subjects"
        />
        <DashboardCard
          title="Upcoming Classes"
          value={meetings.length.toString()}
          icon={<Calendar className="text-purple-600" size={24} />}
          link="/student/calendar"
        />
        <DashboardCard
          title="Practice Tests"
          value={tests.length.toString()}
          icon={<PenTool className="text-purple-600" size={24} />}
          link="/student/practice"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Upcoming Classes</h2>
          <div className="space-y-3">
            {loading ? (
              <p>Loading...</p>
            ) : meetings.length === 0 ? (
              <p>No upcoming classes</p>
            ) : (
              meetings.slice(0, 3).map((meeting) => (
                <div
                  key={meeting._id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-purple-700">
                      {meeting.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {new Date(meeting.startTime).toLocaleString()} -{" "}
                      {meeting.location}
                    </p>
                  </div>
                  <Link
                    to="/student/calendar"
                    className="px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
                  >
                    View
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Upcoming Tests</h2>
          <div className="space-y-3">
            {loading ? (
              <p>Loading...</p>
            ) : tests.length === 0 ? (
              <p>No upcoming tests</p>
            ) : (
              tests.slice(0, 3).map((test) => (
                <div
                  key={test.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-purple-700">
                      {test.subject}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {test.title} - {test.duration} minutes
                    </p>
                  </div>
                  <Link
                    to={`/student/practice/${test.id}`}
                    className="px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
                  >
                    Practice
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Classes</h2>
        <div className="space-y-4">
          {[
            {
              subject: "Mathematics",
              topic: "Algebra Basics",
              date: "April 10, 2023",
            },
            {
              subject: "Science",
              topic: "Introduction to Physics",
              date: "April 8, 2023",
            },
            {
              subject: "English",
              topic: "Creative Writing",
              date: "April 5, 2023",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 className="font-medium">
                  {item.subject} - {item.topic}
                </h3>
                <p className="text-sm text-gray-500">Attended on {item.date}</p>
              </div>
              <button className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-800 hover:bg-purple-200">
                Review
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({
  title,
  value,
  icon,
  link,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  link: string;
}) => {
  return (
    <Link
      to={link}
      className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="p-3 bg-purple-50 rounded-full">{icon}</div>
      </div>
    </Link>
  );
};

export default StudentDashboard;
