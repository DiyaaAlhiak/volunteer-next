'use client';

import { useState, useEffect } from 'react';
import { Plus, User, Mail, Save, Loader2, X, FileText, Camera, Trash2 } from 'lucide-react';

export default function TrainersManagement() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({ 
    name: '', specialty: '', email: '', bio: '', image: '' 
  });

  useEffect(() => { fetchTrainers(); }, []);

  const fetchTrainers = async () => {
    try {
      // أضفنا التاريخ لمنع المتصفح من جلب نسخة قديمة مخزنة
      const res = await fetch(`/api/admin/trainers?t=${Date.now()}`, {
        cache: 'no-store'
      });
      const data = await res.json();
      if (data.success) setTrainers(data.trainers);
    } catch (error) { 
        console.error("Error fetching trainers:", error); 
    } finally { 
        setLoading(false); 
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const result = await res.json();
      if (result.success) {
        // المسار القادم من السيرفر هو /uploads/filename.jpg
        setFormData(prev => ({ ...prev, image: result.url }));
      }
    } catch (error) {
      alert("فشل رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/trainers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setShowModal(false);
        setFormData({ name: '', specialty: '', email: '', bio: '', image: '' });
        // انتظار بسيط للتأكد من كتابة الملف في السيرفر قبل إعادة الجلب
        setTimeout(() => fetchTrainers(), 500);
      }
    } catch (error) { 
        console.error("Error submitting trainer:", error); 
    } finally { 
        setIsSubmitting(false); 
    }
  };

  return (
    <div className="p-8 font-tajawal bg-[#fafafa] min-h-screen" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-slate-800">إدارة المدربين</h1>
          <p className="text-slate-500 mt-1">تعديل وإضافة بيانات الطاقم التدريبي</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 text-white px-8 py-4 rounded-2xl flex items-center gap-2 hover:bg-emerald-700 transition-all font-bold shadow-lg shadow-emerald-100"
        >
          <Plus size={24} /> إضافة مدرب
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainers.map((trainer: any) => (
            <div key={trainer.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <div className="h-24 bg-slate-100 group-hover:bg-emerald-50 transition-colors"></div>
              <div className="px-6 pb-8 text-center -mt-12">
                <div className="relative inline-block">
                  <img 
                    // نستخدم القيمة المخزنة أو صورة افتراضية
                    src={trainer.image || `https://ui-avatars.com/api/?name=${trainer.name}&background=random`} 
                    className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-md mx-auto bg-white"
                    alt={trainer.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${trainer.name}&background=random`;
                    }}
                  />
                </div>
                
                <h3 className="font-bold text-xl text-slate-800 mt-4">{trainer.name}</h3>
                <span className="text-emerald-600 text-sm font-bold bg-emerald-50 px-3 py-1 rounded-full mt-2 inline-block border border-emerald-100">
                  {trainer.specialty || 'مدرب'}
                </span>
                
                <p className="text-slate-500 text-sm mt-4 line-clamp-2 leading-relaxed h-10">
                  {trainer.bio || 'لا توجد نبذة تعريفية..'}
                </p>
                
                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-center gap-2 text-slate-400 text-xs">
                  <Mail size={14} className="text-emerald-500" /> 
                  <span className="truncate">{trainer.email || 'لا يوجد بريد'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/20">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-xl shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8 pb-4 border-b">
              <h2 className="text-2xl font-black text-slate-800">إضافة مدرب جديد</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={28} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* رفع الصورة */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group cursor-pointer">
                  <div className="w-28 h-28 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group-hover:border-emerald-400 transition-colors">
                    {formData.image ? (
                      <img src={formData.image} className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="text-slate-300 group-hover:text-emerald-400 transition-colors" size={40} />
                    )}
                    <input 
                      type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={handleImageUpload}
                    />
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-[2rem]">
                      <Loader2 className="animate-spin text-emerald-600" />
                    </div>
                  )}
                </div>
                <p className="text-xs font-bold text-slate-500 mt-3">انقر لتغيير الصورة الشخصية</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-sm font-bold text-slate-700 mr-2">الاسم الكامل *</label>
                  <input 
                    required className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 mr-2">التخصص</label>
                  <input 
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner"
                    value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 mr-2">البريد الإلكتروني</label>
                  <input 
                    type="email" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner"
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-sm font-bold text-slate-700 mr-2">النبذة التعريفية</label>
                  <textarea 
                    rows={3} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 resize-none transition-all shadow-inner"
                    value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit" disabled={isSubmitting || uploading}
                className="w-full bg-emerald-600 text-white py-4 rounded-[1.5rem] font-black text-lg shadow-lg hover:bg-emerald-700 disabled:bg-slate-300 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={22} />} حفظ بيانات المدرب
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}