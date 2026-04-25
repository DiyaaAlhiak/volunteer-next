import React from 'react';

export default function JoiningJourney() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold" style={{ color: '#34bca3' }}>
         رحلة الانضمام
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Step 1 */}
          <div className="text-center">
            <div className="mb-6">
              {/* UserPlus Icon Placeholder */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#34bca3' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900" style={{ color: '#34bca3' }}>
            قم بستجيل الطلب 
            </h3>
            <button 
              className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: '#34bca3' }}
            >
             سجل الان
            </button>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="mb-6">
              {/* ClipboardCheck Icon Placeholder */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#34bca3' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900" style={{ color: '#34bca3' }}>
              احصل على موفقة اولية 
            </h3>
            <button 
              className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: '#34bca3' }}
            >
             تابع طلبك
            </button>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="mb-6">
              {/* Users Icon Placeholder */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#34bca3' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900" style={{ color: '#34bca3' }}>
              قم بضم فريق
            </h3>
            <button 
              className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: '#34bca3' }}
            >
             دعوة فريق
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
