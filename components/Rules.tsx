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
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* الجانب الأيمن: النصوص والشروط */}
          <div className="order-2 lg:order-1">
            <div className="text-right mb-10">
              <h2 className="text-3xl lg:text-4xl font-black mb-6" style={{ color: '#34bca3' }}>
                الشروط والأحكام
              </h2>
              <div className="w-20 h-1.5 bg-yellow-400 rounded-full"></div> {/* خط زخرفي تحت العنوان */}
            </div>
            
            <div className="space-y-8">
              {rules.map((rule, index) => (
                <div key={index} className="flex items-start gap-4 rtl:space-x-reverse group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm" style={{ backgroundColor: '#e8f5f3' }}>
                    <svg className="w-6 h-6" style={{ color: '#34bca3' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="pt-1">
                    <h3 className="text-lg lg:text-xl font-bold text-gray-800 leading-relaxed group-hover:text-[#34bca3] transition-colors">
                      {rule.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* الجانب الأيسر: الصورة */}
          <div className="order-1 lg:order-2 relative">
            {/* زخرفة خلف الصورة */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-100 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-60"></div>
            
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-gray-50 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://pioneerseg.ddns.net:6901/assets/uploads/media-uploader/large-rectangle-771687475578.png" 
                alt="الشروط والأحكام" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}