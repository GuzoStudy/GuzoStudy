import { useEffect, useState } from "react";
// import { CertificateDetail } from "../components/CertificateDetail"; // import the detail component
import CertificateDetail from "./CertificateDetail";


export const CoreLearning = () => {
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState([]);
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null); // for modal view

  useEffect(() => {
    setTimeout(() => {
      setEnrollments([
        {
          id: 1,
          courses: { title: "React Fundamentals", instructor_name: "John Doe" },
          status: "in-progress",
          progress_percentage: 65,
        },
        {
          id: 2,
          courses: { title: "Advanced JavaScript", instructor_name: "Jane Smith" },
          status: "completed",
          progress_percentage: 100,
        },
      ]);

      setUpcomingLessons([
        {
          id: 1,
          title: "React Hooks Deep Dive",
          courses: { title: "React Fundamentals" },
          scheduled_at: "2025-10-05T15:00:00Z",
        },
        {
          id: 2,
          title: "JavaScript Closures Workshop",
          courses: { title: "Advanced JavaScript" },
          scheduled_at: "2025-10-08T18:00:00Z",
        },
      ]);

      setUpcomingQuizzes([
        {
          id: 1,
          title: "React Basics Quiz",
          courses: { title: "React Fundamentals" },
          total_questions: 10,
          scheduled_at: "2025-10-06T14:00:00Z",
        },
      ]);

      setCertificates([
        {
          id: 1,
          user_name: "Mahi Y.",
          courses: { title: "Advanced JavaScript", instructor_name: "Jane Smith" },
          issued_at: "2025-08-01T00:00:00Z",
          certificate_url: "#",
          description:
            "Awarded for excellence in mastering advanced JavaScript concepts and completing the course with distinction.",
        },
      ]);

      setLoading(false);
    }, 800);
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent">
          My Learning Journey
        </h2>
        <p className="text-gray-500 mt-1">Track your progress and continue learning</p>
      </div>

      {/* Enrolled Courses */}
      <section className="mb-12">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-800 mb-5">
          📚 Enrolled Courses
        </h3>
        {enrollments.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-2xl border-2 border-dashed border-blue-200">
            <div className="text-4xl mb-3">📖</div>
            <p className="text-gray-600">No enrolled courses yet</p>
            <p className="text-gray-400 text-sm mt-1">Start your learning journey today!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-lg transition p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {enrollment.courses?.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Instructor: {enrollment.courses?.instructor_name}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold text-white uppercase ${
                      enrollment.status === "completed"
                        ? "bg-gradient-to-r from-blue-400 to-blue-700"
                        : "bg-gradient-to-r from-sky-400 to-sky-600"
                    }`}
                  >
                    {enrollment.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-5">
                  <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                    <span>Progress</span>
                    <span className="text-blue-600 font-bold">
                      {enrollment.progress_percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-blue-50 rounded-full h-2">
                    <div
                      className="h-2 bg-blue-500 rounded-full transition-all"
                      style={{ width: `${enrollment.progress_percentage}%` }}
                    ></div>
                  </div>
                </div>

                <button className="bg-gradient-to-r from-blue-400 to-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2">
                  ▶️ Continue Learning
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Lessons & Quizzes */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <section>
          <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
            📅 Upcoming Lessons
          </h3>
          {upcomingLessons.length === 0 ? (
            <div className="p-6 text-center bg-white border-2 border-dashed border-blue-200 rounded-xl">
              <div className="text-3xl mb-2">📝</div>
              <p className="text-gray-600 text-sm">No upcoming lessons</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {upcomingLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-400 transition"
                >
                  <h4 className="text-base font-semibold text-gray-800">{lesson.title}</h4>
                  <p className="text-sm text-gray-500">{lesson.courses?.title}</p>
                  <div className="flex items-center gap-2 text-sm text-blue-600 mt-2">
                    ⏰{" "}
                    {new Date(lesson.scheduled_at).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
            ✍️ Upcoming Quizzes
          </h3>
          {upcomingQuizzes.length === 0 ? (
            <div className="p-6 text-center bg-white border-2 border-dashed border-blue-200 rounded-xl">
              <div className="text-3xl mb-2">📋</div>
              <p className="text-gray-600 text-sm">No upcoming quizzes</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {upcomingQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-400 transition"
                >
                  <h4 className="text-base font-semibold text-gray-800">{quiz.title}</h4>
                  <p className="text-sm text-gray-500 mb-1">{quiz.courses?.title}</p>
                  <div className="flex justify-between text-xs text-gray-600 font-medium">
                    <span>{quiz.total_questions} questions</span>
                    <span className="text-blue-600">
                      {new Date(quiz.scheduled_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Certificates Section */}
      <section className="py-10">
        <h3 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-2">
          <span className="text-yellow-500 text-3xl">🏆</span> Certificates Earned
        </h3>

        {certificates.length === 0 ? (
          <div className="p-10 text-center bg-gradient-to-br from-white to-blue-50 border-2 border-dashed border-blue-200 rounded-3xl shadow-inner">
            <div className="text-5xl mb-3 animate-bounce">🎖️</div>
            <p className="text-gray-700 font-medium">No certificates earned yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Complete courses to earn beautiful certificates!
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                onClick={() => setSelectedCertificate(cert)}
                className="relative cursor-pointer bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-blue-200 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 hover:scale-[1.02] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 via-transparent to-yellow-100/20 pointer-events-none rounded-3xl"></div>
                <div className="text-5xl mb-4 text-yellow-500 drop-shadow-sm">🏆</div>

                <h4 className="font-semibold text-blue-800 text-lg mb-2">
                  {cert.courses?.title}
                </h4>

                <p className="text-sm text-blue-700 mb-4">
                  Issued:{" "}
                  {new Date(cert.issued_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCertificate(cert);
                  }}
                  className="relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
                >
                  <span>📜</span> View Certificate
                </button>

                <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-400 to-yellow-300 text-xs font-bold text-gray-900 py-1 px-3 rounded-bl-xl">
                  VERIFIED
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for detailed certificate */}
        {selectedCertificate && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-4xl">
              <button
                onClick={() => setSelectedCertificate(null)}
                className="absolute -top-8 right-0 bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:shadow-lg transition"
                title="Close"
              >
                ✕
              </button>
              <CertificateDetail certificate={selectedCertificate} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
