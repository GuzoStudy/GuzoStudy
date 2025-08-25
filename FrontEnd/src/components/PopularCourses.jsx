import CourseCard from './CourseCard';

function PopularCourses() {
  const courses = [
    {
      title: 'Digital Marketing',
      image: 'https://source.unsplash.com/400x300/?marketing,digital',
      description: 'Master online marketing strategies and grow your business.',
      tags: ['Marketing', 'Digital', 'Business'],
      rating: 5,
      teacher: { name: 'Alice Smith', photo: 'https://i.pravatar.cc/40?img=5' },
      studentsEnrolled: 800
    },
    {
      title: 'Graphic Design',
      image: 'https://source.unsplash.com/400x300/?graphic,design',
      description: 'Learn design principles and tools for stunning graphics.',
      tags: ['Design', 'Graphics', 'Creativity'],
      rating: 5,
      teacher: { name: 'Bob Lee', photo: 'https://i.pravatar.cc/40?img=6' },
      studentsEnrolled: 950
    },
    {
      title: 'Programming',
      image: 'https://source.unsplash.com/400x300/?programming,code',
      description: 'Start coding with hands-on projects and expert guidance.',
      tags: ['Programming', 'Coding', 'Development'],
      rating: 5,
      teacher: { name: 'Carol White', photo: 'https://i.pravatar.cc/40?img=7' },
      studentsEnrolled: 1200
    },
    {
      title: 'Data Science',
      image: 'https://source.unsplash.com/400x300/?data,science',
      description: 'Analyze data and build predictive models for real-world problems.',
      tags: ['Data', 'Science', 'Analytics', 'Machine Learning'],
      rating: 5,
      teacher: { name: 'David Black', photo: 'https://i.pravatar.cc/40?img=8' },
      studentsEnrolled: 1100
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Explore Popular Courses
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course, index) => (
            <CourseCard
              key={index}
              title={course.title}
              image={course.image}
              description={course.description}
              tags={course.tags}
              rating={course.rating}
              teacher={course.teacher}
              studentsEnrolled={course.studentsEnrolled}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularCourses;