import MemberSidebar from '@/components/MemberSidebar';
import ParticipantSidebar from '@/components/ParticipantSidebar';

export default function ParticipantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex " dir="rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <MemberSidebar/>
      
      <main className="flex-1 bg-[#f8fafc] p-6">
        {children}
      </main>
    </div>
  );
}
