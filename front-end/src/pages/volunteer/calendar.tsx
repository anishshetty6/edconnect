"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, CalendarIcon, Plus, X } from "lucide-react";
import {
  format,
  addDays,
  startOfWeek,
  addWeeks,
  subWeeks,
  isToday,
} from "date-fns";
import MeetCard from "../../components/volunteer/MeetCard";
import { useAuth } from "../../hooks/useAuth";
import { getApiUrl } from "../../utils/api";

interface Meeting {
  _id: string;
  volunteerId: string;
  title: string;
  startTime: string;
  endTime: string;
  standard: number;
  location: string;
  description: string;
}

const CalendarPage = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "08:00",
    endTime: "09:00",
    location: "",
    description: "",
    standard: "1",
  });

  // Fetch meetings on component mount
  useEffect(() => {
    if (user?._id) {
      fetchMeetings();
    }
  }, [user?._id]);

  const fetchMeetings = async () => {
    try {
      const response = await fetch(
        getApiUrl(`/api/meetings/byVolunteer/${user?._id}`)
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch meetings");
      }

      setMeetings(data);
    } catch (error: any) {
      console.error("Error fetching meetings:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Get the start of the current week (Monday)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });

  // Generate days for Monday to Saturday (6 days)
  const days = Array.from({ length: 6 }).map((_, i) => addDays(weekStart, i));

  // Generate time slots from 8 AM to 6 PM
  const timeSlots = Array.from({ length: 11 }).map((_, i) => i + 8);

  // Navigate to previous week
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));

  // Navigate to next week
  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

  // Navigate to today
  const goToToday = () => setCurrentDate(new Date());

  // Get meetings for a specific day and time
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewMeeting((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;

    const startDateTime = new Date(
      `${newMeeting.date}T${newMeeting.startTime}:00`
    );
    const endDateTime = new Date(`${newMeeting.date}T${newMeeting.endTime}:00`);

    try {
      const response = await fetch(getApiUrl("/api/meetings/create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          volunteerId: user._id,
          title: newMeeting.title,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          standard: parseInt(newMeeting.standard),
          location: newMeeting.location || "",
          description: newMeeting.description || "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create meeting");
      }

      // Refresh meetings list
      await fetchMeetings();

      // Close dialog and reset form
      setIsDialogOpen(false);
      setNewMeeting({
        title: "",
        date: format(new Date(), "yyyy-MM-dd"),
        startTime: "08:00",
        endTime: "09:00",
        location: "",
        description: "",
        standard: "1",
      });
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Show loading state */}
      {loading && (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading meetings...</span>
        </div>
      )}

      {/* Show error state */}
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          <p className="font-medium">Error: {error}</p>
          <button 
            onClick={fetchMeetings}
            className="mt-2 text-sm underline hover:text-red-800"
          >
            Try again
          </button>
        </div>
      )}

      {/* Only show calendar when not loading and no error */}
      {!loading && !error && (
        <>
          {/* Fixed Calendar Header */}
          <div className="flex items-center justify-between p-4 border-b bg-white">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-semibold">Calendar</h1>
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
              <button
                onClick={() => setIsDialogOpen(true)}
                className="ml-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} className="mr-1" />
                New Meeting
              </button>
            </div>
          </div>

          {/* Scrollable Calendar Container */}
          <div className="flex-1 overflow-auto">
            {/* Set min-width higher to ensure horizontal scrolling is available */}
            <div className="min-w-[1000px] min-h-[1000px]">
              {/* Fixed column headers - these stay in place when scrolling horizontally */}
              <div className="sticky top-0 z-10 bg-white grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr] border-b">
                <div className="p-2 border-r bg-white"></div>
                {days.map((day, index) => (
                  <div
                    key={index}
                    className={`p-2 text-center border-r bg-white ${
                      isToday(day) ? "text-blue-600 font-bold" : ""
                    }`}
                  >
                    <div className="text-2xl font-semibold">{format(day, "d")}</div>
                    <div className="text-sm text-gray-500">
                      {format(day, "EEEE")}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Grid - Scrollable both horizontally and vertically */}
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
                            isToday(day) ? "bg-blue-50" : ""
                          }`}
                        >
                          {dayMeetings.map((meeting, meetingIndex) => (
                            <div
                              key={meetingIndex}
                              className="absolute inset-0 p-1"
                            >
                              <MeetCard meeting={meeting} />
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Create Meeting Dialog */}
          {isDialogOpen && (
            <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-2">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold">Create New Meeting</h2>
                  <button
                    onClick={() => setIsDialogOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={newMeeting.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={newMeeting.date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        name="startTime"
                        value={newMeeting.startTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        name="endTime"
                        value={newMeeting.endTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={newMeeting.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={newMeeting.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Standard
                    </label>
                    <select
                      name="standard"
                      value={newMeeting.standard}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((std) => (
                        <option key={std} value={std}>
                          {std}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end pt-6 gap-3">
                    <button
                      type="button"
                      onClick={() => setIsDialogOpen(false)}
                      className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                    >
                      Create Meeting
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CalendarPage;
