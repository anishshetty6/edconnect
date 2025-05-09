import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getApiUrl } from "../../utils/api";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface Test {
  id: string;
  title: string;
  subject: string;
  duration: number;
  questions: Question[];
}

const TestPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState<Test | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await fetch(getApiUrl(`/api/tests/${testId}`));
        if (!response.ok) throw new Error("Failed to fetch test");
        const data = await response.json();
        setTest(data);
        setAnswers(new Array(data.questions.length).fill(-1));
      } catch (err) {
        console.error(err);
      }
    };

    fetchTest();
  }, [testId]);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < (test?.questions.length || 0) - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Calculate results
    const results = answers.map((answer, index) => ({
      questionId: test?.questions[index].id,
      isCorrect: answer === test?.questions[index].correctAnswer,
    }));

    // Navigate to results page with the data
    navigate("/student/test/results", {
      state: {
        results,
        test,
        answers,
      },
    });
  };

  if (!test) return <div>Loading...</div>;

  const question = test.questions[currentQuestion];
  const isLastQuestion = currentQuestion === test.questions.length - 1;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{test.title}</h1>
        <div className="text-sm text-gray-500">
          Question {currentQuestion + 1} of {test.questions.length}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">{question.text}</h2>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                answers[currentQuestion] === index
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <div className="text-sm text-gray-500">
          {answers[currentQuestion] === -1 && "Please select an answer"}
        </div>
        {isLastQuestion ? (
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            disabled={answers.includes(-1)}
          >
            Submit Test
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 flex items-center"
            disabled={answers[currentQuestion] === -1}
          >
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        )}
      </div>

      {/* Submit Confirmation Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Submit Test?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit your test? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Yes, Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPage;
