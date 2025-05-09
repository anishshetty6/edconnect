"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Plus, X, Calendar, BookOpen, SchoolIcon } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getApiUrl } from "../../utils/api";

interface Request {
  _id: string;
  subjectName: string;
  topicName: string;
  date: string;
  description: string;
  schoolName: string;
  volunteerId: string | null;
}

const RequestsPage = () => {
  const { user, isInitialized } = useAuth();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [newRequest, setNewRequest] = useState({
    date: "",
    subjectName: "",
    topicName: "",
    description: "",
  });

  useEffect(() => {
    if (isInitialized && user) {
      fetchRequests();
    }
  }, [user, isInitialized]);

  const fetchRequests = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        getApiUrl(`/api/requests/bySchool/${user._id}`)
      );
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  // Add a loading state check
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  // Add authentication check
  if (!user) {
    return <div>Please log in to view requests.</div>;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(getApiUrl("/api/requests/create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newRequest,
          schoolId: user._id,
          schoolName: user.schoolName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create request");
      }

      await fetchRequests();
      setIsDialogOpen(false);
      setNewRequest({
        date: "",
        subjectName: "",
        topicName: "",
        description: "",
      });
    } catch (error) {
      console.error("Error creating request:", error);
    }
  };

  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="mr-2 text-green-600" size={28} />
          <h1 className="text-2xl font-bold">Teaching Requests</h1>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus size={20} className="mr-1" />
          New Request
        </button>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request._id}
            className="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar size={16} className="mr-1" />
                  <span>{new Date(request.date).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <BookOpen size={16} className="mr-1" />
                  <span>{request.subjectName}</span>
                </div>
                <h3 className="text-lg font-semibold">{request.topicName}</h3>
                <p className="text-gray-600">{request.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <SchoolIcon size={16} className="mr-1" />
                  <span>{request.schoolName}</span>
                </div>
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
          </div>
        ))}
      </div>

      {/* Create Request Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Create New Request</h2>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={newRequest.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subjectName"
                  value={newRequest.subjectName}
                  onChange={handleInputChange}
                  placeholder="e.g. Mathematics, Science, English"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  name="topicName"
                  value={newRequest.topicName}
                  onChange={handleInputChange}
                  placeholder="e.g. Algebra Basics"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newRequest.description}
                  onChange={handleInputChange}
                  placeholder="Describe what you need..."
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
                  required
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md mr-2 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const FileText = ({
  className,
  size,
}: {
  className?: string;
  size: number;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
};

export default RequestsPage;
