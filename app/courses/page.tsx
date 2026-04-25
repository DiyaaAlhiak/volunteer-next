'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Search, BookOpen, Clock, User, Star, CheckCircle } from 'lucide-react';

interface Trainer {
  id: number;
  name: string;
}

interface Course {
  id: number;
  title: string;
  category: string | null;
  duration: string | null;
  isRequired: boolean;
  isFeatured: boolean;
  status: string;
  trainerId?: number | null;
  trainer?: Trainer | null;
  createdAt: Date;
  updatedAt: Date;
  isEnrolled?: boolean; // Added to track enrollment status
}

export default function CoursesCatalog() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [enrollingCourseId, setEnrollingCourseId] = useState<number | null>(null);

  const categories = [
    'All',
    'Healthcare Basics',
    'First Aid',
    'Emergency Response',
    'Community Health',
    'Mental Health',
    'Public Health',
    'Medical Ethics'
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, selectedCategory]);

  const fetchCourses = async () => {
    try {
      // Get user session
      const sessionCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('session='))
        ?.split('=')[1];

      if (!sessionCookie) {
        setMessage({
          type: 'error',
          text: 'Please login to view courses'
        });
        setLoading(false);
        return;
      }

      const session = JSON.parse(sessionCookie);
      
      // Fetch courses
      const coursesResponse = await fetch('/api/courses');
      const coursesData = await coursesResponse.json();

      if (coursesData.success) {
        // Filter only active courses
        const activeCourses = coursesData.courses.filter((course: Course) => course.status === 'active');
        
        // Fetch user enrollments to check enrollment status
        const enrollmentsResponse = await fetch(`/api/enrollments?userId=${session.id}`);
        const enrollmentsData = await enrollmentsResponse.json();

        if (enrollmentsData.success) {
          const enrolledCourseIds = new Set(
            enrollmentsData.enrollments.map((enrollment: any) => enrollment.courseId)
          );

          // Add enrollment status to courses
          const coursesWithEnrollmentStatus = activeCourses.map((course: Course) => ({
            ...course,
            isEnrolled: enrolledCourseIds.has(course.id)
          }));

          setCourses(coursesWithEnrollmentStatus);
        } else {
          setCourses(activeCourses);
        }
      } else {
        setMessage({
          type: 'error',
          text: coursesData.error || 'Failed to fetch courses'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error fetching courses'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    setFilteredCourses(filtered);
  };

  const handleEnrollment = async (courseId: number) => {
    setEnrollingCourseId(courseId);
    setMessage(null);

    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: 'success',
          text: 'Successfully enrolled in course!'
        });
        
        // Update course enrollment status
        setCourses(courses.map(course =>
          course.id === courseId ? { ...course, isEnrolled: true } : course
        ));
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to enroll in course'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error enrolling in course'
      });
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const getCategoryColor = (category: string | null) => {
    const colors: { [key: string]: string } = {
      'Healthcare Basics': 'bg-blue-100 text-blue-800',
      'First Aid': 'bg-red-100 text-red-800',
      'Emergency Response': 'bg-orange-100 text-orange-800',
      'Community Health': 'bg-green-100 text-green-800',
      'Mental Health': 'bg-purple-100 text-purple-800',
      'Public Health': 'bg-indigo-100 text-indigo-800',
      'Medical Ethics': 'bg-pink-100 text-pink-800'
    };
    return colors[category || ''] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header 
        title="Course Catalog"
        description="Browse and enroll in available healthcare courses"
        breadcrumb="Home / Courses"
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-700' 
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search courses..."
                  className="w-full pr-10 pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'All' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className={`bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 ${
                course.isFeatured ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              {/* Featured Badge */}
              {course.isFeatured && (
                <div className="bg-yellow-400 text-yellow-900 px-4 py-2 text-sm font-semibold text-center">
                  <Star className="inline w-4 h-4 ml-1" />
                  Featured Course
                </div>
              )}

              <div className="p-6">
                {/* Course Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  {course.category && (
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(course.category)}`}>
                      {course.category}
                    </span>
                  )}
                </div>

                {/* Course Details */}
                <div className="space-y-3 mb-6">
                  {course.duration && (
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 ml-2" />
                      <span className="text-sm">{course.duration}</span>
                    </div>
                  )}

                  {course.trainer && (
                    <div className="flex items-center text-gray-600">
                      <User className="w-4 h-4 ml-2" />
                      <span className="text-sm">{course.trainer.name}</span>
                    </div>
                  )}

                  {course.isRequired && (
                    <div className="flex items-center text-red-600">
                      <CheckCircle className="w-4 h-4 ml-2" />
                      <span className="text-sm font-medium">Required Course</span>
                    </div>
                  )}
                </div>

                {/* Enrollment Button */}
                <button
                  onClick={() => handleEnrollment(course.id)}
                  disabled={course.isEnrolled || enrollingCourseId === course.id}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                    course.isEnrolled
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : enrollingCourseId === course.id
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-teal-600 text-white hover:bg-teal-700'
                  }`}
                >
                  {course.isEnrolled ? (
                    <>
                      <CheckCircle className="inline w-4 h-4 ml-2" />
                      Enrolled
                    </>
                  ) : enrollingCourseId === course.id ? (
                    'Enrolling...'
                  ) : (
                    'Enroll Now'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Courses Found */}
        {filteredCourses.length === 0 && !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No courses found
            </h3>
            <p className="text-gray-600 mb-8">
              Try adjusting your search or filter criteria to find available courses.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
