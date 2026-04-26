'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Upload, Award, Settings, Eye, Trash2, Loader2, Image as ImageIcon, FileText, X
} from 'lucide-react';
import { 
  uploadTemplateAction, 
  activateTemplateAction, 
  deleteTemplateAction, 
  updateTemplateSettings 
} from '@/app/admin-dashboard/certificates/action';

interface CertificateTemplate {
  id: string;
  name: string;
  filePath: string;
  isActive: boolean;
  createdAt: Date;
}

export default function CertificatesManagement({ initialTemplates }: { initialTemplates: any[] }) {
  const [templates, setTemplates] = useState<CertificateTemplate[]>(initialTemplates || []);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settings, setSettings] = useState({ fontSize: 24, color: '#000000' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // تحديث القائمة عند إعادة تحميل الصفحة
  useEffect(() => {
    setTemplates(initialTemplates);
  }, [initialTemplates]);

  const activeTemplate = templates.find(t => t.isActive);

  const sampleData = {
    studentName: 'اسم المتطوع يظهر هنا',
    courseTitle: 'دورة تطوير الويب المتكاملة',
  };

  const handleFiles = async (files: FileList) => {
    const file = files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const result = await uploadTemplateAction(formData);
    if (result.success) {
      alert("تم رفع القالب بنجاح! قم بتنشيطه الآن ليظهر في المعاينة.");
      window.location.reload(); 
    } else {
      alert("حدث خطأ أثناء الرفع: " + result.error);
    }
    setUploading(false);
  };

  const handleActivate = async (id: string) => {
    const result = await activateTemplateAction(id);
    if (result.success) window.location.reload();
  };

  const handleDelete = async (template: CertificateTemplate) => {
    if (confirm('هل أنت متأكد من حذف هذا القالب؟')) {
      await deleteTemplateAction(template.id, template.filePath);
      window.location.reload();
    }
  };

  const handleSaveSettings = async () => {
    if (!activeTemplate) return alert("يرجى تنشيط قالب أولاً");
    const result = await updateTemplateSettings(activeTemplate.id, settings);
    if (result.success) {
      alert("تم حفظ إعدادات الخط بنجاح");
      setShowSettingsModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal" dir="rtl">
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><Award size={24} /></div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">إدارة الشهادات</h1>
                <p className="text-sm text-gray-500">ارفع قالبك وتحكم في موضع الخطوط</p>
              </div>
            </div>
            <button onClick={() => setShowSettingsModal(true)} className="flex items-center px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-bold shadow-lg shadow-emerald-100">
              <Settings className="w-5 h-5 ml-2" /> إعدادات الخط
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* يمين: الرفع والقائمة */}
            <div className="space-y-6">
              <div
                className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400'}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input ref={fileInputRef} type="file" onChange={(e) => handleFiles(e.target.files!)} className="hidden" accept="image/*" />
                {uploading ? (
                  <div className="flex flex-col items-center gap-2"><Loader2 className="w-10 h-10 text-emerald-600 animate-spin" /><p className="text-emerald-600 font-bold">جاري الرفع...</p></div>
                ) : (
                  <><Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" /><p className="font-bold text-gray-700">اسحب صورة القالب هنا</p></>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 px-1"><FileText className="w-4 h-4 text-emerald-600" /> القوالب المتاحة</h3>
                {templates.map((t) => (
                  <div key={t.id} className={`p-4 rounded-2xl border flex items-center justify-between ${t.isActive ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${t.isActive ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}><ImageIcon size={20} /></div>
                      <div>
                        <p className="font-bold text-sm text-gray-800">{t.name}</p>
                        <p className="text-[10px] text-gray-400">{new Date(t.createdAt).toLocaleDateString('ar-SA')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleActivate(t.id)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${t.isActive ? 'bg-emerald-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        {t.isActive ? 'نشط' : 'تنشيط'}
                      </button>
                      <button onClick={() => handleDelete(t)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* يسار: المعاينة الحقيقية */}
            <div className="space-y-4">
               <h3 className="font-bold text-gray-800 flex items-center gap-2 justify-center px-1"><Eye className="w-4 h-4 text-emerald-600" /> معاينة مباشرة (قالبك الحقيقي)</h3>
               <div className="bg-gray-200 rounded-[2.5rem] p-6 border-4 border-white shadow-inner flex flex-col items-center justify-center min-h-[450px] relative overflow-hidden">
                  {activeTemplate ? (
                    <div 
                      className="w-full aspect-[1.4/1] rounded-lg shadow-2xl relative flex flex-col items-center justify-center text-center bg-cover bg-center transition-all duration-500"
                      style={{ backgroundImage: `url(${activeTemplate.filePath})` }}
                    >
                      {/* نصوص المعاينة فوق الصورة المرفوعة */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                        <p 
                          className="font-black drop-shadow-sm" 
                          style={{ color: settings.color, fontSize: `${settings.fontSize}px` }}
                        >
                          {sampleData.studentName}
                        </p>
                        <p className="text-gray-700 font-bold text-sm mt-2 opacity-80">{sampleData.courseTitle}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-bold">ارفع قالباً وقم بتنشيطه ليظهر هنا</p>
                    </div>
                  )}
               </div>
               <p className="text-center text-[10px] text-gray-400 italic">ملاحظة: تأكد أن الصورة المرفوعة ذات جودة عالية للحصول على أفضل نتيجة.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Settings */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-white/20">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-2xl text-gray-900">تنسيق نصوص الشهادة</h3>
              <button onClick={() => setShowSettingsModal(false)} className="p-2 bg-gray-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-all"><X size={20} /></button>
            </div>
            <div className="space-y-8">
              <div className="bg-gray-50 p-4 rounded-2xl">
                <label className="block text-sm font-bold text-gray-700 mb-4 text-center">لون خط اسم المتطوع</label>
                <input type="color" value={settings.color} onChange={(e) => setSettings({...settings, color: e.target.value})} className="w-full h-14 rounded-xl cursor-pointer border-4 border-white shadow-sm" />
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl">
                <label className="block text-sm font-bold text-gray-700 mb-4 text-center">حجم الخط ({settings.fontSize}px)</label>
                <input type="range" min="12" max="60" value={settings.fontSize} onChange={(e) => setSettings({...settings, fontSize: parseInt(e.target.value)})} className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
              </div>
              <button onClick={handleSaveSettings} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all transform active:scale-95">حفظ الإعدادات</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}