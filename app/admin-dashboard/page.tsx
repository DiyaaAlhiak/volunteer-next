'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  Clock, 
  CheckCircle, 
  TrendingUp 
} from 'lucide-react';

// مكون البطاقة الإحصائية (Stat Card)
function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs font-medium text-emerald-600">
        <TrendingUp className="w-3 h-3 ml-1" />
        <span>تحديث فوري من النظام</span>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    activeCourses: 0,
    enrolledTotal: 0
  });

  // جلب البيانات من السيرفر
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="p-6 lg:p-8" dir="rtl">
      {/* الترحيب */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">مرحباً بك، طلات الصبحي 👋</h1>
        <p className="text-gray-500 mt-1">إليك نظرة سريعة على ما يحدث في "سفراء التطوع" اليوم.</p>
      </div>

      {/* الإحصائيات - 4 كروت أساسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="إجمالي الأعضاء" 
          value={stats.totalUsers} 
          icon={Users} 
          color="bg-blue-600" 
        />
        <StatCard 
          title="طلبات في الانتظار" 
          value={stats.pendingUsers} 
          icon={Clock} 
          color="bg-amber-500" 
        />
        <StatCard 
          title="الدورات المتاحة" 
          value={stats.activeCourses} 
          icon={GraduationCap} 
          color="bg-emerald-600" 
        />
        <StatCard 
          title="المسجلون في الدورات" 
          value={stats.enrolledTotal} 
          icon={CheckCircle} 
          color="bg-purple-600" 
        />
      </div>

      {/* قسم إضافي للتنبيهات السريعة */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">أحدث طلبات الانضمام</h3>
          <p className="text-sm text-gray-500">هنا سيظهر جدول مصغر لأول 5 أعضاء يحتاجون موافقة...</p>
          {/* يمكنك وضع جدول مصغر هنا لاحقاً */}
        </div>
        
        <div className="bg-[#0f172b] p-6 rounded-2xl shadow-sm text-white">
          <h3 className="text-lg font-bold mb-4">حالة النظام</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
              <span>تواصل السيرفر</span>
              <span className="text-emerald-400">مستقر</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
              <span>آخر تحديث تلقائي</span>
              <span>منذ دقيقة واحدة</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}