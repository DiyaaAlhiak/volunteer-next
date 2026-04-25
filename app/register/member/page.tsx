import Header from '@/components/Header';
import MemberRegistrationForm from '@/components/MemberRegistrationForm';
import { PrismaClient } from '@prisma/client';

export default async function MemberRegistration() {
  const prisma = new PrismaClient();

  // بيانات احتياطية في حال كانت قاعدة البيانات فارغة تماماً
  const fallbackTeams = [
    { id: 1, name: 'لا توجد فرق متاحة حالياً', region: '', city: '' },
  ];

  let isMemberRegistrationEnabled = false;
  let acceptedTeams: any[] = [];
  let useDatabase = true;

  try {
    // 1. جلب إعدادات النظام للتأكد إذا كان التسجيل مفتوحاً أم لا (حسب Image 1 في الملف)
    let settings = await prisma.settings.findFirst({
      where: { id: 1 }
    });

    // إذا لم تكن هناك إعدادات، نقوم بإنشائها افتراضياً
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

    // 2. جلب الفرق التي حالتها "accepted" فقط (حسب Image 6 في الملف)
    // لكي يختار العضو من الفرق المعتمدة فقط
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
    <div className="min-h-screen bg-[#0f172b] text-white" dir="rtl">
      <Header 
        title="تسجيل عضو جديد"
        description="انضم الآن كعضو في أحد الفرق التطوعية المعتمدة"
        breadcrumb="الرئيسية / تسجيل فرد"
      />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* تنبيه في حال وجود مشكلة في الاتصال بقاعدة البيانات */}
        {!useDatabase && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6 text-red-200">
            خطأ في الاتصال بقاعدة البيانات. تأكد من تشغيل XAMPP (Apache & MySQL).
          </div>
        )}

        {/* التحقق من إعدادات السوبر أدمن: هل التسجيل متاح؟ */}
        {!isMemberRegistrationEnabled ? (
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-2xl p-12 text-center">
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">تسجيل الأعضاء مغلق حالياً</h2>
            <p className="text-gray-300">نعتذر منك، لقد تم إيقاف استقبال طلبات الانضمام الجديدة من قبل الإدارة.</p>
          </div>
        ) : (
          <div className="bg-[#1e293b] rounded-2xl shadow-xl p-8 border border-gray-800">
            {/* عرض الفورم وتمرير الفرق المقبولة له */}
        <MemberRegistrationForm 
  isMemberRegistrationEnabled={isMemberRegistrationEnabled}
  acceptedTeams={acceptedTeams} // تأكد أن الاسم هنا يطابق ما هو موجود في المكون أعلاه
/>
          </div>
        )}
      </main>
    </div>
  );
}