'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { BookOpen, Clock, User, Star, CheckCircle, Award, Calendar } from 'lucide-react';

interface Trainer {
  id: number;
  name: string;
}

interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  enrolledAt: Date;
  course: {
    id: number;
    title: string;
    category: string | null;
    duration: string | null;
    isRequired: boolean;
    isFeatured: boolean;
    status: string;
    trainer?: Trainer | null;
  };
}

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      // Get user session
      const sessionCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('session='))
        ?.split('=')[1];

      if (!sessionCookie) {
        setMessage({
          type: 'error',
          text: 'Please login to view your courses'
        });
        setLoading(false);
        return;
      }

      const session = JSON.parse(sessionCookie);
      
      const response = await fetch(`/api/enrollments?userId=${session.id}`);
      const data = await response.json();

      if (data.success) {
        setEnrollments(data.enrollments);
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to fetch your courses'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error fetching your courses'
      });
    } finally {
      setLoading(false);
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header 
        title="My Courses"
        description="View and manage your enrolled healthcare courses"
        breadcrumb="Home / My Courses"
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center ml-4">
                <BookOpen className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Courses</h3>
                <p className="text-3xl font-bold text-teal-600">{enrollments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center ml-4">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Featured Courses</h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {enrollments.filter(e => e.course.isFeatured).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center ml-4">
                <CheckCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Required Courses</h3>
                <p className="text-3xl font-bold text-red-600">
                  {enrollments.filter(e => e.course.isRequired).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses List */}
        <div className="space-y-6">
          {enrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="p-6">
                {/* Course Header */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-8 h-8 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {enrollment.course.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          {enrollment.course.category && (
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(enrollment.course.category)}`}>
                              {enrollment.course.category}
                            </span>
                          )}
                          {enrollment.course.isFeatured && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Star className="w-3 h-3 ml-1" />
                              Featured
                            </span>
                          )}
                          {enrollment.course.isRequired && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <CheckCircle className="w-3 h-3 ml-1" />
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 lg:mt-0 lg:mr-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 ml-2" />
                      <span className="text-sm">Enrolled: {formatDate(enrollment.enrolledAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Course Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {enrollment.course.duration && (
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 ml-2" />
                      <span className="text-sm">{enrollment.course.duration}</span>
                    </div>
                  )}

                  {enrollment.course.trainer && (
                    <div className="flex items-center text-gray-600">
                      <User className="w-4 h-4 ml-2" />
                      <span className="text-sm">Instructor: {enrollment.course.trainer.name}</span>
                    </div>
                  )}

                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 ml-2" />
                    <span className="text-sm font-medium">Status: Enrolled</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors duration-200">
                    View Course
                  </button>
                  <button className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200">
                    View Certificate
                  </button>
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    Course Materials
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Courses Found */}
        {enrollments.length === 0 && !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              You haven't enrolled in any courses yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Start your learning journey by browsing our course catalog and enrolling in healthcare courses that interest you.
            </p>
            <a
              href="/courses"
              className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              <BookOpen className="w-5 h-5 ml-2" />
              Browse Courses
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
