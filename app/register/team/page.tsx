import Header from '@/components/Header';
import TeamRegistrationForm from '@/components/TeamRegistrationForm';

export default async function TeamRegistration() {
  // حالياً true لتجاوز أي تعليق في قاعدة البيانات
  const isTeamRegistrationEnabled = true;

  return (
    <div className="min-h-screen text-white" dir="rtl">
      <Header 
        title="تسجيل فريق جديد"
        description="املأ النموذج أدناه لتسجيل فريقك في مبادرات التطوع"
        breadcrumb="الرئيسية / تسجيل فريق"
      />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className=" rounded-2xl shadow-xl p-8 ">
           {/* هنا نستدعي النموذج اللي رح نعدله بالخطوة الجاية */}
           <TeamRegistrationForm isTeamRegistrationEnabled={isTeamRegistrationEnabled} />
        </div>
      </main>
    </div>
  );
}