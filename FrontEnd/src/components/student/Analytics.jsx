import { useState, useEffect } from "react";

export const Analytics = () => {
  // Mock data (replace later with API)
  const [enrollments, setEnrollments] = useState([
    {
      id: 1,
      courses: { title: "React for Beginners" },
      progress_percentage: 75,
      enrolled_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
      completed_at: null,
    },
    {
      id: 2,
      courses: { title: "Advanced TailwindCSS" },
      progress_percentage: 100,
      enrolled_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
      completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    },
  ]);

  const [quizAttempts, setQuizAttempts] = useState([
    {
      id: 1,
      quizzes: { title: "React Quiz 1", courses: { title: "React for Beginners" } },
      score: 8,
      max_score: 10,
      percentage: 80,
      completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      id: 2,
      quizzes: { title: "TailwindCSS Final", courses: { title: "Advanced TailwindCSS" } },
      score: 9,
      max_score: 10,
      percentage: 90,
      completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    },
  ]);

  const [totalTimeSpent, setTotalTimeSpent] = useState(320); // minutes

  const calculateAverageProgress = () => {
    if (enrollments.length === 0) return 0;
    const total = enrollments.reduce((sum, e) => sum + e.progress_percentage, 0);
    return Math.round(total / enrollments.length);
  };

  const calculateAverageScore = () => {
    if (quizAttempts.length === 0) return 0;
    const total = quizAttempts.reduce((sum, q) => sum + q.percentage, 0);
    return Math.round(total / quizAttempts.length);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-semibold">My Analytics</h2>

      {/* Stats cards */}
      <div className="grid gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-5 rounded-lg border border-blue-600 bg-blue-50">
          <h3 className="text-sm font-medium text-blue-700 mb-2">
            Average Progress
          </h3>
          <p className="text-3xl font-bold text-blue-800">
            {calculateAverageProgress()}%
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Across {enrollments.length} courses
          </p>
        </div>

        <div className="p-5 rounded-lg border border-purple-600 bg-purple-50">
          <h3 className="text-sm font-medium text-purple-700 mb-2">
            Average Quiz Score
          </h3>
          <p className="text-3xl font-bold text-purple-800">
            {calculateAverageScore()}%
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {quizAttempts.length} quizzes taken
          </p>
        </div>

        <div className="p-5 rounded-lg border border-green-600 bg-green-50">
          <h3 className="text-sm font-medium text-green-700 mb-2">
            Time Spent Learning
          </h3>
          <p className="text-3xl font-bold text-green-800">
            {formatTime(totalTimeSpent)}
          </p>
          <p className="text-xs text-gray-600 mt-1">Total learning time</p>
        </div>
      </div>

      {/* Course Progress */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Course Progress Overview</h3>
        {enrollments.length === 0 ? (
          <p className="text-gray-600">No course data available</p>
        ) : (
          <div className="grid gap-3">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="border border-gray-200 rounded-lg p-4 bg-white"
              >
                <div className="flex justify-between mb-2">
                  <h4 className="text-base font-semibold">
                    {enrollment.courses?.title}
                  </h4>
                  <span className="text-base font-semibold text-blue-600">
                    {enrollment.progress_percentage}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all"
                    style={{ width: `${enrollment.progress_percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Enrolled:{" "}
                  {new Date(enrollment.enrolled_at).toLocaleDateString()}
                  {enrollment.completed_at &&
                    ` • Completed: ${new Date(
                      enrollment.completed_at
                    ).toLocaleDateString()}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quiz Performance */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Quiz Performance</h3>
        {quizAttempts.length === 0 ? (
          <p className="text-gray-600">No quiz attempts yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="p-3 text-left text-sm font-semibold">Quiz</th>
                  <th className="p-3 text-left text-sm font-semibold">Course</th>
                  <th className="p-3 text-center text-sm font-semibold">
                    Score
                  </th>
                  <th className="p-3 text-center text-sm font-semibold">
                    Percentage
                  </th>
                  <th className="p-3 text-left text-sm font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {quizAttempts.map((attempt) => (
                  <tr
                    key={attempt.id}
                    className="border-b border-gray-100 text-sm"
                  >
                    <td className="p-3">{attempt.quizzes?.title}</td>
                    <td className="p-3 text-gray-600">
                      {attempt.quizzes?.courses?.title}
                    </td>
                    <td className="p-3 text-center">
                      {attempt.score} / {attempt.max_score}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                          attempt.percentage >= 80
                            ? "bg-green-500"
                            : attempt.percentage >= 60
                            ? "bg-orange-500"
                            : "bg-red-500"
                        }`}
                      >
                        {attempt.percentage}%
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">
                      {new Date(attempt.completed_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
