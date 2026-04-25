import React from 'react';

export default function Rules() {
  const rules = [
    {
      title: "أن يكون المشارك ضمن المسجلين بمنصة التطوع الصحي",
    
    },
    {
      title: "تأسيس الفريق وفق الضوابط والشروط الموضحة في دليل التأسيس.", 
  
    },
    {
      title: "يحق لمركز التطوع الصحي استخدام اسم الفرق أو الأعضاء للإعلان في الوسائط الإعلامية المختلفة وفي وسائل التواصل الاجتماعي.",

    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#34bca3' }}>
           الشروط والأحكام
          </h2>
    
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {rules.map((rule, index) => (
              <div key={index} className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e8f5f3' }}>
                  <svg className="w-5 h-5 style={{ color: '#34bca3' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {rule.title}
                  </h3>
          
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
