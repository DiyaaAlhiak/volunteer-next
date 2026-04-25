
export default function Features() {
  const features = [
    {
      icon: "award",
      title: "شهادات معتمدة",
      description: "توثيق رسمي لساعاتك التطوعية لتعزيز سيرتك الذاتية"
    },
    {
      icon: "book",
      title: "تدريب تخصصي", 
      description: "ورش عمل مجانية لتطوير مهاراتك القيادية والتقنية"
    },
    {
      icon: "users",
      title: "شبكة علاقات",
      description: "فرصة للتواصل مع خبراء ومؤثرين في العمل المجتمعي"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            المميزات
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            اكتشف الفوائد العديدة التي ستحصل عليها ك سفير تطوع
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="text-center p-8 rounded-lg border border-emerald-100 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
              dir="rtl"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
                {feature.icon === "award" && (
                  <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 013.138 3.138 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138-3.138 3.42 3.42 0 00.806-1.946 3.42 3.42 0 00-3.138-3.138 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 00-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 00-3.138-3.138z" />
                  </svg>
                )}
                {feature.icon === "book" && (
                  <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )}
                {feature.icon === "users" && (
                  <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4 text-right">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-right leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
