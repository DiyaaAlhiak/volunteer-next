'use client';

import { useState, useEffect } from 'react';
import { 
  MessageSquare, Send, Clock, CheckCircle, AlertCircle, 
  Loader2, Plus, Search, Filter
} from 'lucide-react';

interface SupportTicket {
  id: number;
  subject: string;
  category: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  reply?: string;
  createdAt: string;
  updatedAt: string;
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    subject: '',
    category: 'technical',
    message: ''
  });

  const categories = [
    { value: 'technical', label: 'مشكلة تقنية' },
    { value: 'account', label: 'مشكلة حساب' },
    { value: 'course', label: 'استفسار عن دورة' },
    { value: 'certificate', label: 'مشكلة شهادة' },
    { value: 'general', label: 'استفسار عام' }
  ];

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/participant/support');
      const data = await response.json();
      
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.message.trim()) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await fetch('/api/participant/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        setFormData({ subject: '', category: 'technical', message: '' });
        fetchTickets();
        alert('تم إرسال تذكرة الدعم بنجاح');
      } else {
        alert(data.error || 'فشل في إرسال التذكرة');
      }
    } catch (error) {
      console.error('Error submitting ticket:', error);
      alert('حدث خطأ أثناء إرسال التذكرة');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { label: 'جديد', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: AlertCircle },
      in_progress: { label: 'قيد المعالجة', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock },
      resolved: { label: 'تم الحل', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    const Icon = config.icon;
    
    return (
      <span className={`px-3 py-1 text-xs font-bold rounded-full border flex items-center gap-1 w-fit ${config.color}`}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal" dir="rtl">
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">الدعم الفني</h1>
          <p className="text-gray-600">نحن هنا لمساعدتك في حل أي مشكلة أو الإجابة على استفساراتك</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Support Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <MessageSquare size={20} className="text-emerald-600" />
                </div>
                <h2 className="text-xl font-black text-gray-900">فتح تذكرة جديدة</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2">الموضوع *</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="اكتب موضوع مشكلتك هنا..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2">الفئة *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2">الرسالة *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="اشرح مشكلتك بالتفصيل..."
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-600 text-white font-black py-4 rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      إرسال التذكرة
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Tickets List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-gray-900">تذاكري السابقة</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{tickets.length}</span>
                  <span>تذكرة</span>
                </div>
              </div>

              {tickets.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">لا توجد تذاكر سابقة</h3>
                  <p className="text-gray-500">ابدأ بفتح تذكرة جديدة للتواصل مع فريق الدعم</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">{ticket.subject}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{categories.find(c => c.value === ticket.category)?.label}</span>
                            <span>{new Date(ticket.createdAt).toLocaleDateString('ar-SA')}</span>
                          </div>
                        </div>
                        {getStatusBadge(ticket.status)}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ticket.message}</p>
                      
                      {ticket.reply && (
                        <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                          <p className="text-xs font-bold text-emerald-700 mb-1">رد فريق الدعم:</p>
                          <p className="text-sm text-emerald-800">{ticket.reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
