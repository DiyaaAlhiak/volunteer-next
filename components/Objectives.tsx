import React from 'react';

export default function Objectives() {
  const objectives = [
    {
      icon: "fileText",
      title: " إصدار أدلة عملية",
      description: "تساهم في تفعيل التطوع الصحي خلال الأزمات والكوارث من قبل كافة أصحاب المصلحة"
    },
    {
      icon: "users",
      title: "تأسيس الفرق",
      description: "تأسيس فرق تطوعية صحية متنوعة التخصصات للتكامل في التصدي للازمات"
    },
    {
      icon: "zap",
      title: "فع جاهزية الفرق",
      description: "رفع جاهزية الفرق التطوعية وتمكينها وبناء قدراتها في التصدي للأزمات والكوارث "
    },
    {
      icon: "shield",
      title: "تأهيل الجهات",
      description: "تأهيل الجهات المشرفة على الفرق التطوعية من إدارة الفرق ومأسستها واستبقائها"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#34bca3' }}>
        أهداف سفراء التطوع الصحي
          </h2>
       
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {objectives.map((objective, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors" style={{ backgroundColor: '#e8f5f3' }}>
                {objective.icon === "fileText" && (
                  <svg className="w-8 h-8 style={{ color: '#34bca3' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                {objective.icon === "users" && (
                  <svg className="w-8 h-8 style={{ color: '#34bca3' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
                {objective.icon === "zap" && (
                  <svg className="w-8 h-8 style={{ color: '#34bca3' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
                {objective.icon === "shield" && (
                  <svg className="w-8 h-8 style={{ color: '#34bca3' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#34bca3' }}>
                {objective.title}
              </h3>
              <p className="text-gray-600">
                {objective.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
