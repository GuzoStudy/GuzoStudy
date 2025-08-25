function CourseCard({ title, image, description, tags, rating, teacher, studentsEnrolled }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Course Image */}
      <img
        src={image}
        alt={title}
        className="h-48 w-full object-cover"
      />
      {/* Course Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags && tags.map((tag, i) => (
            <span key={i} className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {Array(rating).fill(0).map((_, i) => (
              <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-500">{studentsEnrolled} enrolled</span>
        </div>
        <div className="flex items-center mb-4">
          <img src={teacher?.photo} alt={teacher?.name} className="w-8 h-8 rounded-full mr-2" />
          <span className="text-sm text-gray-700">{teacher?.name}</span>
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Enroll Now
        </button>
      </div>
    </div>
  );
}

export default CourseCard;
