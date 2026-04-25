'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  UserCheck, 
  Clock,
  Calendar,
  Loader2,
  Search,
  Filter
} from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  joinDate: string;
  role: string;
  region: string;
  city: string;
}

export default function TeamMembersPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch team members
  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        setLoading(true);
        const res = await fetch('/api/team-leader/members');
        if (res.ok) {
          const data = await res.json();
          setMembers(data);
        } else {
          const errorData = await res.json();
          setError(errorData.error || 'فشل في تحميل أعضاء الفريق');
        }
      } catch (error) {
        console.error("Failed to fetch team members", error);
        setError('فشل في تحميل أعضاء الفريق');
      } finally {
        setLoading(false);
      }
    }
    fetchTeamMembers();
  }, []);

  // Filter members based on search and status
  const filteredMembers = members.filter(member => {
    const matchesSearch = searchTerm === '' || 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const isApproved = status === 'approved';
    return (
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
        isApproved 
          ? 'bg-emerald-100 text-emerald-700' 
          : 'bg-yellow-100 text-yellow-700'
      }`}>
        {isApproved ? (
          <>
            <UserCheck className="w-4 h-4" />
            <span>معتمد</span>
          </>
        ) : (
          <>
            <Clock className="w-4 h-4" />
            <span>قيد الانتظار</span>
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل أعضاء الفريق...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-8" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">أعضاء الفريق</h1>
            <p className="text-gray-600 mt-2">عرض وإدارة جميع أعضاء فريقك</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-5 h-5" />
            <span>إجمالي الأعضاء: {members.length}</span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="البحث بالاسم، البريد الإلكتروني، أو رقم الهاتف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:w-48">
            <div className="relative">
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Filter className="w-5 h-5" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
              >
                <option value="all">جميع الحالات</option>
                <option value="approved">المعتمدون</option>
                <option value="pending">قيد الانتظار</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الاسم</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">البريد الإلكتروني</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">رقم الهاتف</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الحالة</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">تاريخ الانضمام</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-600">{member.role}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{member.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{member.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={member.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(member.joinDate).toLocaleDateString('ar-SA')}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Users className="w-12 h-12 text-gray-300" />
                      <div>
                        <p className="text-gray-900 font-medium">لا توجد نتائج</p>
                        <p className="text-gray-600 text-sm">
                          {searchTerm || statusFilter !== 'all' 
                            ? 'حاول تعديل الفلاتر أو البحث' 
                            : 'لا يوجد أعضاء في الفريق حالياً'}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        {filteredMembers.length > 0 && (
          <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-gray-600">
                  المعتمدون: {filteredMembers.filter(m => m.status === 'approved').length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">
                  قيد الانتظار: {filteredMembers.filter(m => m.status === 'pending').length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">
                  إجمالي العرض: {filteredMembers.length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
