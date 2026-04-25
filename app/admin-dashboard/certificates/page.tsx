'use client';

import { useState, useRef } from 'react';
import { 
  Upload, 
  FileCheck, 
  Award, 
  Download, 
  Settings, 
  Eye, 
  Trash2, 
  Plus,
  X,
  Save,
  Loader2,
  Image,
  FileText
} from 'lucide-react';

interface CertificateTemplate {
  id: string;
  name: string;
  fileName: string;
  uploadDate: Date;
  fileSize: number;
  isActive: boolean;
  previewUrl?: string;
}

export default function CertificatesManagement() {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([
    {
      id: '1',
      name: 'قالب الشهادة الأساسي',
      fileName: 'basic-certificate-template.pdf',
      uploadDate: new Date('2024-01-15'),
      fileSize: 245760,
      isActive: true
    },
    {
      id: '2', 
      name: 'قالب الشهادة المتقدم',
      fileName: 'advanced-certificate-template.pdf',
      uploadDate: new Date('2024-02-20'),
      fileSize: 312320,
      isActive: false
    }
  ]);
  
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CertificateTemplate | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleCertificateData = {
    studentName: '[اسم الطالب]',
    courseTitle: '[عنوان الدورة]',
    completionDate: '[تاريخ الإنجاز]',
    instructorName: '[اسم المدرب]',
    hours: '[عدد الساعات]',
    certificateId: '[رقم الشهادة]'
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    const file = files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('يرجى رفع ملف PDF أو صورة (PNG, JPG, JPEG)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('حجم الملف يجب أن لا يتجاوز 10 ميجابايت');
      return;
    }

    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const newTemplate: CertificateTemplate = {
        id: Date.now().toString(),
        name: file.name.replace(/\.[^/.]+$/, ""),
        fileName: file.name,
        uploadDate: new Date(),
        fileSize: file.size,
        isActive: false
      };
      
      setTemplates(prev => [...prev, newTemplate]);
      setUploading(false);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 2000);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setTemplates(prev => prev.map(template => ({
      ...template,
      isActive: template.id === id ? !template.isActive : template.isActive
    })));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal" dir="rtl">
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Award size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">إعدادات الشهادات</h1>
                <p className="text-sm text-gray-500">إدارة قوالب الشهادات وإعداداتها</p>
              </div>
            </div>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-bold"
            >
              <Settings className="w-5 h-5 ml-2" />
              الإعدادات
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-emerald-600" />
                  رفع قالب الشهادة
                </h2>
                
                {/* Drag & Drop Zone */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                    isDragging 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {uploading ? (
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
                      <p className="text-gray-600 font-medium">جاري الرفع...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div>
                        <Upload className="w-12 h-12 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium">اسحب وأفلت ملف القالب هنا</p>
                        <p className="text-sm text-gray-500 mt-1">أو انقر للاختيار</p>
                      </div>
                      <div className="text-xs text-gray-400">
                        صيغ مدعومة: PDF, PNG, JPG, JPEG (حتى 10 ميجابايت)
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Templates List */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">القوالب المحفوظة</h3>
                <div className="space-y-3">
                    {templates.map((template, index) => (
                      <div
                        key={template.id}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                          template.isActive 
                            ? 'border-emerald-200 bg-emerald-50' 
                            : 'border-gray-200 bg-white hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            template.isActive ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {template.fileName.endsWith('.pdf') ? (
                              <FileText size={20} />
                            ) : (
                              <Image size={20} />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{template.name}</p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(template.fileSize)} • {formatDate(template.uploadDate)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleActive(template.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                              template.isActive
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {template.isActive ? 'نشط' : 'غير نشط'}
                          </button>
                          
                          <button
                            onClick={() => {
                              setSelectedTemplate(template);
                              setShowPreview(true);
                            }}
                            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          >
                            <Eye size={16} />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-emerald-600" />
                  معاينة الشهادة
                </h2>
                
                <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8 border border-emerald-100">
                  {/* Certificate Preview */}
                  <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="border-4 border-double border-emerald-600 rounded-lg p-6">
                      {/* Certificate Header */}
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-emerald-800 mb-2">شهادة إنجاز</h3>
                        <div className="w-24 h-1 bg-emerald-600 mx-auto"></div>
                      </div>

                      {/* Certificate Body */}
                      <div className="space-y-4 mb-6">
                        <p className="text-gray-600">تمنح هذه الشهادة لـ:</p>
                        <div className="bg-gray-100 rounded-lg py-3 px-4">
                          <p className="text-xl font-bold text-gray-800">{sampleCertificateData.studentName}</p>
                        </div>
                        
                        <p className="text-gray-600">لإكماله بنجاح دورة:</p>
                        <div className="bg-gray-100 rounded-lg py-3 px-4">
                          <p className="text-lg font-semibold text-gray-800">{sampleCertificateData.courseTitle}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-gray-50 rounded-lg p-2">
                            <p className="text-gray-500 text-xs">تاريخ الإنجاز</p>
                            <p className="font-medium">{sampleCertificateData.completionDate}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2">
                            <p className="text-gray-500 text-xs">عدد الساعات</p>
                            <p className="font-medium">{sampleCertificateData.hours}</p>
                          </div>
                        </div>
                      </div>

                      {/* Certificate Footer */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <div className="text-center">
                            <div className="w-32 h-0.5 bg-gray-400 mb-2"></div>
                            <p className="text-xs text-gray-600">{sampleCertificateData.instructorName}</p>
                            <p className="text-xs text-gray-500">مدرب الدورة</p>
                          </div>
                          <div className="text-center">
                            <div className="w-32 h-0.5 bg-gray-400 mb-2"></div>
                            <p className="text-xs text-gray-600">رقم الشهادة</p>
                            <p className="text-xs font-mono">{sampleCertificateData.certificateId}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags Info */}
                  <div className="mt-6 p-4 bg-white rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">الوسوم المتاحة:</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(sampleCertificateData).map(([key, value]) => (
                        <span key={key} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
