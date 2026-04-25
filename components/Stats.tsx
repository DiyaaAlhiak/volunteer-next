import React from 'react';

export default function Stats() {
  return (
    <section className="py-12" style={{ backgroundColor: '#34bca3' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="text-white">
            <div className="text-4xl md:text-5xl font-bold mb-2">
              0
            </div>
            <div className="text-lg md:text-xl">
            اعضاء الفرق
            </div>
          </div>
          
          <div className="text-white">
            <div className="text-4xl md:text-5xl font-bold mb-2">
              0
            </div>
            <div className="text-lg md:text-xl">
          فرق التطوع
            </div>
          </div>
          
          <div className="text-white">
            <div className="text-4xl md:text-5xl font-bold mb-2">
              0
            </div>
            <div className="text-lg md:text-xl">
             الجهات المستفيدة
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
