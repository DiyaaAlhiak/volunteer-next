'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  Building,
  Save,
  Edit2,
  Camera,
  Upload,
  Loader2
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

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    nationalId: '',
    region: '',
    city: '',
    jobTitle: '',
    organization: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  // Fetch user profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await fetch('/api/participant/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
        setError('فشل في تحميل بيانات الملف الشخصي');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Handle profile update
  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/participant/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      setSuccess('تم تحديث الملف الشخصي بنجاح!');
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
      const res = await fetch('/api/participant/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Failed to reset profile", error);
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  // Handle avatar upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل الملف الشخصي...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">الملف الشخصي</h1>
            <p className="text-gray-600 mt-2">إدارة معلوماتك الشخصية وتفضيلاتك</p>
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
                تعديل الملف الشخصي
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

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Avatar Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-4 left-4 bg-emerald-600 text-white p-2 rounded-full cursor-pointer hover:bg-emerald-700 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{profile.name || 'مستخدم'}</h3>
              <p className="text-sm text-gray-600">{profile.email}</p>
              
              {/* Account Status */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">حساب</span>
                  <span className="font-medium text-emerald-600">نشط</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">نوع العضوية</span>
                  <span className="font-medium text-gray-900">مشارك</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">المعلومات الشخصية</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <InputField
                label="الاسم الكامل"
                icon={User}
                value={profile.name || ''}
                onChange={(value) => setProfile(prev => ({ ...prev, name: value }))}
                disabled={!isEditing}
              />

              {/* Email */}
              <InputField
                label="البريد الإلكتروني"
                icon={Mail}
                value={profile.email || ''}
                onChange={(value) => setProfile(prev => ({ ...prev, email: value }))}
                disabled={true} // Email should not be editable
                type="email"
              />

              {/* Phone */}
              <InputField
                label="رقم الهاتف"
                icon={Phone}
                value={profile.phone || ''}
                onChange={(value) => setProfile(prev => ({ ...prev, phone: value }))}
                disabled={!isEditing}
              />

              {/* National ID */}
              <InputField
                label="الرقم الوطني"
                icon={User}
                value={profile.nationalId || ''}
                onChange={(value) => setProfile(prev => ({ ...prev, nationalId: value }))}
                disabled={true} // National ID should not be editable
              />

              {/* Region */}
              <InputField
                label="المنطقة"
                icon={MapPin}
                value={profile.region || ''}
                onChange={(value) => setProfile(prev => ({ ...prev, region: value }))}
                disabled={!isEditing}
              />

              {/* City */}
              <InputField
                label="المدينة"
                icon={MapPin}
                value={profile.city || ''}
                onChange={(value) => setProfile(prev => ({ ...prev, city: value }))}
                disabled={!isEditing}
              />

              {/* Job Title */}
              <InputField
                label="الوظيفة"
                icon={Briefcase}
                value={profile.jobTitle || ''}
                onChange={(value) => setProfile(prev => ({ ...prev, jobTitle: value }))}
                disabled={!isEditing}
              />

              {/* Organization */}
              <InputField
                label="المنظمة"
                icon={Building}
                value={profile.organization || ''}
                onChange={(value) => setProfile(prev => ({ ...prev, organization: value }))}
                disabled={!isEditing}
              />
            </div>

            {/* Password Change Section */}
            {isEditing && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">تغيير كلمة المرور</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="كلمة المرور الحالية"
                    icon={User}
                    value=""
                    onChange={() => {}}
                    type="password"
                  />
                  <InputField
                    label="كلمة المرور الجديدة"
                    icon={User}
                    value=""
                    onChange={() => {}}
                    type="password"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
