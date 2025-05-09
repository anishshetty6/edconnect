import type React from "react";
import { useEffect, useState } from "react";
import { School, Users, FileText, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getApiUrl } from "../../utils/api";

interface Request {
  _id: string;
  subjectName: string;
  topicName: string;
  date: string;
  description: string;
  volunteerId: string | null;
}



const SchoolDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch requests
        const requestsResponse = await fetch(
          getApiUrl(`/api/requests/bySchool/${user?._id}`)
        );
        const requestsData = await requestsResponse.json();
        setRequests(requestsData);

        // Fetch students
        const studentsResponse = await fetch(
          getApiUrl(`/api/students/bySchool/${user?._id}`)
        );
        const studentsData = await studentsResponse.json();
        setStudentCount(studentsData.length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    if (user?._id) {
      fetchDashboardData();
    }
  }, [user?._id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <School className="mr-2 text-green-600" size={28} />
        <h1 className="text-2xl font-bold">School Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Total Requests"
          value={requests.length.toString()}
          icon={<FileText className="text-green-600" size={24} />}
        />
        <DashboardCard
          title="Active Students"
          value={studentCount.toString()}
          icon={<Users className="text-green-600" size={24} />}
        />
        <DashboardCard
          title="Volunteer Engagement"
          value="87%"
          icon={<TrendingUp className="text-green-600" size={24} />}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Requests</h2>
        <div className="space-y-4">
          {requests.slice(0, 3).map((request) => (
            <div
              key={request._id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 className="font-medium">
                  {request.subjectName} - {request.topicName}
                </h3>
                <p className="text-sm text-gray-500">
                  Requested on {new Date(request.date).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  request.volunteerId
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {request.volunteerId ? "Accepted" : "Pending"}
              </span>
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
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="p-3 bg-green-50 rounded-full">{icon}</div>
      </div>
    </div>
  );
};

export default SchoolDashboard;
