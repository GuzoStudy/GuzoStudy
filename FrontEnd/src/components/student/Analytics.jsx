import { useState } from "react";

export const Analytics = () => {
  // Mock data
  const [enrollments] = useState([
    { id: 1, courseTitle: "React Fundamentals", progress: 75, enrolledAt: "2024-10-01", completedAt: null },
    { id: 2, courseTitle: "Advanced Tailwind", progress: 90, enrolledAt: "2024-09-12", completedAt: "2024-09-28" },
  ]);

  const [quizAttempts] = useState([
    { id: 1, quizTitle: "React Basics Quiz", courseTitle: "React Fundamentals", score: 8, max: 10, percentage: 80, date: "2024-09-15" },
    { id: 2, quizTitle: "Tailwind Styling", courseTitle: "Advanced Tailwind", score: 9, max: 10, percentage: 90, date: "2024-09-29" },
  ]);

  const totalTimeSpent = 245; // minutes

  const averageProgress = enrollments.length
    ? Math.round(enrollments.reduce((a, e) => a + e.progress, 0) / enrollments.length)
    : 0;

  const averageScore = quizAttempts.length
    ? Math.round(quizAttempts.reduce((a, q) => a + q.percentage, 0) / quizAttempts.length)
    : 0;

  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="p-6 space-y-10">
      <h2 className="text-2xl font-semibold text-gray-800">My Analytics</h2>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-5 bg-blue-50 border border-blue-300 rounded-xl">
          <h3 className="text-sm text-blue-600 mb-2 font-medium">Average Progress</h3>
          <p className="text-3xl font-bold text-blue-700">{averageProgress}%</p>
          <p className="text-xs text-gray-600 mt-2">Across {enrollments.length} courses</p>
        </div>

        <div className="p-5 bg-sky-50 border border-sky-300 rounded-xl">
          <h3 className="text-sm text-sky-600 mb-2 font-medium">Average Quiz Score</h3>
          <p className="text-3xl font-bold text-sky-700">{averageScore}%</p>
          <p className="text-xs text-gray-600 mt-2">{quizAttempts.length} quizzes taken</p>
        </div>

        <div className="p-5 bg-cyan-50 border border-cyan-300 rounded-xl">
          <h3 className="text-sm text-cyan-600 mb-2 font-medium">Time Spent Learning</h3>
          <p className="text-3xl font-bold text-cyan-700">{formatTime(totalTimeSpent)}</p>
          <p className="text-xs text-gray-600 mt-2">Total learning time</p>
        </div>
      </div>

      {/* Course Progress */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Course Progress Overview</h3>
        {enrollments.length === 0 ? (
          <p className="text-gray-500">No course data available</p>
        ) : (
          <div className="space-y-3">
            {enrollments.map((e) => (
              <div
                key={e.id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-800">{e.courseTitle}</h4>
                  <span className="text-blue-600 font-semibold">{e.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${e.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Enrolled: {new Date(e.enrolledAt).toLocaleDateString()}
                  {e.completedAt && ` • Completed: ${new Date(e.completedAt).toLocaleDateString()}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quiz Performance */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Quiz Performance</h3>
        {quizAttempts.length === 0 ? (
          <p className="text-gray-500">No quiz attempts yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 bg-white rounded-xl">
              <thead>
                <tr className="border-b bg-gray-50 text-left">
                  <th className="py-3 px-4 text-sm font-semibold text-gray-700">Quiz</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-700">Course</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-center">Score</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-center">Percentage</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {quizAttempts.map((q) => (
                  <tr key={q.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-800">{q.quizTitle}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{q.courseTitle}</td>
                    <td className="py-3 px-4 text-sm text-center text-gray-800">
                      {q.score} / {q.max}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${
                          q.percentage >= 80
                            ? "bg-blue-500"
                            : q.percentage >= 60
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                      >
                        {q.percentage}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(q.date).toLocaleDateString()}
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
