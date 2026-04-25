'use client';

import { usePathname } from 'next/navigation';

interface DashboardHeaderProps {
  title: string;
}

export default function DashboardHeader({ title }: DashboardHeaderProps) {
  const pathname = usePathname();
  
  const getNavigationPath = () => {
    if (pathname === '/dashboard') {
      return 'الرئيسية';
    }
    return 'الرئيسية / لوحة التحكم';
  };

  return (
    <div className="relative h-64 bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden min-h-[16rem]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/api/placeholder-image)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-right">
          <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
          <div className="text-white text-sm">
            <span>{getNavigationPath()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
