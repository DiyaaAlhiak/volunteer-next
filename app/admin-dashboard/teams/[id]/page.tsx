'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowRight, Check, X, Users, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  jobTitle?: string;
  organization?: string;
  region?: string;
  city?: string;
  role: string | null;
  status: string;
}

interface Team {
  id: number;
  name: string;
  leader_name: string | null;
  email: string | null;
  phone: string | null;
  region: string | null;
  city: string | null;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  users: TeamMember[]; 
}

export default function TeamDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchTeamDetails();
  }, [teamId]);

  const fetchTeamDetails = async () => {
    try {
      const response = await fetch(`/api/teams/${teamId}`);
      const data = await response.json();
      if (data.success) {
        setTeam(data.team);
      } else {
        setMessage({ type: 'error', text: data.error || 'فشل جلب تفاصيل الفريق' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ في الاتصال بالسيرفر' });
    } finally {
      setLoading(false);
    }
  };

  const updateTeamStatus = async (newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/teams', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: parseInt(teamId), status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        setTeam(prev => prev ? { ...prev, status: newStatus } : null);
        setMessage({ type: 'success', text: 'تم تحديث حالة الفريق بنجاح' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء التحديث' });
    }
  };

  const handleStatusUpdate = async (userId: number, newStatus: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        setTeam(prev => prev ? {
          ...prev,
          users: prev.users.map(user => 
            user.id === userId ? { ...user, status: newStatus } : user
          )
        } : null);
        setMessage({ 
          type: 'success', 
          text: `تم تحديث حالة العضو إلى ${newStatus === 'approved' ? 'مقبول' : 'مرفوض'} بنجاح` 
        });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'خطأ في الاتصال بالسيرفر' });
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { color: 'bg-orange-50 text-orange-600 border-orange-100', text: 'قيد الانتظار' },
      approved: { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', text: 'مقبول' },
      rejected: { color: 'bg-rose-50 text-rose-600 border-rose-100', text: 'مرفوض' },
    };
    const s = config[status as keyof typeof config] || config.pending;
    return (
      <span className={`px-4 py-1 rounded-full text-xs font-black border ${s.color}`}>
        {s.text}
      </span>
    );
  };

// تصفية المصفوفة لاستبعاد أي مستخدم رتبته قائد فريق
const volunteersOnly = team?.users?.filter(user => 
  user.role?.toUpperCase() !== 'TEAM_LEADER'
) || [];

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent"></div>
    </div>
  );

  if (!team) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center">
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">الفريق غير موجود</h3>
        <button onClick={() => router.back()} className="text-emerald-600 font-bold flex items-center gap-2 mx-auto">
          <ArrowRight className="w-4 h-4" /> العودة للقائمة
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans" dir="rtl">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 py-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <button onClick={() => router.back()} className="text-gray-400 hover:text-emerald-600 flex items-center gap-1 text-sm mb-4 transition-colors font-bold">
              <ArrowRight className="w-4 h-4 ml-1" /> العودة للقائمة
            </button>
            <h1 className="text-3xl font-black text-slate-800">{team.name}</h1>
            <p className="text-slate-500 mt-1">تاريخ التسجيل: {new Date(team.createdAt).toLocaleDateString('ar-SA')}</p>
          </div>
          <div className="flex gap-3">
            {team.status === 'pending' ? (
              <>
                <button onClick={() => updateTeamStatus('approved')} className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2">
                  <Check className="w-5 h-5" /> قبول الفريق
                </button>
                <button onClick={() => updateTeamStatus('rejected')} className="bg-white text-rose-600 border border-rose-200 px-6 py-2.5 rounded-xl font-bold hover:bg-rose-50 transition-all flex items-center gap-2">
                  <X className="w-5 h-5" /> رفض الطلب
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                {getStatusBadge(team.status)}
                <button onClick={() => updateTeamStatus('pending')} className="text-slate-400 hover:text-orange-600 text-sm font-bold underline transition-colors">
                  إعادة تعيين للحالة المعلقة؟
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 pb-12">
        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar: Leader & Location */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> بيانات القائد
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><Users className="w-5 h-5" /></div>
                  <div><p className="text-xs text-gray-400 font-bold">الاسم</p><p className="font-bold text-slate-700">{team.leader_name}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><Mail className="w-5 h-5" /></div>
                  <div><p className="text-xs text-gray-400 font-bold">البريد</p><p className="font-bold text-slate-700">{team.email}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><Phone className="w-5 h-5" /></div>
                  <div><p className="text-xs text-gray-400 font-bold">الهاتف</p><p className="font-bold text-slate-700 tracking-wider" dir="ltr">{team.phone}</p></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-500" /> الموقع
              </h3>
              <p className="text-slate-600 font-bold bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center uppercase">
                {team.region} - {team.city}
              </p>
            </div>
          </div>

          {/* Main Content: Members Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <h3 className="text-xl font-black text-slate-800">أعضاء الفريق ({volunteersOnly.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right" dir="rtl">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">المتطوع</th>
                      <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">المهنة والجهة</th>
                      <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">الموقع</th>
                      <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">الحالة</th>
                      <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {volunteersOnly.length > 0 ? (
                      volunteersOnly.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-700">{member.name}</span>
                              <span className="text-xs text-slate-400">{member.email}</span>
                              <span className="text-xs text-blue-500 mt-1" dir="ltr">{member.phone}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm text-slate-600">{member.jobTitle || 'غير محدد'}</span>
                              <span className="text-xs text-slate-400">{member.organization || 'مستقل'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-600">
                              {member.region} {member.city ? `- ${member.city}` : ''}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              member.status === 'approved' ? 'bg-green-100 text-green-700' :
                              member.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {member.status === 'approved' ? 'مقبول' : 
                               member.status === 'rejected' ? 'مرفوض' : 'قيد الانتظار'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {member.status === 'pending' ? (
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => handleStatusUpdate(member.id, 'approved')}
                                  className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all"
                                  title="قبول"
                                >
                                  <Check className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(member.id, 'rejected')}
                                  className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                                  title="رفض"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400 italic">تمت المعالجة</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-gray-400 font-bold">
                          لا يوجد متطوعون إضافيون منضمون لهذا الفريق حالياً
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}