'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Trophy,
  Loader2,
  TrendingUp,
  Play,
  ArrowLeft,
  Users,
  Team,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

// Stats Card Component
function StatsCard({ title, value, icon: Icon, color, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div className="text-right">
          <p className="text-[11px] font-black text-slate-400 mb-1 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-black text-slate-900">{value}</h3>
          {trend && (
            <div className="flex items-center text-[10px] font-bold text-emerald-600 mt-2 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 ml-1" />
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl shadow-lg shadow-opacity-10 ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// Course Card Component (Converted to Grid Style)
function CourseCard({ course }: { course: any }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group">
      <div className="h-24 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 flex items-center justify-center">
         <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6 text-emerald-600" />
         </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h4 className="font-black text-slate-900 text-sm mb-2 line-clamp-1">{course.title}</h4>
        
        <div className="mb-4 mt-auto">
          <div className="flex items-center justify-between text-[10px] font-bold mb-1.5">
            <span className="text-slate-400">التقدم الحالي</span>
            <span className="text-emerald-600">{course.progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(course.progress, 100)}%` }}
            />
          </div>
        </div>

        <Link 
          href={`/participant-dashboard/courses/${course.id}`}
          className="w-full bg-slate-50 text-slate-600 group-hover:bg-emerald-600 group-hover:text-white py-2 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2"
        >
          <Play size={12} fill="currentColor" />
          استكمال التعلم
        </Link>
      </div>
    </div>
  );
}

// Team Status Banner Component
function TeamStatusBanner({ teamStatus, teamName }: { teamStatus: string; teamName: string }) {
  const isApproved = teamStatus === 'approved';
  
  return (
    <div className={`rounded-2xl p-6 mb-8 border-2 ${
      isApproved 
        ? 'bg-emerald-50 border-emerald-200' 
        : 'bg-amber-50 border-amber-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${
            isApproved ? 'bg-emerald-600' : 'bg-amber-500'
          }`}>
            {isApproved ? (
              <CheckCircle2 className="w-6 h-6 text-white" />
            ) : (
              <AlertCircle className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">
              حالة الفريق: {isApproved ? 'معتمد' : 'معلق'}
            </h3>
            <p className="text-sm text-slate-600 font-medium">
              {teamName} - {isApproved 
                ? 'فريقك معتمد وجاهز للعمل'
                : 'فريقك في انتظار الاعتماد من الإدارة'
              }
            </p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full text-xs font-black ${
          isApproved 
            ? 'bg-emerald-600 text-white' 
            : 'bg-amber-500 text-white'
        }`}>
          {isApproved ? 'معتمد' : 'معلق'}
        </div>
      </div>
    </div>
  );
}

// Members Table Component
function MembersTable({ members }: { members: any[] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600" />
          أعضاء الفريق
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-right text-xs font-black text-slate-400 uppercase tracking-wider px-6 py-4">اسم العضو</th>
              <th className="text-right text-xs font-black text-slate-400 uppercase tracking-wider px-6 py-4">تاريخ الانضمام</th>
              <th className="text-right text-xs font-black text-slate-400 uppercase tracking-wider px-6 py-4">التقدم</th>
              <th className="text-right text-xs font-black text-slate-400 uppercase tracking-wider px-6 py-4">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members?.map((member, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-black text-slate-900">{member.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-600 font-medium">
                    {new Date(member.joinDate).toLocaleDateString('ar-SA')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-slate-100 rounded-full h-2 max-w-[100px]">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${member.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-black text-emerald-600">{member.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 text-xs font-black rounded-full ${
                    member.status === 'approved' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {member.status === 'approved' ? 'معتمد' : 'معلق'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ParticipantDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    awards: 0,
    totalMembers: 0
  });
  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [teamData, setTeamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch user data first
        const userRes = await fetch('/api/auth/me');
        const userData = await userRes.json();
        setUser(userData);
        
        if (userData.role === 'TEAM_LEADER') {
          // Fetch team leader data
          const teamRes = await fetch('/api/team-leader/stats');
          const teamData = await teamRes.json();
          setTeamData(teamData);
          setStats(prev => ({
            ...prev,
           totalMembers: teamData?.stats?.totalMembers || 0
          }));
        } else {
          // Fetch participant data
          const participantRes = await fetch('/api/participant/dashboard-stats');
          const participantData = await participantRes.json();
          setStats(participantData.stats || stats);
          setRecentCourses(participantData.recentCourses || []);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center font-tajawal">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold">جاري تحديث بياناتك...</p>
      </div>
    );
  }

  return (
    <div className="font-tajawal min-h-screen bg-[#f8fafc]" dir="rtl">
      
      {/* Header */}
      <div className="mb-10 text-right">
        <h1 className="text-3xl font-black text-slate-900">
          {user?.role === 'TEAM_LEADER' ? 'لوحة قائد الفريق' : 'لوحة المتابعة'}
        </h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">
          مرحباً {user?.name || 'مشارك'}، إليك ملخص {user?.role === 'TEAM_LEADER' ? 'نشاط فريقك' : 'نشاطك التعليمي'}.
        </p>
      </div>

      {/* Team Status Banner - Only for Team Leaders */}
      {user?.role === 'TEAM_LEADER' && teamData && (
        <TeamStatusBanner 
          teamStatus={teamData.teamStatus}
          teamName={teamData.teamName}
        />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatsCard title="الدورات المسجلة" value={stats.enrolledCourses} icon={BookOpen} color="bg-emerald-600" trend="نشط الآن" />
        <StatsCard title="الدورات المكتملة" value={stats.completedCourses} icon={CheckCircle} color="bg-blue-600" trend="+2 هذا الشهر" />
        <StatsCard title="ساعات التعلم" value={stats.totalHours} icon={Clock} color="bg-orange-500" trend="مستمر" />
        {user?.role === 'TEAM_LEADER' ? (
          <StatsCard title="إجمالي الأعضاء" value={stats.totalMembers} icon={Users} color="bg-purple-600" trend="فريقك" />
        ) : (
          <StatsCard title="الجوائز" value={stats.awards} icon={Trophy} color="bg-purple-600" trend="بطل" />
        )}
      </div>

      {/* Active Courses Section - Only for Participants */}
      {user?.role !== 'TEAM_LEADER' && (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
              دوراتي الحالية
            </h3>
            <Link href="/participant-dashboard/my-courses" className="text-xs font-black text-emerald-600 hover:gap-2 transition-all flex items-center gap-1">
              عرض جميع دوراتي
              <ArrowLeft size={14} />
            </Link>
          </div>
          
          {recentCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {recentCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2rem] p-16 text-center mb-12">
              <BookOpen className="text-slate-200 mx-auto mb-4" size={48} />
              <p className="text-slate-400 font-bold text-sm mb-6">لا توجد دورات مسجلة حالياً</p>
              <Link href="/participant-dashboard/catalog" className="bg-emerald-600 text-white px-8 py-3 rounded-xl text-xs font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 inline-block">
                ابدأ رحلة التعلم
              </Link>
            </div>
          )}
        </>
      )}

      {/* Members Table Section - Only for Team Leaders */}
      {user?.role === 'TEAM_LEADER' && teamData && (
        <MembersTable members={teamData.members} />
      )}
    </div>
  );
}