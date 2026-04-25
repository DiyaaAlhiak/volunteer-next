"use client";

import React, { useState } from 'react';

export default function ContactForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Handle form submission here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleForm = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-5" dir="rtl">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        <button
          onClick={toggleForm}
          className="w-full px-6 py-4 text-right bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
        >
          <span className="text-lg font-medium text-gray-900">
            لديك أسئلة أخرى؟
          </span>
          {isOpen ? (
            <svg className="w-5 h-5 text-gray-500 transform rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-500 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>

        {/* Form Content */}
        <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="p-8 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="الاسم"
                  className="w-full px-4 py-3 bg-blue-50 border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors text-right"
                  dir="rtl"
                />
              </div>

              {/* Email Field */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="البريد الإلكتروني"
                  className="w-full px-4 py-3 bg-blue-50 border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors text-right"
                  dir="rtl"
                />
              </div>

              {/* Subject Field */}
              <div>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="الموضوع"
                  className="w-full px-4 py-3 bg-blue-50 border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors text-right"
                  dir="rtl"
                />
              </div>

              {/* Message Field */}
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="الرسالة"
                  className="w-full px-4 py-3 bg-blue-50 border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors text-right resize-none"
                  dir="rtl"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  أرسل رسالة
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
