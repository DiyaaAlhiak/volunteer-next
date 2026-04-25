import RoleBasedSidebar from '@/components/RoleBasedSidebar';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex" dir="rtl">
      <RoleBasedSidebar userRole="admin" />
      
      <main className="flex-1">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
