import { prisma } from '@/lib/prisma';
import CertificatesManagement from '@/components/CertificatesManagement';

// إجبار الصفحة على تحديث البيانات فوراً (بدون كاش)
export const revalidate = 0;

export default async function Page() {
  const templates = await prisma.certificateTemplate.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return <CertificatesManagement initialTemplates={templates} />;
}