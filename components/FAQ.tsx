"use client";

import React, { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "ما هو الغرض من المنصة؟",
      answer: "تسجيل واعتماد الفرق التطوعية الخاصة بسفراء التطوع الصحي، بالإضافة لتسجيل المتطوعين الراغبين بالانضمام للفرق التطوعية الصحية."
    },
    {
      question: "ما هي اللغة المستخدمة في المنصة؟",
      answer: "اللغة العربية ."
    },
    {
      question: "ماهي خطوات التسجيل ؟",
      answer: "بإمكانك التسجيل عن طريق دعوة أو إنشاء فريقك الخاص أو التسجيل والانضمام إلى فريق. "
    },
    {
      question: "هل يشترط أن يكون المشارك حاصل على شهادة جامعية؟",
      answer: "ليست هنالك مؤهلات أكاديمية معينة للمشاركة، الجميع يمكنه المشاركة في المنصة، شرط أن تنطبق عليه ضوابط التطوع."
    },
    {
      question: "هل يمكن إضافة أعضاء جدد للفريق بعد التسجيل ؟",
      answer: "نعم يمكن إضافة أعضاء لفريق بعد التسجيل."
    },
    {
      question: "هل يتطلب وجود فريق؟ وكم العدد المسموح لأعضاء الفريق الواحد؟",
      answer: "يمكنك كفرد التسجيل في المنصة والانضمام إلى الفرق الموجودة، والحد الأدنى لعدد الفريق التطوعي في سفراء التطوع الصحي (5) أشخاص"
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#34bca3' }}>
          الأسئلة الشائعة
          </h2>
     
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-right bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                >
                  <span className="text-lg font-medium text-gray-900">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
                
                {openIndex === index && (
                  <div className="px-6 py-4 bg-white">
                    <p className="text-gray-700 text-right">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
