'use client';
import { useState } from 'react';
import { registerTeamAction } from '@/app/register/team/actions';

// بيانات تجريبية للمناطق والمدن (يمكنك توسيعها)
const locationData: { [key: string]: string[] } = {
  "الرياض": ["الرياض", "الخرج", "المجمعة", "الدوادمي"],
  "مكة المكرمة": ["مكة", "جدة", "الطائف", "القنفذة"],
  "المنطقة الشرقية": ["الدمام", "الخبر", "الأحساء", "الجبيل"],
  "المدينة المنورة": ["المدينة المنورة", "ينبع", "العلا"]
};

export default function TeamRegistrationForm() {
  const [selectedRegion, setSelectedRegion] = useState("");

  return (
    <form action={registerTeamAction} className="space-y-6 text-right" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* اسم الفريق وقائد الفريق */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2 text-gray-300">اسم الفريق *</label>
          <input type="text" name="name" className="w-full bg-[#0f172b] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-green-500" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">اسم قائد الفريق *</label>
          <input type="text" name="leader_name" className="w-full bg-[#0f172b] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-green-500" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">البريد الإلكتروني *</label>
          <input type="email" name="email" className="w-full bg-[#0f172b] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-green-500" required />
        </div>

        {/* المنطقة (Select) */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">المنطقة *</label>
          <select 
            name="region" 
            className="w-full bg-[#0f172b] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-green-500"
            required
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">-- اختر المنطقة --</option>
            {Object.keys(locationData).map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* المدينة (Select مرتبطة بالمنطقة) */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">المدينة *</label>
          <select 
            name="city" 
            className="w-full bg-[#0f172b] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-green-500 disabled:opacity-50"
            required
            disabled={!selectedRegion}
          >
            <option value="">-- اختر المدينة --</option>
            {selectedRegion && locationData[selectedRegion].map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* بقية الحقول */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">رقم الجوال *</label>
          <input type="tel" name="phone" className="w-full bg-[#0f172b] border border-gray-700 rounded-lg p-3 text-white outline-none" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">رقم الهوية *</label>
          <input type="text" name="nationalId" className="w-full bg-[#0f172b] border border-gray-700 rounded-lg p-3 text-white outline-none" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">المهنة</label>
          <input type="text" name="job" className="w-full bg-[#0f172b] border border-gray-700 rounded-lg p-3 text-white outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">الجهة التابع لها</label>
          <input type="text" name="organization" className="w-full bg-[#0f172b] border border-gray-700 rounded-lg p-3 text-white outline-none" />
        </div>

<div className="md:col-span-2">
  <label className="block text-sm font-medium mb-2 text-gray-300">المرفقات (صورة أو PDF)</label>
  <input 
    type="file" 
    name="attachments" 
    accept=".jpg,.jpeg,.png,.pdf"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file && file.size > 10 * 1024 * 1024) { // 10MB
        alert("الملف كبير جداً! الحد الأقصى هو 10 ميجابايت.");
        e.target.value = ""; // تفريغ الحقل
      }
    }}
    className="w-full bg-[#0f172b] border border-gray-700 rounded-lg p-2 text-gray-400 file:ml-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-700 file:text-white"
  />
</div>

        {/* كلمة المرور */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">كلمة المرور *</label>
          <input type="password" name="password" className="w-full bg-[#0f172b] border border-gray-700 rounded-lg p-3 text-white outline-none" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">تأكيد كلمة المرور *</label>
          <input type="password" name="confirm_password" className="w-full bg-[#0f172b] border border-gray-700 rounded-lg p-3 text-white outline-none" required />
        </div>
      </div>




      <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all mt-6">
        تسجيل الفريق
      </button>
    </form>
  );
}