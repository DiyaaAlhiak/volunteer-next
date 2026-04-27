import Header from '@/components/Header';
import MemberRegistrationForm from '@/components/MemberRegistrationForm';
import { PrismaClient } from '@prisma/client';

export default async function MemberRegistration() {
  const prisma = new PrismaClient();

  let isMemberRegistrationEnabled = false;
  let acceptedTeams: any[] = [];
  let useDatabase = true;

  try {
    // 1. جلب إعدادات النظام
    let settings = await prisma.settings.findFirst({
      where: { id: 1 }
    });

    if (!settings) {
      settings = await prisma.settings.create({
        data: { 
          id: 1, 
          allow_member_registration: true, 
          allow_team_registration: true 
        }
      });
    }
    
    isMemberRegistrationEnabled = settings.allow_member_registration;

    // 2. جلب الفرق المعتمدة
    const dbTeams = await prisma.team.findMany({
      where: { 
        status: 'approved' 
      },
      select: { 
        id: true, 
        name: true, 
        region: true, 
        city: true 
      }
    });

    acceptedTeams = dbTeams;
    
  } catch (error) {
    console.error('Database failure:', error);
    useDatabase = false;
  } finally {
    await prisma.$disconnect();
  }

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900" dir="rtl">
      <Header 
        title="تسجيل عضو جديد"
        description="انضم الآن كعضو في أحد الفرق التطوعية المعتمدة"
        breadcrumb="الرئيسية / تسجيل فرد"
      />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* تنبيه في حال وجود مشكلة في الاتصال بقاعدة البيانات */}
        {!useDatabase && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 flex items-center gap-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">خطأ في الاتصال بقاعدة البيانات. تأكد من تشغيل XAMPP (Apache & MySQL).</span>
          </div>
        )}

        {/* التحقق من إعدادات السوبر أدمن: هل التسجيل متاح؟ */}
        {!isMemberRegistrationEnabled ? (
          <div className="bg-white border border-yellow-100 rounded-[2rem] p-12 text-center shadow-xl shadow-yellow-50/50">
            <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m11-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-4">تسجيل الأعضاء مغلق حالياً</h2>
            <p className="text-gray-500 text-lg leading-relaxed max-w-md mx-auto">
              نعتذر منك، لقد تم إيقاف استقبال طلبات الانضمام الجديدة من قبل الإدارة في الوقت الحالي.
            </p>
          </div>
        ) : (
          <div className="  ">
            {/* عنوان داخلي للفورم لمزيد من الوضوح */}
            <div className="mb-10 pb-6 border-b border-gray-50 text-center lg:text-right">
                <h2 className="text-2xl font-bold text-[#34bca3]">نموذج الانضمام</h2>
                <p className="text-gray-400 text-sm mt-1">يرجى تعبئة كافة البيانات المطلوبة بدقة</p>
            </div>

            {/* عرض الفورم وتمرير الفرق المقبولة له */}
            <MemberRegistrationForm 
              isMemberRegistrationEnabled={isMemberRegistrationEnabled}
              acceptedTeams={acceptedTeams} 
            />
          </div>
        )}
      </main>
    </div>
  );
}