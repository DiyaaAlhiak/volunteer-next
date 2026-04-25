'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, 
  Video, 
  AlignRight, 
  Type, 
  Clock, 
  User, 
  Layers,
  Save,
  Loader2
} from 'lucide-react';

export default function AddCourseModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    duration: '',
    instructor: '',
    instructorName: '',
    durationHours: '',
    image: '',
    status: 'active',
    description: '',
    videoUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('فشل في إضافة الدورة');
      
      onClose();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* الخلفية الشفافة (Glassmorphism Overlay) */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* نافذة المودال */}
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 font-tajawal" dir="rtl">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
          <div>
            <h1 className="text-xl font-black text-slate-900">إضافة دورة جديدة</h1>
            <p className="text-xs text-slate-500 mt-1">أدخل بيانات الدورة والمحتوى التعليمي</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-2">
              <X size={16} /> {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* اسم الدورة */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 flex items-center gap-2">
                <Type size={14} className="text-emerald-500" /> اسم الدورة *
              </label>
              <input
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="مثال: أساسيات الإسعافات الأولية aaaa"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
              />
            </div>



            {/* التصنيف */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 flex items-center gap-2">
                <Layers size={14} className="text-emerald-500" /> التصنيف *
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm appearance-none"
              >
                <option value="">اختر التصنيف</option>
                <option value="first-aid">الإسعافات الأولية</option>
                <option value="psychology">الصحة النفسية</option>
                <option value="volunteering">تدريب المتطوعين</option>
              </select>
            </div>

            {/* المدرب المسؤول */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 flex items-center gap-2">
                <User size={14} className="text-emerald-500" /> اسم المدرب *
              </label>
              <input
                name="instructorName"
                value={formData.instructorName}
                onChange={handleChange}
                placeholder="اسم الدكتور أو المدرب"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
            </div>

            {/* مدة الدورة */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 flex items-center gap-2">
                <Clock size={14} className="text-emerald-500" /> مدة الدورة *
              </label>
              <input
                name="duration"
                required
                value={formData.duration}
                onChange={handleChange}
                placeholder="مثال: 4 ساعات"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
            </div>

            {/* عدد الساعات التطوعية */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 flex items-center gap-2">
                <Clock size={14} className="text-emerald-500" /> عدد الساعات التطوعية *
              </label>
              <input
                type="number"
                name="durationHours"
                required
                value={formData.durationHours}
                onChange={handleChange}
                placeholder="مثال: 8"
                min="1"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
            </div>

            {/* رابط الفيديو */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black text-slate-700 flex items-center gap-2">
                <Video size={14} className="text-emerald-500" />  الفيديو (YouTube Embed) *
              </label>
              <input
                type="url"
                name="videoUrl"
                required
                value={formData.videoUrl}
                onChange={handleChange}
                placeholder="https://www.youtube.com/embed/..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm ltr"
              />
            </div>

            {/* صورة الغلاف */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black text-slate-700 flex items-center gap-2">
                <Video size={14} className="text-emerald-500" /> صورة الغلاف *
              </label>
              <input
                type="url"
                name="image"
                required
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/course-cover.jpg"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm ltr"
              />
            </div>

            {/* الوصف */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black text-slate-700 flex items-center gap-2">
                <AlignRight size={14} className="text-emerald-500" /> وصف الدورة
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="اكتب نبذة عن محتوى الدورة..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm resize-none"
              />
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-sm font-black text-slate-500 hover:bg-slate-100 transition-all"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-sm font-black shadow-lg shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
            حفظ ونشر الدورة 
          </button>
        </div>
      </div>
    </div>
  );
}