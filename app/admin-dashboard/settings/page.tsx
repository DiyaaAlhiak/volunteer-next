'use client';

import { useState, useEffect } from 'react';
import { PrismaClient } from '@prisma/client';
import Header from '@/components/Header';

interface Settings {
  allow_team_registration: boolean;
  allow_member_registration: boolean;
}

export default function SystemSettings() {
  const [settings, setSettings] = useState<Settings>({
    allow_team_registration: true,
    allow_member_registration: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Settings) => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });

      const data = await response.json();

      if (data.success) {
        setSettings(newSettings);
        setMessage({
          type: 'success',
          text: 'تم تحديث الإعدادات بنجاح'
        });
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'فشل تحديث الإعدادات'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء تحديث الإعدادات'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (field: keyof Settings) => {
    updateSettings({
      ...settings,
      [field]: !settings[field]
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">

      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-100 border border-green-400 text-green-700' 
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <div className="space-y-8">
            <div className="border-b pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                إعدادات التسجيل
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      السماح بتسجيل الفرق
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      عند التفعيل، يمكن للمستخدمين تسجيل فرق جديدة في المنصة
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('allow_team_registration')}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                      settings.allow_team_registration
                        ? 'bg-emerald-600'
                        : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full transform transition-transform duration-200 ${
                        settings.allow_team_registration ? 'translate-x-6' : 'translate-x-1'
                      } bg-white`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      السماح بتسجيل الأفراد
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      عند التفعيل، يمكن للمستخدمين التسجيل كأفراد في المنصة
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('allow_member_registration')}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                      settings.allow_member_registration
                        ? 'bg-emerald-600'
                        : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full transform transition-transform duration-200 ${
                        settings.allow_member_registration ? 'translate-x-6' : 'translate-x-1'
                      } bg-white`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                معلومات النظام
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    حالة تسجيل الفرق
                  </h3>
                  <p className={`text-sm font-medium ${
                    settings.allow_team_registration ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {settings.allow_team_registration ? 'مفعل' : 'معطل'}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    حالة تسجيل الأفراد
                  </h3>
                  <p className={`text-sm font-medium ${
                    settings.allow_member_registration ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {settings.allow_member_registration ? 'مفعل' : 'معطل'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
