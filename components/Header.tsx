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
  buttonText = "سفراء التطوع الصحي",
  breadcrumb 
}: HeaderProps) {
  return (
    <section className="relative py-20 sm:py-32 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Breadcrumb */}
          {breadcrumb && (
            <nav className="text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
              <ol className="flex items-center justify-center space-x-2">
                {breadcrumb.split('/').map((item, index) => (
                  <li key={index} className="flex items-center">
                    <span className={index === breadcrumb.split('/').length - 1 ? "text-gray-900 font-medium" : "text-gray-600"}>
                      {item.trim()}
                    </span>
                    {index < breadcrumb.split('/').length - 1 && (
                      <svg className="w-4 h-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Dynamic Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style={{ color: '#34bca3' }}>
            <span className="block">{title}</span>
          </h1>

          {/* Dynamic Description */}
          <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            {description}
          </p>

          {/* Dynamic Primary CTA Button */}
          {showButton && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group relative px-8 py-4 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <span className="relative z-10">{buttonText}</span>
                <div className="absolute inset-0 bg-yellow-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-200 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-emerald-300 rounded-full opacity-20 blur-xl"></div>
    </section>
  );
}
