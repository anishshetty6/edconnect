"use client";

import { useState } from "react";
import { useAuth, type VolunteerUser, type UserData } from "../../hooks/useAuth";
import { PenTool, Plus, Trash2, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../../utils/api";

// Define interfaces at the top
interface Question {
  id: string; 
  text: string;
  options: string[];
  correctAnswer: number;
}

interface TestForm {
  subject: string;
  title: string;
  description: string;
  duration: number;
  standard: string;
  questions: Question[];
}

// Type guard moved outside component
const isVolunteerUser = (user: UserData | null): user is VolunteerUser => {
  return user !== null && 'email' in user && 'experience' in user;
};

const CreateTestPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [testForm, setTestForm] = useState<TestForm>({
    subject: "",
    title: "",
    description: "",
    duration: 30,
    standard: "",
    questions: [
      {
        id: "q1",
        text: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      },
    ],
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTestForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuestionChange = (
    questionId: string,
    field: string,
    value: string
  ) => {
    setTestForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, [field]: value } : q
      ),
    }));
  };

  const handleOptionChange = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    setTestForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? value : opt
              ),
            }
          : q
      ),
    }));
  };

  const handleCorrectAnswerChange = (questionId: string, value: number) => {
    setTestForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, correctAnswer: value } : q
      ),
    }));
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q${testForm.questions.length + 1}`,
      text: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    };

    setTestForm((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const removeQuestion = (questionId: string) => {
    if (testForm.questions.length <= 1) return;

    setTestForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!user || !isVolunteerUser(user)) {
        throw new Error("Unauthorized - Volunteer only");
      }

      const testData = {
        ...testForm,
        volunteerId: user._id,
      };

      const response = await fetch(getApiUrl("/api/tests/create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData),
      });

      if (!response.ok) {
        throw new Error("Failed to create test");
      }

      await response.json();
      alert("Test created successfully!");
      navigate("/volunteer/dashboard");
    } catch (error) {
      console.error("Failed to create test:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create test"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Type check at the start of component
  if (!user || !isVolunteerUser(user)) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg">
        Unauthorized - Volunteer access only
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <PenTool className="mr-2 text-blue-600" size={28} />
          <h1 className="text-2xl font-bold">Create Test</h1>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating...
            </>
          ) : (
            <>
              <Save size={18} className="mr-2" />
              Save Test
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Test Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                name="subject"
                value={testForm.subject}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Marathi">Marathi</option>
                <option value="History">History</option>
                <option value="Geography">Geography</option>
              </select>

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Standard
              </label>
              <select
                name="standard"
                value={testForm.standard}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Standard</option>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((std) => (
                  <option key={std} value={std}>
                    Standard {std}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                name="duration"
                value={testForm.duration}
                onChange={handleInputChange}
                min="5"
                max="180"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Title
            </label>
            <input
              type="text"
              name="title"
              value={testForm.title}
              onChange={handleInputChange}
              placeholder="e.g. Algebra Basics Quiz"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={testForm.description}
              onChange={handleInputChange}
              placeholder="Provide a brief description of the test"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            />
          </div>
        </div>

        <div className="space-y-4">
          {testForm.questions.map((question, qIndex) => (
            <div
              key={question.id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Question {qIndex + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeQuestion(question.id)}
                  className="text-red-500 hover:text-red-700"
                  disabled={testForm.questions.length <= 1}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Text
                </label>
                <textarea
                  value={question.text}
                  onChange={(e) =>
                    handleQuestionChange(question.id, "text", e.target.value)
                  }
                  placeholder="Enter your question here"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Options
                </label>
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center">
                    <input
                      type="radio"
                      name={`correct-${question.id}`}
                      checked={question.correctAnswer === optIndex}
                      onChange={() =>
                        handleCorrectAnswerChange(question.id, optIndex)
                      }
                      className="mr-2"
                      required
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(
                          question.id,
                          optIndex,
                          e.target.value
                        )
                      }
                      placeholder={`Option ${optIndex + 1}`}
                      className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="text-sm text-gray-500 mt-2">
                Select the radio button next to the correct answer
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center justify-center w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Add Another Question
          </button>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/volunteer/dashboard")}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Save Test
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTestPage;
