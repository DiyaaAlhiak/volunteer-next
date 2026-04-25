'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  Building,
  Save,
  Edit2,
  Loader2,
  Calendar,
  Shield
} from 'lucide-react';

// Input Field Component
function InputField({ 
  label, 
  icon: Icon, 
  value, 
  onChange, 
  disabled = false,
  type = 'text'
}: {
  label: string;
  icon: any;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Icon className="w-5 h-5" />
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full pr-10 pl-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
            disabled 
              ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
              : 'bg-white text-gray-900'
          }`}
        />
      </div>
    </div>
  );
}

export default function TeamProfilePage() {
  const [teamProfile, setTeamProfile] = useState({
    name: '',
    region: '',
    city: '',
    status: '',
    leader_name: '',
    email: '',
    phone: '',
    nationalId: '',
    job: '',
    organization: '',
    createdAt: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch team profile
  useEffect(() => {
    async function fetchTeamProfile() {
      try {
        setLoading(true);
        const res = await fetch('/api/team-leader/team-profile');
        if (res.ok) {
          const data = await res.json();
          setTeamProfile(data);
        } else {
          const errorData = await res.json();
          setError(errorData.error || 'فشل في تحميل بيانات الفريق');
        }
      } catch (error) {
        console.error("Failed to fetch team profile", error);
        setError('فشل في تحميل بيانات الفريق');
      } finally {
        setLoading(false);
      }
    }
    fetchTeamProfile();
  }, []);

  // Handle team profile update
  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/team-leader/team-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: teamProfile.name,
          region: teamProfile.region,
          city: teamProfile.city
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update team profile');
      }

      const updatedData = await res.json();
      setTeamProfile(updatedData);
      setSuccess('تم تحديث بيانات الفريق بنجاح!');
      setIsEditing(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'حدث خطأ ما');
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel edit
  const handleCancel = async () => {
    // Reset to original data
    try {
      const res = await fetch('/api/team-leader/team-profile');
      if (res.ok) {
        const data = await res.json();
        setTeamProfile(data);
      }
    } catch (error) {
      console.error("Failed to reset team profile", error);
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل بيانات الفريق...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">ملف الفريق</h1>
            <p className="text-gray-600 mt-2">إدارة معلومات الفريق وتفاصيله</p>
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center px-4 py-2 border border-slate-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 ml-2" />
                  {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                <Edit2 className="w-4 h-4 ml-2" />
                تعديل بيانات الفريق
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Team Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Team Info Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="text-center">
              <div className="w-32 h-32 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-16 h-16 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{teamProfile.name || 'فريق'}</h3>
              <p className="text-sm text-gray-600">{teamProfile.email}</p>
              
              {/* Team Status */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">حالة الفريق</span>
                  <span className={`font-medium ${
                    teamProfile.status === 'approved' ? 'text-emerald-600' : 'text-yellow-600'
                  }`}>
                    {teamProfile.status === 'approved' ? 'معتمد' : 'قيد الانتظار'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">قائد الفريق</span>
                  <span className="font-medium text-gray-900">{teamProfile.leader_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">تاريخ الإنشاء</span>
                  <span className="font-medium text-gray-900">
                    {teamProfile.createdAt ? new Date(teamProfile.createdAt).toLocaleDateString('ar-SA') : 'غير محدد'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">معلومات الفريق</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team Name */}
              <InputField
                label="اسم الفريق"
                icon={Users}
                value={teamProfile.name || ''}
                onChange={(value) => setTeamProfile(prev => ({ ...prev, name: value }))}
                disabled={!isEditing}
              />

              {/* Region */}
              <InputField
                label="المنطقة"
                icon={MapPin}
                value={teamProfile.region || ''}
                onChange={(value) => setTeamProfile(prev => ({ ...prev, region: value }))}
                disabled={!isEditing}
              />

              {/* City */}
              <InputField
                label="المدينة"
                icon={MapPin}
                value={teamProfile.city || ''}
                onChange={(value) => setTeamProfile(prev => ({ ...prev, city: value }))}
                disabled={!isEditing}
              />

              {/* Leader Name (Read-only) */}
              <InputField
                label="اسم قائد الفريق"
                icon={Shield}
                value={teamProfile.leader_name || ''}
                onChange={() => {}}
                disabled={true}
              />

              {/* Email (Read-only) */}
              <InputField
                label="البريد الإلكتروني"
                icon={Mail}
                value={teamProfile.email || ''}
                onChange={() => {}}
                disabled={true}
                type="email"
              />

              {/* Phone (Read-only) */}
              <InputField
                label="رقم الهاتف"
                icon={Phone}
                value={teamProfile.phone || ''}
                onChange={() => {}}
                disabled={true}
              />

              {/* National ID (Read-only) */}
              <InputField
                label="الرقم الوطني"
                icon={Shield}
                value={teamProfile.nationalId || ''}
                onChange={() => {}}
                disabled={true}
              />

              {/* Job (Read-only) */}
              <InputField
                label="الوظيفة"
                icon={Briefcase}
                value={teamProfile.job || ''}
                onChange={() => {}}
                disabled={true}
              />

              {/* Organization (Read-only) */}
              <InputField
                label="المنظمة"
                icon={Building}
                value={teamProfile.organization || ''}
                onChange={() => {}}
                disabled={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
