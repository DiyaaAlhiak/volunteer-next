'use client';
import { useState } from 'react';
import { registerMemberAction } from '@/app/register/member/actions';

interface Team {
  id: number;
  name: string;
}

const locationData: { [key: string]: string[] } = {
  "الرياض": ["الرياض", "الخرج", "المجمعة"],
  "مكة المكرمة": ["مكة", "جدة", "الطائف"],
  "المنطقة الشرقية": ["الدمام", "الخبر", "الأحساء"],
  "المدينة المنورة": ["المدينة المنورة", "ينبع"]
};

// قمنا بتسمية البروبس هنا باسم acceptedTeams لتطابق ما ترسله من الصفحة
export default function MemberRegistrationForm({ 
  acceptedTeams = [], 
  isMemberRegistrationEnabled 
}: { 
  acceptedTeams: Team[], 
  isMemberRegistrationEnabled: boolean 
}) {
  const [selectedRegion, setSelectedRegion] = useState("");

  return (
    <form action={registerMemberAction} className="space-y-6 text-right" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#161f35] p-8 rounded-2xl border border-gray-800 shadow-2xl">
        
        {/* اختيار الفريق */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2 text-green-400 font-bold">الفريق الذي تود الانضمام إليه *</label>
          <select 
            name="teamId" 
            className="w-full bg-[#0f172b] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-green-500" 
            required
          >
            <option value="">-- اختر الفريق من القائمة --</option>
            {/* التأكد من استخدام acceptedTeams هنا */}
            {acceptedTeams && acceptedTeams.length > 0 ? (
              acceptedTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))
            ) : (
              <option disabled>لا توجد فرق متاحة حالياً</option>
            )}
          </select>
        </div>

        {/* الاسم واسم المستخدم */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">الاسم الكامل *</label>
          <input type="text" name="name" className="w-full bg-[#0f172b] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-green-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">اسم المستخدم *</label>
          <input type="text" name="username" className="w-full bg-[#0f172b] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-green-500" required />
        </div>

        {/* البريد والجوال */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">البريد الإلكتروني *</label>
          <input type="email" name="email" className="w-full bg-[#0f172b] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-green-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">رقم الجوال *</label>
          <input type="tel" name="phone" className="w-full bg-[#0f172b] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-green-500" required />
        </div>

        {/* المنطقة والمدينة */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">المنطقة *</label>
          <select name="region" className="w-full bg-[#0f172b] border border-gray-700 rounded-lg p-3 text-white" required onChange={(e) => setSelectedRegion(e.target.value)}>
            <option value="">-- اختر المنطقة --</option>
            {Object.keys(locationData).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">المدينة *</label>
          <select name="city" className="w-full bg-[#0f172b] border border-gray-700 rounded-lg p-3 text-white disabled:opacity-50" required disabled={!selectedRegion}>
            <option value="">-- اختر المدينة --</option>
            {selectedRegion && locationData[selectedRegion].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* الهوية والمهنة */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">رقم الهوية *</label>
          <input type="text" name="nationalId" className="w-full bg-[#0f172b] border border-gray-700 rounded-lg p-3 text-white outline-none" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">المهنة</label>
          <input type="text" name="jobTitle" className="w-full bg-[#0f172b] border border-gray-700 rounded-lg p-3 text-white outline-none" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2 text-gray-300">الجهة التابع لها</label>
          <input type="text" name="organization" className="w-full bg-[#0f172b] border border-gray-700 rounded-lg p-3 text-white outline-none" />
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

      <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-5 rounded-2xl transition-all shadow-lg shadow-green-900/20 text-lg">
        إرسال طلب الانضمام
      </button>
    </form>
  );
}