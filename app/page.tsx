import Header from "@/components/Header";
import About from "@/components/About";
import JoiningJourney from "@/components/JoiningJourney";
import Stats from "@/components/Stats";
import Objectives from "@/components/Objectives";
import Rules from "@/components/Rules";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";
import FloatingContact from "@/components/FloatingContact";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen" dir="rtl">
      <Header 
        title="سفراء التطوع الصحي"
        description=""
        showButton={true}
        buttonText="سجل الان"
      />
      
     
  
      
      <main className="bg-white">
        <About />
        <Objectives />
        <Stats />
        <JoiningJourney />
        <Rules />
        <FAQ />
        
        {/* Registration Section */}
        <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                انضم إلينا اليوم
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                اختر طريقك للمشاركة في مبادرات التطوع الصحي
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Team Registration Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    تسجيل فريق
                  </h3>
                  <p className="text-gray-600 mb-6">
                    سجل فريقك للمشاركة في المبادرات الصحية وكن جزءاً من التغيير الإيجابي
                  </p>
                </div>
                <Link 
                  href="/register/team"
                  className="w-full block bg-emerald-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-emerald-700 transition-colors duration-200 text-center"
                >
                  سجل فريقك الآن
                </Link>
              </div>

              {/* Member Registration Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    تسجيل فرد
                  </h3>
                  <p className="text-gray-600 mb-6">
                    انضم كمتطوع فرد للمشاركة في الأنشطة الصحية والمبادرات المجتمعية
                  </p>
                </div>
                <Link 
                  href="/register/member"
                  className="w-full block bg-teal-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-teal-700 transition-colors duration-200 text-center"
                >
                  سجل كفرد الآن
                </Link>
              </div>
            </div>
          </div>
        </section>

        <ContactForm />
      </main>
      <FloatingContact />
    </div>
  );
}