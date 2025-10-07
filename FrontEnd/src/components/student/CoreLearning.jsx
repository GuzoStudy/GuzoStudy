import { useState, useEffect } from "react";

export const CoreLearning = () => {
  // Mock data
  const [enrollments, setEnrollments] = useState([
    {
      id: 1,
      courses: { title: "React for Beginners", instructor_name: "Jane Doe" },
      status: "in-progress",
      progress_percentage: 45,
    },
    {
      id: 2,
      courses: { title: "Advanced TailwindCSS", instructor_name: "John Smith" },
      status: "completed",
      progress_percentage: 100,
    },
  ]);

  const [upcomingLessons, setUpcomingLessons] = useState([
    {
      id: 1,
      title: "React State Management",
      courses: { title: "React for Beginners" },
      scheduled_at: new Date(Date.now() + 86400000).toISOString(),
    },
  ]);

  const [upcomingQuizzes, setUpcomingQuizzes] = useState([
    {
      id: 1,
      title: "TailwindCSS Quiz 1",
      courses: { title: "Advanced TailwindCSS" },
      scheduled_at: new Date(Date.now() + 172800000).toISOString(),
      total_questions: 10,
    },
  ]);

  const [certificates, setCertificates] = useState([
    {
      id: 1,
      courses: { title: "JavaScript Essentials", instructor_name: "Alice Kim" },
      issued_at: new Date(Date.now() - 604800000).toISOString(),
      certificate_url: "#",
    },
  ]);

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-semibold">My Learning</h2>

      {/* Enrolled Courses */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Enrolled Courses</h3>
        {enrollments.length === 0 ? (
          <p className="text-gray-600">No enrolled courses yet</p>
        ) : (
          <div className="grid gap-4">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-base font-semibold mb-1">
                      {enrollment.courses?.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {enrollment.courses?.instructor_name}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                      enrollment.status === "completed"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                  >
                    {enrollment.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span className="font-semibold">
                      {enrollment.progress_percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${enrollment.progress_percentage}%` }}
                    />
                  </div>
                </div>

                <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700">
                  Continue Learning
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Lessons & Quizzes */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <section>
          <h3 className="text-lg font-semibold mb-4">Upcoming Lessons</h3>
          {upcomingLessons.length === 0 ? (
            <p className="text-gray-600">No upcoming lessons</p>
          ) : (
            <div className="grid gap-3">
              {upcomingLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm"
                >
                  <h4 className="text-sm font-semibold mb-1">{lesson.title}</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    {lesson.courses?.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(lesson.scheduled_at).toLocaleDateString()} •{" "}
                    {new Date(lesson.scheduled_at).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-4">Upcoming Quizzes</h3>
          {upcomingQuizzes.length === 0 ? (
            <p className="text-gray-600">No upcoming quizzes</p>
          ) : (
            <div className="grid gap-3">
              {upcomingQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm"
                >
                  <h4 className="text-sm font-semibold mb-1">{quiz.title}</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    {quiz.courses?.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {quiz.total_questions} questions •{" "}
                    {new Date(quiz.scheduled_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Certificates */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Certificates Earned</h3>
        {certificates.length === 0 ? (
          <p className="text-gray-600">No certificates earned yet</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="border-2 border-yellow-400 rounded-lg p-5 bg-yellow-50 text-center shadow-sm"
              >
                <div className="text-3xl mb-2">🏆</div>
                <h4 className="text-sm font-semibold mb-1">
                  {cert.courses?.title}
                </h4>
                <p className="text-xs text-gray-600 mb-3">
                  Issued: {new Date(cert.issued_at).toLocaleDateString()}
                </p>
                {cert.certificate_url && (
                  <a
                    href={cert.certificate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-3 py-1 bg-yellow-400 text-black rounded text-xs font-medium hover:bg-yellow-500"
                  >
                    View Certificate
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
