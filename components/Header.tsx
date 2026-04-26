import React from 'react';

interface HeaderProps {
  title: string;
  description?: string;
  showButton?: boolean;
  buttonText?: string;
  breadcrumb?: string;
}

export default function Header({ 
  title, 
  description = "",
  showButton = true,
 
  breadcrumb 
}: HeaderProps) {
  return (
    <section 
      className="relative py-24 sm:py-36 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ 
        // هنا السر: تدرج أسود شفاف بنسبة 60% ليُظهر الصورة ويبرز النص الأبيض
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.65)), url('https://pioneerseg.ddns.net:6901/assets/uploads/media-uploader/rectangle-271687473631.png')` 
      }}
    >
      {/* تأثير بلور (Blur) خفيف جداً على الخلفية لزيادة العمق */}
      <div className="absolute inset-0 backdrop-blur-[1px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          
          {/* Breadcrumb بتصميم فاتح */}
          {breadcrumb && (
            <nav className="mb-8" aria-label="Breadcrumb">
              <ol className="flex items-center justify-center space-x-reverse space-x-2 text-sm">
                {breadcrumb.split('/').map((item, index) => (
                  <li key={index} className="flex items-center">
                    <span className={index === breadcrumb.split('/').length - 1 ? "text-yellow-400 font-bold" : "text-gray-300"}>
                      {item.trim()}
                    </span>
                    {index < breadcrumb.split('/').length - 1 && (
                      <svg className="w-4 h-4 mx-2 text-gray-500 transform rotate-180" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* العنوان بلون أبيض ناصع مع ظل خفيف لزيادة الوضوح */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-8 leading-tight text-white drop-shadow-lg">
            {title}
          </h1>

          {/* الوصف بلون رمادي فاتح جداً */}
   <p className="text-base sm:text-lg text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md opacity-90">
  {description}
</p>

<div/>
        </div>
      </div>

      {/* لمسة إضاءة علوية تجعل الصورة تبدو كأنها تحت ضوء مسرح */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </section>
  );
}