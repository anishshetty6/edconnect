import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";

// Define interfaces for the data structures
interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
}

interface Test {
  title: string;
  questions: Question[];
}

interface Result {
  isCorrect: boolean;
}

interface LocationState {
  results: Result[];
  test: Test;
  answers: number[];
}

const TestResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Type check and default values for location state
  const { results, test, answers } = (location.state as LocationState) || {
    results: [],
    test: { title: '', questions: [] },
    answers: []
  };

  // Calculate results with type safety
  const correctAnswers = results.filter((r: Result) => r.isCorrect).length;
  const totalQuestions = results.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  if (!test || !results || !answers) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-red-600">No test results found.</p>
          <button
            onClick={() => navigate("/student/practice")}
            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Back to Practice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">{test.title} - Results</h1>

        <div className="mb-8">
          <div className="text-4xl font-bold text-center mb-2">
            {correctAnswers}/{totalQuestions}
          </div>
          <div className="text-lg text-center text-gray-600">
            {percentage}% Correct
          </div>
        </div>

        <div className="space-y-6">
          {test.questions.map((question: Question, index: number) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="font-medium">{question.text}</div>
                {results[index]?.isCorrect ? (
                  <CheckCircle className="text-green-600 h-5 w-5" />
                ) : (
                  <XCircle className="text-red-600 h-5 w-5" />
                )}
              </div>

              <div className="space-y-2">
                {question.options.map((option: string, optIndex: number) => (
                  <div
                    key={optIndex}
                    className={`p-3 rounded-lg ${
                      optIndex === question.correctAnswer
                        ? "bg-green-50 border-green-200"
                        : optIndex === answers[index]
                        ? "bg-red-50 border-red-200"
                        : "bg-gray-50"
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/student/practice")}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Back to Practice
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
