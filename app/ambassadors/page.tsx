import React from 'react';
import Header from "@/components/Header";

export default function AmbassadorsPage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header 
        title="سفراء التطوع الصحي"
        showButton={false}
        breadcrumb="الرئيسية / سفراء التطوع"
      />
      
      <main className="container mx-auto px-4 py-12">
        
        {/* Section: أهمية سفراء التطوع الصحي */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#34bca3' }}>
              أهمية سفراء التطوع الصحي
            </h2>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                يعتبر برنامج سفراء التطوع الصحي ركيزة أساسية في منظومة التطوع الصحي بالمملكة، حيث يمثل السفراء 
                جسراً مهماً بين الهيئات الصحية والمجتمع. يلعب السفراء دوراً حيوياً في نشر الوعي الصحي، 
                وتنظيم الحملات التطوعية، وتقديم الدعم للمبادرات الصحية المحلية.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                من خلال تدريب وتأهيل السفراء، نضمن وجود فريق عمل متخصص وقادر على التعامل مع مختلف التحديات 
                الصحية والمساهمة بفاعلية في تحسين جودة الخدمات الصحية المقدمة للمواطنين والمقيمين.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                يساهم السفراء في بناء مجتمع صحي واعٍ ومشارك، ويعززون ثقافة التطوع في القطاع الصحي، 
                ويدعمون أهداف رؤية المملكة 2030 في تحسين مستوى الصحة العامة.
              </p>
            </div>
          </div>
        </section>

        {/* Section: خطوات تأسيس فريق سفراء التطوع الصحي */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#34bca3' }}>
              خطوات تأسيس فريق سفراء التطوع الصحي
            </h2>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-reverse space-x-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#34bca3' }}>
                        <span className="text-white font-bold">1</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: '#34bca3' }}>
                          تحديد الفريق المستهدف
                        </h3>
                        <p className="text-gray-600">
                          اختيار الأفراد المناسبين الذين يمتلكون الشغف والخبرة في المجال الصحي
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-reverse space-x-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#34bca3' }}>
                        <span className="text-white font-bold">2</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: '#34bca3' }}>
                          التدريب والتأهيل
                        </h3>
                        <p className="text-gray-600">
                          توفير برامج تدريبية متخصصة لتطوير المهارات والمعارف الصحية
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-reverse space-x-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#34bca3' }}>
                        <span className="text-white font-bold">3</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: '#34bca3' }}>
                          التنسيق والتواصل
                        </h3>
                        <p className="text-gray-600">
                          إنشاء قنوات تواصل فعالة بين السفراء والهيئات الصحية
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-reverse space-x-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#34bca3' }}>
                        <span className="text-white font-bold">4</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: '#34bca3' }}>
                          المتابعة والتقييم
                        </h3>
                        <p className="text-gray-600">
                          قياس الأثر وتحسين الأداء المستمر لفرق السفراء
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: أبرز فوائد تأسيس فرق سفراء التطوع الصحي */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#34bca3' }}>
              أبرز فوائد تأسيس فرق سفراء التطوع الصحي
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#34bca3' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  تعزيز التخصصات
                </h3>
                <p className="text-gray-600">
                  تطوير المهارات المتخصصة في المجال الصحي وزيادة الكفاءة المهنية
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#34bca3' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  التعامل مع الحالات العادية
                </h3>
                <p className="text-gray-600">
                  القدرة على إدارة الحالات الصحية اليومية بكفاءة واحترافية
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#34bca3' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  الاستجابة السريعة
                </h3>
                <p className="text-gray-600">
                  توفير الدعم الفوري في الحالات الطارئة والظروف الحرجة
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#34bca3' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  التطوير المستمر
                </h3>
                <p className="text-gray-600">
                  تحديث المعارف والمهارات بشكل مستمر لمواكبة التطورات الصحية
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#34bca3' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  قياس الأثر
                </h3>
                <p className="text-gray-600">
                  تتبع وتحليل نتائج المبادرات الصحية وتحسينها بشكل مستمر
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#34bca3' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  خدمة المجتمع
                </h3>
                <p className="text-gray-600">
                  المساهمة في بناء مجتمع صحي واعٍ ومشارك بفعالية
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: قصص النجاح (Success Stories) */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#34bca3', borderBottom: '3px solid #34bca3', paddingBottom: '12px', display: 'inline-block' }}>
              قصص النجاح
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">
                    قاد فريقاً متطوعاً بنجاح في حملة التوعية الصحية التي وصلت إلى أكثر من 10,000 مستفيد في مختلف مناطق المملكة.
                  </p>
                  <div className="text-right">
                    <h4 className="font-semibold text-gray-900" style={{ color: '#34bca3' }}>
                      أحمد محمد
                    </h4>
                    <p className="text-sm text-gray-600">
                      سفير التطوع الصحي - المنطقة الشرقية
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">
                    أسست برنامجاً تدريبياً مبتكراً للتطوع الصحي أثرى أكثر من 500 متطوع بالمهارات اللازمة.
                  </p>
                  <div className="text-right">
                    <h4 className="font-semibold text-gray-900" style={{ color: '#34bca3' }}>
                      فاطمة العلي
                    </h4>
                    <p className="text-sm text-gray-600">
                      سفيرة التطوع الصحي - منطقة الرياض
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">
                    ساهمت في تنظيم أكثر من 20 فعالية صحية تطوعية خدمت آلاف الأسر في المنطقة الغربية.
                  </p>
                  <div className="text-right">
                    <h4 className="font-semibold text-gray-900" style={{ color: '#34bca3' }}>
                      خالد السعيد
                    </h4>
                    <p className="text-sm text-gray-600">
                      سفير التطوع الصحي - المنطقة الغربية
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
