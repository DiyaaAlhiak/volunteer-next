'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, X, Eye, Users, MapPin, Mail, Phone, Shield, ArrowRight } from 'lucide-react';

interface Team {
  id: number;
  name: string;
  leader_name: string;
  email: string;
  phone: string;
  region: string;
  city: string;
  national_id: string;
  job: string;
  organization: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string; 
}

export default function TeamsManagement() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      const data = await response.json();
      if (data.success) {
        setTeams(data.teams);
      } else {
        setMessage({ type: 'error', text: data.error || 'فشل جلب الفرق' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء جلب الفرق' });
    } finally {
      setLoading(false);
    }
  };

  const updateTeamStatus = async (teamId: number, newStatus: 'pending' | 'accepted' | 'rejected') => {
    try {
      const response = await fetch('/api/teams', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        setTeams(teams.map(team => team.id === teamId ? { ...team, status: newStatus } : team));
        setMessage({ type: 'success', text: 'تم تحديث حالة الفريق بنجاح' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ في الاتصال' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent"></div>
          <span className="text-gray-500 font-medium">جاري مزامنة البيانات...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12 font-sans" dir="rtl">
      {/* Header القسم العلوي */}
      <div className="bg-white border-b border-gray-200 py-8 mb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2 text-emerald-600">
            <Shield className="w-6 h-6" />
            <span className="font-bold tracking-wide uppercase text-sm">نظام الإشراف</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800">إدارة الفرق التطوعية</h1>
          <p className="text-slate-500 mt-1">يمكنك مراجعة، قبول، أو رفض طلبات انضمام الفرق الجديدة من هنا.</p>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4">
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
            message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
            <span className="font-semibold">{message.text}</span>
          </div>
        )}

        {/* الجدول بالتصميم الجديد */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-slate-600 font-bold text-sm">الفريق والقائد</th>
                  <th className="px-8 py-5 text-slate-600 font-bold text-sm">بيانات التواصل</th>
                  <th className="px-8 py-5 text-slate-600 font-bold text-sm">الموقع الجغرافي</th>
                  <th className="px-8 py-5 text-slate-600 font-bold text-sm text-center">الحالة</th>
                  <th className="px-8 py-5 text-slate-600 font-bold text-sm text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {teams.map((team) => (
                  <tr key={team.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-lg border border-emerald-100">
                          {team.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-base group-hover:text-emerald-600 transition-colors">{team.name}</div>
                          <div className="text-slate-400 text-xs flex items-center mt-1">
                            <Users className="w-3 h-3 ml-1" /> {team.leader_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center text-sm text-slate-600"><Mail className="w-3.5 h-3.5 ml-2 text-slate-400" /> {team.email}</div>
                        <div className="flex items-center text-sm text-slate-600"><Phone className="w-3.5 h-3.5 ml-2 text-slate-400" /> {team.phone}</div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center text-sm text-slate-600">
                        <MapPin className="w-4 h-4 ml-1.5 text-rose-500" />
                        {team.region}، {team.city}
                      </div>
                    </td>
        <td className="px-8 py-6 text-center">
  <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black tracking-wide ${
    team.status === 'pending' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 
    // التغيير هنا: استخدمنا approved بدلاً من accepted
    team.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
    'bg-rose-50 text-rose-600 border border-rose-100'
  }`}>
    {/* التغيير هنا أيضاً */}
    {team.status === 'pending' ? 'انتظار' : team.status === 'approved' ? 'مقبول' : 'مرفوض'}
  </span>
</td>
              <td className="px-8 py-6">
  <div className="flex items-center justify-center gap-2">
    {/* زر التفاصيل يظهر دائماً */}
    <Link
      href={`/admin-dashboard/teams/${team.id}`}
      className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
      title="عرض التفاصيل"
    >
      <Eye className="w-5 h-5" />
    </Link>
    
    {/* أزرار القبول والرفض تظهر فقط إذا كانت الحالة "انتظار" */}
    {team.status === 'pending' && (
      <>
        <button 
          onClick={() => updateTeamStatus(team.id, 'approved')} 
          className="p-2.5 rounded-xl bg-slate-100 text-slate-400 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
          title="قبول"
        >
          <Check className="w-5 h-5" />
        </button>
        
        <button 
          onClick={() => updateTeamStatus(team.id, 'rejected')} 
          className="p-2.5 rounded-xl bg-slate-100 text-slate-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
          title="رفض"
        >
          <X className="w-5 h-5" />
        </button>
      </>
    )}
  </div>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {teams.length === 0 && (
            <div className="py-20 text-center">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium">لا توجد فرق مسجلة حالياً</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}