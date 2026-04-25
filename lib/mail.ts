import nodemailer from 'nodemailer';

// إعداد المحرك المسؤول عن الإرسال
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const sendStatusEmail = async (to: string, teamName: string, status: string) => {
  try {
    const subject = status === 'accepted' ? 'تهانينا! تم قبول فريقكم ✅' : 'تحديث بخصوص طلب انضمام الفريق ⚠️';
    
    const htmlContent = `
      <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: right; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; max-width: 600px; margin: auto;">
        <h2 style="color: #059669; border-bottom: 2px solid #f0fdf4; padding-bottom: 10px;">مرحباً بقائد فريق ${teamName}</h2>
        
        <p style="font-size: 16px; color: #475569; line-height: 1.6;">نود إعلامكم بأنه قد تمت مراجعة طلبكم وانضمامكم لفريق سفراء التطوع، وكانت النتيجة:</p>
        
        <div style="background-color: ${status === 'accepted' ? '#f0fdf4' : '#fff1f2'}; 
                    color: ${status === 'accepted' ? '#166534' : '#991b1b'}; 
                    padding: 20px; border-radius: 12px; text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0; border: 1px dashed;">
          ${status === 'accepted' ? 'تم قبول الفريق بنجاح' : 'نعتذر، لم يتم قبول الفريق'}
        </div>

        ${status === 'accepted' ? `
          <p style="color: #475569;">يمكنكم الآن البدء في استخدام لوحة التحكم الخاصة بكم وإضافة الأعضاء.</p>
        ` : `
          <p style="color: #475569;">نتمنى لكم التوفيق في محاولات قادمة.</p>
        `}

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">هذا إيميل تلقائي من نظام سفراء التطوع، يرجى عدم الرد عليه.</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"سفراء التطوع" <${process.env.EMAIL_SERVER_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return { success: false, error };
  }
};