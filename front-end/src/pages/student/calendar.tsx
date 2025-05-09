"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CalendarIcon, X } from "lucide-react";
import {
  format,
  addDays,
  startOfWeek,
  addWeeks,
  subWeeks,
  isToday,
} from "date-fns";
import { useAuth, type StudentUser, type UserData } from "@/hooks/useAuth";
import { getApiUrl } from "../../utils/api";

// Simplified Meeting interfaces
interface Meeting {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  description?: string;
}

interface DBMeeting extends Meeting {
  _id: string;
  volunteerId: string;
  standard: number;
}

// Type guard for StudentUser
const isStudentUser = (user: UserData | null): user is StudentUser => {
  return user !== null && 'standard' in user && 'sapId' in user;
};

const StudentCalendarPage = () => {
  const { user, isInitialized } = useAuth();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchMeetings = async () => {
    if (!user || !isStudentUser(user)) {
      setError("Unauthorized access");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        getApiUrl(`/api/meetings/byStandard/${user.standard}`),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DBMeeting[] = await response.json();
      const transformedMeetings = data.map((meeting) => ({
        id: meeting._id,
        title: meeting.title,
        startTime: meeting.startTime,
        endTime: meeting.endTime,
        location: meeting.location,
        description: meeting.description,
      }));

      setMeetings(transformedMeetings);
    } catch (error) {
      setError("Failed to load meetings. Please try again later.");
      console.error("Failed to fetch meetings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isInitialized && user) {
      fetchMeetings();
    }
  }, [isInitialized, user]);

  // Early returns with loading and error states
  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading your calendar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-700 font-medium">{error}</p>
              <button 
                onClick={fetchMeetings}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !isStudentUser(user)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <p className="text-yellow-700">Please log in as a student to view the calendar.</p>
        </div>
      </div>
    );
  }

  // Calendar utility functions
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 6 }).map((_, i) => addDays(weekStart, i));
  const timeSlots = Array.from({ length: 11 }).map((_, i) => i + 8);

  const getMeetingsForSlot = (day: Date, hour: number) => {
    return meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.startTime);
      return (
        meetingDate.getDate() === day.getDate() &&
        meetingDate.getMonth() === day.getMonth() &&
        meetingDate.getFullYear() === day.getFullYear() &&
        meetingDate.getHours() === hour
      );
    });
  };

  // Event handlers
  const handleJoinMeeting = (meetingId: string) => {
    navigate(`/meet/${meetingId}`);
  };

  const handleMeetingClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsDialogOpen(true);
  };

  // Navigation handlers
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b bg-white rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-6 w-6 text-purple-600" />
          <h1 className="text-2xl font-semibold">My Classes</h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={goToToday}
          >
            Today
          </button>
          <button
            className="p-1 rounded-full text-gray-600 hover:bg-gray-100"
            onClick={prevWeek}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className="p-1 rounded-full text-gray-600 hover:bg-gray-100"
            onClick={nextWeek}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="font-medium">{format(weekStart, "MMMM yyyy")}</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto mt-4">
        {meetings.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-gray-500">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No classes scheduled for this week.</p>
            </div>
          </div>
        ) : (
          <div className="min-w-[1000px] min-h-[1000px] bg-white rounded-lg shadow-sm">
            <div className="sticky top-0 z-10 bg-white grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr] border-b">
              <div className="p-2 border-r bg-white"></div>
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`p-2 text-center border-r bg-white ${
                    isToday(day) ? "text-purple-600 font-bold" : ""
                  }`}
                >
                  <div className="text-2xl font-semibold">{format(day, "d")}</div>
                  <div className="text-sm text-gray-500">
                    {format(day, "EEEE")}
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              {timeSlots.map((hour) => (
                <div
                  key={hour}
                  className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr] grid-rows-[100px] border-b"
                >
                  <div className="sticky left-0 z-10 p-2 text-right pr-4 border-r text-sm text-gray-500 bg-white">
                    {hour === 12
                      ? "12 PM"
                      : hour > 12
                      ? `${hour - 12} PM`
                      : `${hour} AM`}
                  </div>

                  {days.map((day, dayIndex) => {
                    const dayMeetings = getMeetingsForSlot(day, hour);
                    return (
                      <div
                        key={dayIndex}
                        className={`border-r relative min-h-[70px] ${
                          isToday(day) ? "bg-purple-50" : ""
                        }`}
                      >
                        {dayMeetings.map((meeting, meetingIndex) => (
                          <div
                            key={meetingIndex}
                            className="absolute inset-0 p-1"
                            onClick={() => handleMeetingClick(meeting)}
                          >
                            <StudentMeetCard meeting={meeting} />
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isDialogOpen && selectedMeeting && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-2">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Class Details</h2>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-purple-700">
                  {selectedMeeting.title}
                </h3>
                <p className="text-gray-600 mt-1">
                  {selectedMeeting.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm text-gray-500">Start Time</p>
                  <p className="font-medium">
                    {format(new Date(selectedMeeting.startTime), "h:mm a")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Time</p>
                  <p className="font-medium">
                    {format(new Date(selectedMeeting.endTime), "h:mm a")}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{selectedMeeting.location}</p>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md mr-2 hover:bg-gray-200"
                >
                  Close
                </button>
                <button
                  onClick={() => handleJoinMeeting(selectedMeeting.id)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Join Class
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StudentMeetCard = ({ meeting }: { meeting: Meeting }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-purple-50 border-l-4 border-purple-500 rounded-md shadow-sm p-2 h-full flex flex-col cursor-pointer hover:bg-purple-100 transition-colors">
      <div className="font-medium text-purple-800 truncate">
        {meeting.title}
      </div>
      <div className="text-xs text-gray-600 truncate">{meeting.location}</div>

      <div className="mt-auto pt-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/meet/${meeting.id}`);
          }}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white text-xs py-1 px-2 rounded transition-colors"
        >
          Join
        </button>
      </div>
    </div>
  );
};

export default StudentCalendarPage;
