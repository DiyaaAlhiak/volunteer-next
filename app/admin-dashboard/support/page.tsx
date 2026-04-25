'use client';

import { useState, useEffect } from 'react';
import { 
  Search, MessageSquare, Reply, Trash2, X, Send, Loader2, 
  Clock, User, Mail, CheckCircle, AlertCircle, Filter
} from 'lucide-react';

interface SupportTicket {
  id: number;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  reply?: string;
  repliedBy?: string;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function SupportManagement() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'resolved'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [replyData, setReplyData] = useState({
    status: 'resolved' as 'new' | 'in_progress' | 'resolved',
    reply: '',
    repliedBy: 'Admin'
  });

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, searchTerm]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/admin/support?${params.toString()}`);
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

  const handleReply = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setReplyData({
      status: ticket.status === 'new' ? 'in_progress' : ticket.status,
      reply: ticket.reply || '',
      repliedBy: 'Admin'
    });
    setShowReplyModal(true);
  };

  const handleSubmitReply = async () => {
    if (!selectedTicket) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/support', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedTicket.id,
          status: replyData.status,
          reply: replyData.reply,
          repliedBy: replyData.repliedBy
        })
      });

      const data = await response.json();
      if (data.success) {
        setShowReplyModal(false);
        fetchTickets();
      } else {
        alert(data.error || 'Failed to update ticket');
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه التذكرة؟')) return;
    
    try {
      const response = await fetch(`/api/admin/support?id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setTickets(tickets.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { label: 'جديد', color: 'bg-amber-100 text-amber-700 border-amber-200' },
      in_progress: { label: 'قيد المعالجة', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      resolved: { label: 'تم الحل', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    return (
      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.senderEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal" dir="rtl">
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-2xl font-black text-gray-900">إدارة تذاكر الدعم</h2>
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="بحث عن تذكرة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="all">كل الحالات</option>
                <option value="new">جديد</option>
                <option value="in_progress">قيد المعالجة</option>
                <option value="resolved">تم الحل</option>
              </select>
            </div>
          </div>

          {/* Tickets Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-4 px-4 text-sm font-black text-gray-700">المرسل</th>
                  <th className="text-right py-4 px-4 text-sm font-black text-gray-700">الموضوع</th>
                  <th className="text-right py-4 px-4 text-sm font-black text-gray-700">الحالة</th>
                  <th className="text-right py-4 px-4 text-sm font-black text-gray-700">التاريخ</th>
                  <th className="text-right py-4 px-4 text-sm font-black text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{ticket.senderName}</div>
                        <div className="text-sm text-gray-500">{ticket.senderEmail}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900 max-w-xs truncate">{ticket.subject}</div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-500">
                        {new Date(ticket.createdAt).toLocaleDateString('ar-SA')}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReply(ticket)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="رد"
                        >
                          <Reply size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(ticket.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredTickets.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">لا توجد تذاكر دعم حالياً</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Reply Modal */}
      {showReplyModal && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-md" onClick={() => setShowReplyModal(false)} />
          
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in duration-300">
            <div className="flex justify-between items-center p-8 border-b border-gray-50">
              <h3 className="text-xl font-black text-gray-900">رد على تذكرة الدعم</h3>
              <button onClick={() => setShowReplyModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X />
              </button>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto">
              {/* Ticket Info */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-black text-gray-700">المرسل</label>
                    <div className="flex items-center gap-2 mt-1">
                      <User size={16} className="text-gray-400" />
                      <span className="text-sm font-medium">{selectedTicket.senderName}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-700">البريد الإلكتروني</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-sm font-medium">{selectedTicket.senderEmail}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-gray-700">الموضوع</label>
                  <p className="text-sm font-medium mt-1">{selectedTicket.subject}</p>
                </div>
                <div className="mt-4">
                  <label className="text-xs font-black text-gray-700">الرسالة الأصلية</label>
                  <p className="text-sm text-gray-600 mt-1 bg-white p-4 rounded-xl border border-gray-100">
                    {selectedTicket.message}
                  </p>
                </div>
              </div>

              {/* Reply Form */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-gray-700">تحديث الحالة</label>
                  <select
                    value={replyData.status}
                    onChange={(e) => setReplyData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none mt-2"
                  >
                    <option value="new">جديد</option>
                    <option value="in_progress">قيد المعالجة</option>
                    <option value="resolved">تم الحل</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-gray-700">الرد</label>
                  <textarea
                    value={replyData.reply}
                    onChange={(e) => setReplyData(prev => ({ ...prev, reply: e.target.value }))}
                    rows={6}
                    placeholder="اكتب ردك هنا..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none mt-2"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-100">
                <button
                  onClick={handleSubmitReply}
                  disabled={isSubmitting}
                  className="flex-1 bg-emerald-600 text-white font-black py-4 rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                  إرسال الرد
                </button>
                <button 
                  onClick={() => setShowReplyModal(false)} 
                  className="px-8 bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
