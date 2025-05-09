import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, type StudentUser, type UserData } from "../../hooks/useAuth";
import { PenTool, BookOpen, CheckCircle, Clock } from "lucide-react";
import { getApiUrl } from "../../utils/api";

interface Test {
  id: string;
  subject: string;
  title: string;
  description: string;
  duration: number;
  questionCount: number;
  completed?: boolean;
  score?: string;
}

// Add type guard for StudentUser
const isStudentUser = (user: UserData | null): user is StudentUser => {
  return user !== null && 'standard' in user && 'sapId' in user;
};

const PracticePage = () => {
  const { user, isInitialized } = useAuth();
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTests = async () => {
      if (!user || !isStudentUser(user)) {
        setError("Unauthorized access");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          getApiUrl(`/api/tests/standard/${user.standard}`)
        );
        if (!response.ok) throw new Error("Failed to fetch tests");
        const data = await response.json();
        setTests(data);
      } catch (err) {
        setError("Failed to load tests");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isInitialized && user) {
      fetchTests();
    }
  }, [user, isInitialized]);

  // Add authentication check
  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user || !isStudentUser(user)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600">Please log in as a student to view practice tests.</div>
      </div>
    );
  }

  const handleStartTest = (testId: string) => {
    navigate(`/student/test/${testId}`);
  };

  const filteredTests = selectedSubject
    ? tests.filter((test) => test.subject === selectedSubject)
    : tests;

  const subjects = Array.from(new Set(tests.map((test) => test.subject)));

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <PenTool className="mr-2 text-purple-600" size={28} />
        <h1 className="text-2xl font-bold">Practice Tests</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center">{error}</div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedSubject(null)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedSubject === null
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Subjects
              </button>

              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedSubject === subject
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTests.map((test) => (
                <div
                  key={test.id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-4 border-b bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        {test.subject}
                      </span>
                      {test.completed && (
                        <span className="flex items-center text-green-600 text-sm">
                          <CheckCircle size={16} className="mr-1" />
                          {test.score}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mt-2">{test.title}</h3>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <BookOpen size={16} className="mr-1" />
                        <span>{test.questionCount} questions</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        <span>{test.duration} minutes</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartTest(test.id)}
                      className={`w-full py-2 rounded-md text-sm font-medium ${
                        test.completed
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-purple-600 text-white hover:bg-purple-700"
                      }`}
                    >
                      {test.completed ? "Review Test" : "Start Test"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PracticePage;
