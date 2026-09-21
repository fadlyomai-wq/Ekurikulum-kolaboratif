import React from 'react';
import { X, Download, Printer, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';
import { LessonPlan } from '../types';

interface DocumentPreviewModalProps {
  plan: LessonPlan | null;
  onClose: () => void;
  onExportPdf: (plan: LessonPlan) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  plan,
  onClose,
  onExportPdf,
}) => {
  if (!plan) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Action Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">Pratinjau Dokumen Resmi Modul Ajar</span>
            <span className="text-xs bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded font-mono">
              {plan.code}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak</span>
            </button>

            <button
              onClick={() => onExportPdf(plan)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Unduh PDF Resmi</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Printable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-50">
          <div className="bg-white max-w-3xl mx-auto p-8 sm:p-12 shadow-sm border border-slate-200 rounded-xl space-y-6 text-slate-900 font-serif leading-relaxed text-sm">
            {/* Kop Resmi Kemendikbud & Sekolah */}
            <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1 font-sans">
              <p className="text-xs font-bold tracking-wider text-slate-600 uppercase">
                Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi Republik Indonesia
              </p>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                {plan.schoolName}
              </h2>
              <h1 className="text-base font-extrabold text-indigo-900 tracking-normal uppercase">
                Modul Ajar / Rencana Pelaksanaan Pembelajaran (RPP)
              </h1>
              <p className="text-xs text-slate-500">
                Standar: {plan.curriculum} • Tahun Ajaran {plan.academicYear} • Semester {plan.semester}
              </p>
            </div>

            {/* Verification Status Bar */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs font-sans">
              <div>
                <span className="font-bold text-slate-800">Kode: {plan.code}</span> • Status: <span className="font-bold text-emerald-700">{plan.status.toUpperCase()}</span>
              </div>
              <div className="text-slate-500 font-mono text-[11px] truncate max-w-[280px]">
                Hash E2E: {plan.encryptedHash.slice(0, 24)}...
              </div>
            </div>

            {/* BAGIAN I: INFORMASI UMUM */}
            <div className="space-y-3 font-sans">
              <div className="bg-indigo-50/80 px-3 py-1.5 rounded font-bold text-indigo-950 text-xs tracking-wide">
                I. INFORMASI UMUM
              </div>
              <table className="w-full text-xs text-slate-800">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-bold w-48 text-slate-600">Penyusun / Guru Pengampu</td>
                    <td className="py-1.5">{plan.authorName}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-bold text-slate-600">Satuan Pendidikan</td>
                    <td className="py-1.5">{plan.schoolName}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-bold text-slate-600">Mata Pelajaran / Fase</td>
                    <td className="py-1.5">{plan.subject} / {plan.phase} ({plan.grade})</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-bold text-slate-600">Topik / Materi Pokok</td>
                    <td className="py-1.5 font-semibold text-indigo-900">{plan.topic}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-bold text-slate-600">Alokasi Waktu</td>
                    <td className="py-1.5">{plan.allocatedHours} Jam Pelajaran (JP)</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-bold text-slate-600">Kompetensi Awal</td>
                    <td className="py-1.5">{plan.initialCompetency}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-bold text-slate-600">Profil Pelajar Pancasila</td>
                    <td className="py-1.5">{plan.pancasilaProfiles.join(', ')}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-bold text-slate-600">Model Pembelajaran</td>
                    <td className="py-1.5">{plan.learningModel}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* BAGIAN II: KOMPONEN INTI */}
            <div className="space-y-4 font-sans text-xs">
              <div className="bg-indigo-50/80 px-3 py-1.5 rounded font-bold text-indigo-950 tracking-wide">
                II. KOMPONEN INTI
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1.5">A. Tujuan Pembelajaran (TP):</h4>
                <ol className="list-decimal pl-5 space-y-1 text-slate-800">
                  {plan.learningObjectives.map((tp, i) => (
                    <li key={i}>{tp}</li>
                  ))}
                </ol>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">B. Pemahaman Bermakna:</h4>
                <p className="text-slate-700 italic bg-slate-50 p-2.5 rounded border border-slate-200">
                  "{plan.meaningfulUnderstanding}"
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1.5">C. Pertanyaan Pemantik:</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-800">
                  {plan.triggeringQuestions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>

              {/* Kegiatan Pembelajaran */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">D. Kegiatan Pembelajaran:</h4>

                <div className="space-y-1">
                  <p className="font-bold text-slate-800">
                    1. Kegiatan Pendahuluan ({plan.activities.introduction.duration} Menit)
                  </p>
                  <ul className="list-disc pl-5 text-slate-700 space-y-0.5">
                    {plan.activities.introduction.steps.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1 pt-1">
                  <p className="font-bold text-slate-800">
                    2. Kegiatan Inti ({plan.activities.coreActivity.duration} Menit)
                  </p>
                  <ul className="list-disc pl-5 text-slate-700 space-y-0.5">
                    {plan.activities.coreActivity.steps.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>

                  {/* Diferensiasi Box */}
                  <div className="mt-2 p-2.5 bg-indigo-50/50 rounded border border-indigo-100 space-y-1 text-[11px]">
                    <span className="font-bold text-indigo-900 block">Diferensiasi Pembelajaran:</span>
                    <p><strong>• Konten:</strong> {plan.activities.coreActivity.differentiation.content}</p>
                    <p><strong>• Proses:</strong> {plan.activities.coreActivity.differentiation.process}</p>
                    <p><strong>• Produk:</strong> {plan.activities.coreActivity.differentiation.product}</p>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <p className="font-bold text-slate-800">
                    3. Kegiatan Penutup ({plan.activities.closing.duration} Menit)
                  </p>
                  <ul className="list-disc pl-5 text-slate-700 space-y-0.5">
                    {plan.activities.closing.steps.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Asesmen */}
              <div className="space-y-1.5 pt-2">
                <h4 className="font-bold text-slate-900">E. Asesmen & Evaluasi:</h4>
                <p><strong>• Diagnostik:</strong> {plan.assessments.diagnostic}</p>
                <p><strong>• Formatif:</strong> {plan.assessments.formative}</p>
                <p><strong>• Sumatif:</strong> {plan.assessments.summative}</p>
              </div>
            </div>

            {/* LEMBAR PENGESAHAN */}
            <div className="pt-6 border-t-2 border-slate-300 font-sans text-xs">
              <div className="grid grid-cols-2 gap-8 text-center pt-2">
                <div>
                  <p className="text-slate-600">Mengetahui,</p>
                  <p className="font-bold text-slate-900">Kepala Sekolah</p>
                  <div className="my-3 py-2 px-3 border border-dashed border-emerald-500 rounded bg-emerald-50/40 inline-block">
                    <p className="text-[10px] font-bold text-emerald-700 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> TERVALIDASI SISTEM
                    </p>
                    <p className="text-[9px] text-slate-500">Tanda Tangan Elektronik</p>
                  </div>
                  <p className="font-bold text-slate-900">Dr. H. Sulaiman, M.Pd.</p>
                  <p className="text-slate-500 text-[11px]">NIP. 19690812 199403 1 003</p>
                </div>

                <div>
                  <p className="text-slate-600">Kota Jakarta, 21 September 2026</p>
                  <p className="font-bold text-slate-900">Guru Mata Pelajaran</p>
                  <div className="my-3 py-2 px-3 border border-dashed border-emerald-500 rounded bg-emerald-50/40 inline-block">
                    <p className="text-[10px] font-bold text-emerald-700 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> TERVALIDASI SISTEM
                    </p>
                    <p className="text-[9px] text-slate-500">Verifikasi MGMP</p>
                  </div>
                  <p className="font-bold text-slate-900">{plan.authorName}</p>
                  <p className="text-slate-500 text-[11px]">NIP. 19820315 200801 1 008</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
