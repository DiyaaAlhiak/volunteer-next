import React from 'react';

export default function Footer() {
  const relatedLinks = [
    "وزارة الصحة",
    "منصة التطوع الصحي",
    "أنا متطوع",
    "نشرة بذل الالكترونية",
    "دليل تأسيس فريق سفراء التطوع الصحي"
  ];

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="container mx-auto px-4 py-12">
        {/* تم تغيير الـ Grid ليصبح 3 أعمدة في الشاشات الكبيرة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-start">
          
          {/* Section 1: Description Section */}
          <div className="text-right">
            <h3 className="text-2xl font-bold mb-6 text-emerald-400">
              البرنامج الوطني للمتطوعين
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed text-sm lg:text-base">
              يهدف سفراء التطوع الصحي ضمن دوره إلى تأسيس فرق تطوعية صحية متخصصة للتطوع في الكوارث والأزمات الصحية وبيان دورها في منظومة التطوع الصحي.
            </p>
            {/* Social Media Icons */}
            <div className="flex items-center space-x-reverse space-x-4">
              <a href="https://www.instagram.com/h_volunteering/" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white hover:bg-emerald-600 transition-all duration-300 group shadow-lg">
                <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/@h_volunteering" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white hover:bg-emerald-600 transition-all duration-300 group shadow-lg">
                <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="https://x.com/H_Volunteering" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white hover:bg-emerald-600 transition-all duration-300 group shadow-lg">
                <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Section 2: Related Links */}
          <div className="lg:text-center">
            <h3 className="text-xl font-bold mb-6 border-r-4 border-yellow-400 pr-4 lg:pr-0 lg:border-r-0">
              روابط ذات صلة
            </h3>
            <ul className="space-y-3">
              {relatedLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-yellow-400 hover:pr-2 transition-all duration-300 block lg:inline-block"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Left Logo Section (اللوجو الجديد) */}
          <div className="flex flex-col items-center lg:items-start justify-center lg:justify-start h-full">
            <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 backdrop-blur-sm">
              <img 
                src="https://pioneerseg.ddns.net:6901/assets/uploads/media-uploader/large-white-logo169797958811710454459.png" 
                alt="Logo" 
                className="h-32 w-auto object-contain"
              />
            </div>
            <p className="mt-4 text-xs text-gray-500 font-medium tracking-widest uppercase">
              Partner in Health Volunteering
            </p>
          </div>

        </div>
        
        {/* Bottom Section */}
        <div className="text-center border-t border-slate-800 mt-12 pt-8  md:flex-row items-center gap-4">
     
          <p className="text-gray-400 text-sm font-medium">
     <span className="text-emerald-400">سفراء التطوع</span>        © 2026 جميع الحقوق محفوظة بواسطة 
          </p>
        </div>
      </div>
    </footer>
  );
}