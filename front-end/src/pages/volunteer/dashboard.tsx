"use client";

import { useState, useEffect } from "react";
import { UserPlus, Calendar, Clock, SchoolIcon } from "lucide-react";
import { useAuth, type VolunteerUser, type UserData } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { getApiUrl } from "../../utils/api";

// Add these utility functions
const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

interface Request {
  _id: string;
  date: string;
  subjectName: string;
  topicName: string;
  description: string;
  schoolName: string;
  volunteerId: string | null;
}

interface Meeting {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  standard: number;
  location?: string;
  description?: string;
}

// Type guard for VolunteerUser
const isVolunteerUser = (user: UserData | null): user is VolunteerUser => {
  return user !== null && 'availability' in user && 'subjects' in user;
};

const VolunteerDashboard = () => {
  const { user, isInitialized } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isInitialized && user && isVolunteerUser(user)) {
      fetchRequests();
      fetchMeetings();
    }
  }, [isInitialized, user]);

  const fetchRequests = async () => {
    if (!user || !isVolunteerUser(user)) return;

    try {
      const response = await fetch(getApiUrl("/api/requests/unassigned"));
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch requests");
      }

      // Filter requests based on volunteer's availability and subjects
      const filteredRequests = data.filter((request: Request) => {
        const requestDate = new Date(request.date);
        const dayOfWeek = requestDate.toLocaleDateString("en-US", {
          weekday: "long",
        });

        return (
          user.availability.includes(dayOfWeek) &&
          user.subjects.includes(request.subjectName)
        );
      });

      setRequests(filteredRequests);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchMeetings = async () => {
    if (!user || !isVolunteerUser(user)) return;

    try {
      const response = await fetch(
        getApiUrl(`/api/meetings/byVolunteer/${user._id}`)
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch meetings");
      }

      setMeetings(data);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch meetings");
    }
  };

  const acceptRequest = async (requestId: string) => {
    if (!user || !isVolunteerUser(user)) return;

    try {
      const response = await fetch(getApiUrl("/api/requests/assign"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          volunteerId: user._id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to accept request");
      }

      setRequests(requests.filter((req) => req._id !== requestId));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to accept request");
    }
  };

  // Loading state
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  // Authentication check
  if (!user || !isVolunteerUser(user)) {
    return <div>Please log in as a volunteer to view this page</div>;
  }

  // Rest of your component remains the same...
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <UserPlus className="mr-2 text-blue-600" size={28} />
        <h1 className="text-2xl font-bold">Volunteer Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Available Requests"
          value={requests.length.toString()}
          icon={<Calendar className="text-blue-600" size={24} />}
        />
        <DashboardCard
          title="Upcoming Meetings"
          value={meetings.length.toString()}
          icon={<Clock className="text-blue-600" size={24} />}
        />
        <DashboardCard
          title="Schools"
          value="3"
          icon={<SchoolIcon className="text-blue-600" size={24} />}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Teaching Requests</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request._id}
                className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar size={16} className="mr-1" />
                      <span>{formatDate(request.date)}</span>
                      <span>{request.subjectName}</span>
                    </div>
                    <h3 className="text-lg font-semibold">
                      {request.topicName}
                    </h3>
                    <p className="text-gray-600">{request.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <SchoolIcon size={16} className="mr-1" />
                      <span>{request.schoolName}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <button
                      onClick={() => acceptRequest(request._id)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h2 className="text-lg font-semibold mb-4">Upcoming Meetings</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div
                key={meeting._id}
                className="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock size={16} className="mr-1" />
                      <span>{formatTime(meeting.startTime)}</span>
                      <span className="mx-2">-</span>
                      <span>{formatTime(meeting.endTime)}</span>
                      <span className="mx-2">•</span>
                      <span>Standard {meeting.standard}</span>
                    </div>
                    <h3 className="text-lg font-semibold">{meeting.title}</h3>
                    {meeting.description && (
                      <p className="text-gray-600">{meeting.description}</p>
                    )}
                    {meeting.location && (
                      <div className="flex items-center text-sm text-gray-500">
                        <SchoolIcon size={16} className="mr-1" />
                        <span>{meeting.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <Link
                      to={`/volunteer/meet/${meeting._id}`}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                    >
                      Join
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {meetings.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No upcoming meetings
              </p>
            )}
          </div>
        )}
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
        <div className="p-3 bg-blue-50 rounded-full">{icon}</div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
