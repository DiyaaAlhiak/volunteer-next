'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Search, Check, X, UserCheck, Trash2, AlertTriangle, Phone, Shield } from 'lucide-react';

export default function MemberApproval() {
  const [members, setMembers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // جلب الأعضاء عند تحميل الصفحة
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/members');
      const data = await response.json();
      
      if (data.success) {
        setMembers(data.members);
      } else {
        setMessage({ type: 'error', text: data.error || 'فشل جلب الأعضاء' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ في الاتصال بالسيرفر' });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch('/api/members', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: id, status: newStatus }),
      });
      const data = await response.json();

      if (data.success) {
        setMembers(members.map(m => m.id === id ? { ...m, status: newStatus } : m));
        setMessage({ type: 'success', text: 'تم تحديث الحالة بنجاح' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'فشل التحديث' });
    }
  };

  const filteredMembers = members.filter(m =>
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.nationalId?.includes(searchTerm)
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen" dir="rtl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">إدارة وموافقة الأعضاء</h1>
        <p className="text-gray-500">تحكم في صلاحيات المتطوعين وطلبات الانضمام الجديدة.</p>
      </div>

      {/* شريط البحث */}
      <div className="mb-6 relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text"
          placeholder="ابحث بالاسم، البريد، أو رقم الهوية..."
          className="w-full pr-10 pl-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* جدول الأعضاء */}
<div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
  <div className="overflow-x-auto">
    <table className="w-full text-right" dir="rtl">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-4 py-4 text-sm font-semibold text-gray-600">الاسم</th>
          <th className="px-4 py-4 text-sm font-semibold text-gray-600">البريد الإلكتروني</th>
          <th className="px-4 py-4 text-sm font-semibold text-gray-600">المهنة</th>
          <th className="px-4 py-4 text-sm font-semibold text-gray-600">الجوال</th>
          <th className="px-4 py-4 text-sm font-semibold text-gray-600">رقم الهوية</th>
          <th className="px-4 py-4 text-sm font-semibold text-gray-600">الجهة التابع لها</th>
          <th className="px-4 py-4 text-sm font-semibold text-gray-600">الدور</th>
          <th className="px-4 py-4 text-sm font-semibold text-gray-600 text-center">الحالة</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {filteredMembers.map((member) => (
          <tr key={member.id} className="hover:bg-gray-50 transition-colors text-sm">
            <td className="px-4 py-4 font-bold text-gray-900">{member.name}</td>
            <td className="px-4 py-4 text-gray-600">{member.email}</td>
            <td className="px-4 py-4 text-gray-600">{member.job || '-'}</td>
            <td className="px-4 py-4 text-gray-600 font-mono">{member.phone}</td>
            <td className="px-4 py-4 text-gray-600 font-mono">{member.nationalId}</td>
            <td className="px-4 py-4 text-gray-600">{member.organization || member.team?.name || 'مستقل'}</td>
            <td className="px-4 py-4">
               <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                member.role === 'admin' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
              }`}>
                {member.role === 'admin' ? 'مدير نظام' : 'متطوع'}
              </span>
            </td>
            <td className="px-4 py-4 text-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                member.status === 'approved' || member.status === 'active' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-amber-400 text-white'
              }`}>
                {member.status === 'approved' || member.status === 'active' ? 'مقبول' : 'قيد الانتظار'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
  </div>
  );
}
