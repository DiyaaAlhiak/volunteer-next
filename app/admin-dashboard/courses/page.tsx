'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Search, BookOpen, X, Star, 
  Clock, Tag, Video, AlignRight, Save, Loader2, User, Image as ImageIcon 
} from 'lucide-react';

interface Trainer {
  id: string;
  name: string;
  specialty?: string; // أضفت التخصص اختيارياً للعرض
}

interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  volunteerHours: number;
  instructorName: string;
  imageUrl?: string;
  trainerId?: string;
  videoUrl?: string;
  description?: string;
  is_required: boolean;
  is_featured: boolean;
  status?: string;
  created_at: Date;
  updated_at: Date;
  trainer?: Trainer;
}

export default function CoursesManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]); // سيتم استخدامه الآن
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    duration: '',
    volunteerHours: '0',
    instructorName: '',
    imageUrl: '',
    videoUrl: '',
    description: '',
    is_required: false,
    is_featured: false,
    status: 'active'
  });

  const categories = [
    'أساسيات الرعاية الصحية', 'الإسعافات الأولية', 'الاستجابة للطوارئ', 'صحة المجتمع',
    'الصحة النفسية', 'التغذية', 'الوقاية من الأمراض', 'الصحة العامة', 'تدريب المتطوعين', 'أخرى'
  ];

  useEffect(() => {
    fetchCourses();
    fetchTrainers();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/admin/courses');
      const data = await response.json();
      if (data.success) setCourses(data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainers = async () => {
    try {
      const response = await fetch('/api/admin/trainers');
      const data = await response.json();
      if (data.success) setTrainers(data.trainers);
    } catch (error) {
      console.error('Error fetching trainers:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      duration: '',
      volunteerHours: '0',
      instructorName: '',
      imageUrl: '',
      videoUrl: '',
      description: '',
      is_required: false,
      is_featured: false,
      status: 'active'
    });
    setEditingCourse(null);
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const url = '/api/admin/courses';
      const method = editingCourse ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: editingCourse?.id,
          volunteerHours: parseInt(formData.volunteerHours) || 0
        }),
      });

      const data = await response.json();
      if (data.success) {
        resetForm();
        fetchCourses();
      } else {
        alert(data.error || 'حدث خطأ في العملية');
      }
    } catch (error) {
      console.error("Submit Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      category: course.category || '',
      duration: course.duration || '',
      volunteerHours: course.volunteerHours?.toString() || '0',
      instructorName: course.instructorName || '',
      imageUrl: course.imageUrl || '',
      videoUrl: course.videoUrl || '',
      description: course.description || '',
      is_required: !!course.is_required,
      is_featured: !!course.is_featured,
      status: course.status || 'active'
    });
    setShowModal(true);
  };

  const confirmDelete = (id: string) => {
    setCourseToDelete(id);
    setShowDeleteModal(true);
  };

  const handleFinalDelete = async () => {
    if (!courseToDelete) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/courses?id=${courseToDelete}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setCourses(courses.filter(c => c.id !== courseToDelete));
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal" dir="rtl">
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-2xl font-black text-gray-900">إدارة الدورات التدريبية</h2>
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="بحث عن دورة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-bold shadow-lg shadow-emerald-100"
              >
                <Plus className="w-5 h-5 ml-2" /> إضافة دورة
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-xl hover:border-emerald-100 transition-all">
                <div className="flex justify-between items-start mb-4">
                  {course.imageUrl ? (
                     <img src={course.imageUrl} className="w-12 h-12 rounded-xl object-cover" alt={course.title} />
                  ) : (
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <BookOpen size={24} />
                    </div>
                  )}
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(course)} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"><Edit size={18} /></button>
                    <button onClick={() => confirmDelete(course.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{course.title}</h3>
                <div className="flex items-center text-xs text-emerald-600 mb-2">
                  <User size={12} className="ml-1"/> {course.instructorName || 'لم يحدد مدرب'}
                </div>
                <p className="text-xs text-gray-500 mb-4">{course.category}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${course.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
                    {course.status === 'active' ? 'منشور' : 'مسودة'}
                  </span>
                  <div className="flex items-center text-gray-400 text-xs gap-3">
                    <div className="flex items-center gap-1"><Clock size={14} /> {course.duration}</div>
                    <div className="flex items-center gap-1 text-emerald-600 font-bold"><Star size={14} /> {course.volunteerHours} ساعة</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-md" onClick={resetForm} />

          <div className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in duration-300">
            <div className="flex justify-between items-center p-8 border-b border-gray-50">
              <h3 className="text-xl font-black text-gray-900">{editingCourse ? 'تعديل الدورة' : 'إضافة دورة جديدة'}</h3>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><X /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto text-right">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-gray-700">اسم الدورة *</label>
                  <input
                    name="title" type="text" required value={formData.title} onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                {/* تم تعديل هذا الجزء ليصبح قائمة منسدلة بدلاً من input */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-700">اسم المدرب</label>
                  <select
                    name="instructorName" 
                    value={formData.instructorName} 
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="">اختر المدرب</option>
                    {trainers.map((trainer) => (
                      <option key={trainer.id} value={trainer.name}>
                        {trainer.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-700">ساعات التطوع</label>
                  <input
                    name="volunteerHours" type="number" value={formData.volunteerHours} onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-700">مدة الدورة *</label>
                  <input
                    name="duration" type="text" required value={formData.duration} onChange={handleChange}
                    placeholder="مثال: 4 ساعات"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-700">التصنيف *</label>
                  <select
                    name="category" required value={formData.category} onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="">اختر التصنيف</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-gray-700 flex items-center gap-2 justify-end">رابط صورة الدورة <ImageIcon size={14}/></label>
                  <input
                    name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none ltr"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-emerald-700 flex items-center gap-2 justify-end">رابط فيديو اليوتيوب * <Video size={14}/></label>
                  <input
                    name="videoUrl" type="url" required value={formData.videoUrl} onChange={handleChange}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none ltr"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-gray-700">وصف الدورة</label>
                  <textarea
                    name="description" rows={3} value={formData.description} onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-100">
                <button
                  type="submit" disabled={isSubmitting}
                  className="flex-1 bg-emerald-600 text-white font-black py-4 rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                  {editingCourse ? 'حفظ التعديلات' : 'نشر الدورة'}
                </button>
                <button type="button" onClick={resetForm} className="px-8 bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال الحذف */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-sm w-full p-8 text-center animate-in zoom-in">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
              <Trash2 size={40} />
            </div>
            <h3 className="text-xl font-black mb-2">حذف الدورة؟</h3>
            <p className="text-gray-500 text-sm mb-8">هل أنت متأكد؟ سيتم حذف كافة سجلات التسجيل المرتبطة بها.</p>
            <div className="flex gap-3">
              <button onClick={handleFinalDelete} className="flex-1 bg-red-500 text-white font-bold py-4 rounded-2xl hover:bg-red-600">
                {isSubmitting ? "جاري الحذف..." : "نعم، حذف"}
              </button>
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl">تراجع</button>
            </div>
          </div>
        </div>
      )}
    </div>
  ); 
}