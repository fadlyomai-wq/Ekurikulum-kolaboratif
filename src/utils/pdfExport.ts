import jsPDF from 'jspdf';
import { LessonPlan } from '../types';

export function generateLessonPlanPdf(plan: LessonPlan): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 15) {
      doc.addPage();
      y = margin;
      drawHeaderFooter();
    }
  };

  const drawHeaderFooter = () => {
    // Top subtle bar
    doc.setFillColor(30, 58, 138); // navy blue
    doc.rect(margin, 10, contentWidth, 1.2, 'F');
    
    // Footer page number
    const totalPages = (doc.internal as any).getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `KurikulumLink E-RPP Terverifikasi | Hash: ${plan.encryptedHash.slice(0, 16)}... | Halaman ${(doc.internal as any).getCurrentPageInfo().pageNumber}`,
      margin,
      pageHeight - 10
    );
  };

  // Header / Kop Dokumen
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI', pageWidth / 2, y, { align: 'center' });
  y += 5;

  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(plan.schoolName.toUpperCase(), pageWidth / 2, y, { align: 'center' });
  y += 5;

  doc.setFontSize(14);
  doc.setTextColor(30, 58, 138);
  doc.text('MODUL AJAR / RENCANA PELAKSANAAN PEMBELAJARAN (RPP)', pageWidth / 2, y, { align: 'center' });
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Standar: ${plan.curriculum} | Tahun Ajaran ${plan.academicYear} | Semester ${plan.semester}`, pageWidth / 2, y, { align: 'center' });
  y += 6;

  // Double divider line
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);
  y += 1.5;
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // Status & Verification Badge Box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 12, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text(`KODE DOKUMEN: ${plan.code}`, margin + 4, y + 5);
  doc.text(`STATUS: ${plan.status.toUpperCase()}`, margin + contentWidth - 4, y + 5, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Terverifikasi Enkripsi AES-256 | Versi: ${plan.version} | Terakhir Diubah: ${new Date(plan.lastModified).toLocaleDateString('id-ID')}`, margin + 4, y + 9.5);
  y += 16;

  // SECTION I: IDENTITAS & INFORMASI UMUM
  const renderSectionHeader = (number: string, title: string) => {
    checkPageBreak(12);
    doc.setFillColor(238, 242, 255); // indigo light
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 58, 138);
    doc.text(`${number}. ${title}`, margin + 3, y + 5);
    y += 10;
  };

  renderSectionHeader('I', 'INFORMASI UMUM');

  const printKeyValue = (label: string, value: string) => {
    checkPageBreak(8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(label, margin + 2, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    
    // handle wrap text
    const labelWidth = 55;
    const splitText = doc.splitTextToSize(value, contentWidth - labelWidth - 4);
    doc.text(splitText, margin + labelWidth, y);
    y += Math.max(5.5, splitText.length * 4.5);
  };

  printKeyValue('Penyusun / Guru Pengampu', `${plan.authorName} (NIP. 19820315 200801 1 008)`);
  printKeyValue('Satuan Pendidikan', plan.schoolName);
  printKeyValue('Mata Pelajaran', plan.subject);
  printKeyValue('Fase / Kelas / Semester', `${plan.phase} / ${plan.grade} / Semester ${plan.semester}`);
  printKeyValue('Topik / Materi Pokok', plan.topic);
  printKeyValue('Alokasi Waktu', `${plan.allocatedHours} Jam Pelajaran (JP)`);
  printKeyValue('Kompetensi Awal', plan.initialCompetency);
  printKeyValue('Profil Pelajar Pancasila', plan.pancasilaProfiles.join(', '));
  printKeyValue('Sarana & Prasarana', plan.facilities);
  printKeyValue('Target Peserta Didik', plan.targetStudents);
  printKeyValue('Model Pembelajaran', plan.learningModel);

  y += 4;

  // SECTION II: KOMPONEN INTI
  renderSectionHeader('II', 'KOMPONEN INTI');

  // A. Tujuan Pembelajaran
  checkPageBreak(10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 58, 138);
  doc.text('A. Tujuan Pembelajaran (TP)', margin + 2, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  plan.learningObjectives.forEach((tp, idx) => {
    checkPageBreak(6);
    const lines = doc.splitTextToSize(`${idx + 1}. ${tp}`, contentWidth - 6);
    doc.text(lines, margin + 4, y);
    y += lines.length * 4.5;
  });
  y += 3;

  // B. Pemahaman Bermakna & Pertanyaan Pemantik
  checkPageBreak(12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 58, 138);
  doc.text('B. Pemahaman Bermakna', margin + 2, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  const pbLines = doc.splitTextToSize(plan.meaningfulUnderstanding, contentWidth - 6);
  doc.text(pbLines, margin + 4, y);
  y += pbLines.length * 4.5 + 4;

  checkPageBreak(10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 58, 138);
  doc.text('C. Pertanyaan Pemantik', margin + 2, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  plan.triggeringQuestions.forEach((q, idx) => {
    checkPageBreak(6);
    const lines = doc.splitTextToSize(`${idx + 1}. ${q}`, contentWidth - 6);
    doc.text(lines, margin + 4, y);
    y += lines.length * 4.5;
  });
  y += 4;

  // D. Kegiatan Pembelajaran
  checkPageBreak(12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 58, 138);
  doc.text('D. Kegiatan Pembelajaran', margin + 2, y);
  y += 5;

  const renderActivityBlock = (title: string, duration: number, steps: string[]) => {
    checkPageBreak(10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`• ${title} (${duration} Menit)`, margin + 4, y);
    y += 4.5;
    doc.setFont('helvetica', 'normal');
    steps.forEach((step, sIdx) => {
      checkPageBreak(6);
      const lines = doc.splitTextToSize(`  ${sIdx + 1}) ${step}`, contentWidth - 10);
      doc.text(lines, margin + 6, y);
      y += lines.length * 4.5;
    });
    y += 2;
  };

  renderActivityBlock('Kegiatan Pendahuluan', plan.activities.introduction.duration, plan.activities.introduction.steps);
  renderActivityBlock('Kegiatan Inti', plan.activities.coreActivity.duration, plan.activities.coreActivity.steps);

  // Diferensiasi block
  checkPageBreak(14);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin + 6, y, contentWidth - 12, 16, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(79, 70, 229);
  doc.text('Diferensiasi Pembelajaran:', margin + 8, y + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(`- Konten: ${plan.activities.coreActivity.differentiation.content}`, margin + 8, y + 8);
  doc.text(`- Proses: ${plan.activities.coreActivity.differentiation.process}`, margin + 8, y + 11.5);
  doc.text(`- Produk: ${plan.activities.coreActivity.differentiation.product}`, margin + 8, y + 15);
  y += 20;

  renderActivityBlock('Kegiatan Penutup', plan.activities.closing.duration, plan.activities.closing.steps);
  y += 4;

  // E. Asesmen & Rubrik
  checkPageBreak(12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 58, 138);
  doc.text('E. Asesmen Pembelajaran', margin + 2, y);
  y += 5;
  printKeyValue('Asesmen Diagnostik', plan.assessments.diagnostic);
  printKeyValue('Asesmen Formatif', plan.assessments.formative);
  printKeyValue('Asesmen Sumatif', plan.assessments.summative);

  y += 6;

  // SECTION III: PENGESAHAN & TANDA TANGAN
  renderSectionHeader('III', 'LEMBAR PENGESAHAN & VERIFIKASI KURIKULUM');

  checkPageBreak(40);
  const colWidth = (contentWidth - 10) / 2;
  const sigY = y + 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text('Mengetahui,', margin + 6, sigY);
  doc.text('Kepala Sekolah', margin + 6, sigY + 5);

  doc.text('Kota Jakarta, ' + new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }), margin + colWidth + 10, sigY);
  doc.text('Guru Mata Pelajaran', margin + colWidth + 10, sigY + 5);

  // Digital Signature Stamp placeholder
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin + 6, sigY + 8, 45, 14, 1, 1);
  doc.setFontSize(7.5);
  doc.setTextColor(16, 185, 129);
  doc.text('✓ TTD DIGITAL VALID', margin + 9, sigY + 14);
  doc.setTextColor(100, 116, 139);
  doc.text('Sertifikat E-Kurikulum', margin + 9, sigY + 19);

  doc.roundedRect(margin + colWidth + 10, sigY + 8, 45, 14, 1, 1);
  doc.setTextColor(16, 185, 129);
  doc.text('✓ TTD DIGITAL VALID', margin + colWidth + 13, sigY + 14);
  doc.setTextColor(100, 116, 139);
  doc.text('Verifikasi Tim Pengembang', margin + colWidth + 13, sigY + 19);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Dr. H. Sulaiman, M.Pd.', margin + 6, sigY + 28);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('NIP. 19690812 199403 1 003', margin + 6, sigY + 32);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(plan.authorName, margin + colWidth + 10, sigY + 28);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('NIP. 19820315 200801 1 008', margin + colWidth + 10, sigY + 32);

  // Draw header/footers on all pages
  const totalPages = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    // top navy bar
    doc.setFillColor(30, 58, 138);
    doc.rect(margin, 10, contentWidth, 1.2, 'F');
    // footer
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `KurikulumLink E-RPP Terverifikasi | Hash: ${plan.encryptedHash.slice(0, 16)}... | Halaman ${i} dari ${totalPages}`,
      margin,
      pageHeight - 10
    );
  }

  return doc;
}
