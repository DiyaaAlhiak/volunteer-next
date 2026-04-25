"use client";

import React, { useState } from 'react';
import Header from "@/components/Header";

export default function ContentPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('الأحدث');
  const [category, setCategory] = useState('اختر تصنيف');

  const courses = [
    {
      id: 1,
      title: 'دورة تنمية المهارات',
      instructor: 'محمد طه',
      description: 'دورة شاملة لتطوير المهارات الشخصية والمهنية في بيئة العمل التطوعي',
      enrolledCourses: 1,
      duration: 'min 50000',
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      title: 'دورة القيادة والتأثير',
      instructor: 'فاطمة العلي',
      description: 'تعلم أسس القيادة الفعالة وكيفية إحداث تأثير إيجابي في المجتمع',
      enrolledCourses: 3,
      duration: 'min 45000',
      image: '/api/placeholder/300/200'
    },
    {
      id: 3,
      title: 'دورة التواصل الفعال',
      instructor: 'أحمد محمد',
      description: 'مهارات التواصل المتقدمة للتعامل مع مختلف الفئات في العمل التطوعي',
      enrolledCourses: 2,
      duration: 'min 35000',
      image: '/api/placeholder/300/200'
    },
    {
      id: 4,
      title: 'دورة إدارة المشاريع',
      instructor: 'خالد السعيد',
      description: 'أدوات وتقنيات إدارة المشاريع التطوعية بكفاءة واحترافية',
      enrolledCourses: 4,
      duration: 'min 60000',
      image: '/api/placeholder/300/200'
    },
    {
      id: 5,
      title: 'دورة التخطيط الاستراتيجي',
      instructor: 'نورة أحمد',
      description: 'مهارات التخطيط الاستراتيجي للمبادرات التطوعية الناجحة',
      enrolledCourses: 1,
      duration: 'min 40000',
      image: '/api/placeholder/300/200'
    },
    {
      id: 6,
      title: 'دورة العمل الجماعي',
      instructor: 'عبدالله سالم',
      description: 'فنون التعاون والعمل الجماعي في بيئة التطوع الصحي',
      enrolledCourses: 2,
      duration: 'min 30000',
      image: '/api/placeholder/300/200'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header with Background Image */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-700 opacity-90"></div>
        <div 
          className="relative h-64 bg-cover bg-center"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2334bca3;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%232c7a7b;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='400' fill='url(%23grad)'/%3E%3Cpath d='M200 200 Q400 150 600 200 T400 250 Q200 200 200 200' fill='none' stroke='%23ffffff' stroke-width='2' opacity='0.3'/%3E%3Ccircle cx='200' cy='200' r='40' fill='%23ffffff' opacity='0.2'/%3E%3Ccircle cx='600' cy='200' r='40' fill='%23ffffff' opacity='0.2'/%3E%3Cpath d='M160 200 Q200 180 240 200 T200 220 Q160 200 160 200' fill='%2334bca3' opacity='0.6'/%3E%3Cpath d='M560 200 Q600 180 640 200 T600 220 Q560 200 560 200' fill='%2334bca3' opacity='0.6'/%3E%3C/svg%3E")`
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="text-center w-full">
              <h1 className="text-4xl font-bold text-white mb-4">
                الدورات التدريبية
              </h1>
              <nav className="text-sm text-gray-300" aria-label="Breadcrumb">
                <ol className="flex items-center justify-center space-x-2">
                  <li className="flex items-center">
                    <span className="text-gray-300">الرئيسية</span>
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </li>
                  <li className="text-white font-medium">الدورات التدريبية</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        
        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="بحث"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <svg 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option>الأحدث</option>
                <option>الأقدم</option>
                <option>الأعلى تقييماً</option>
                <option>الأقل سعراً</option>
              </select>
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option>اختر تصنيف</option>
                <option>تنمية المهارات</option>
                <option>القيادة</option>
                <option>التواصل</option>
                <option>إدارة المشاريع</option>
                <option>التخطيط</option>
              </select>
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div 
              key={course.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
            >
              {/* Course Image with Badge */}
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 opacity-20"></div>
                <div className="absolute top-3 left-3">
                  <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    مهاري
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors" style={{ color: '#34bca3' }}>
                  {course.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4">
                  By {course.instructor}
                </p>
                
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Bottom Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-reverse space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="text-sm text-gray-600">
                      {course.enrolledCourses} الدورات المشارك بها
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-reverse space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">
                      {course.duration}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
