import React, { useState } from 'react';
import { X, Sparkles, BookOpen } from 'lucide-react';
import { LessonPlan, User } from '../types';
import { computeSha256 } from '../utils/crypto';

interface NewPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onCreatePlan: (plan: LessonPlan) => void;
}

export const NewPlanModal: React.FC<NewPlanModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onCreatePlan,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(currentUser.subject || 'Matematika');
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('Kelas VIII');
  const [phase, setPhase] = useState('Fase D (SMP)');
  const [curriculum, setCurriculum] = useState<'Kurikulum Merdeka' | 'Kurikulum 2013' | 'Cambridge / Hybrid'>('Kurikulum Merdeka');
  const [allocatedHours, setAllocatedHours] = useState(4);
  const [learningModel, setLearningModel] = useState('Problem-Based Learning (PBL)');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !topic.trim()) return;

    const randomId = 'plan_' + Date.now();
    const code = `MOD-${subject.slice(0, 3).toUpperCase()}-${grade.replace(/[^0-9]/g, '') || 'X'}-${Math.floor(10 + Math.random() * 90)}`;
    const initialHash = await computeSha256(title + topic + Date.now());

    const newPlan: LessonPlan = {
      id: randomId,
      code,
      title: title.trim(),
      curriculum,
      phase,
      grade,
      subject,
      topic: topic.trim(),
      semester: 'Ganjil',
      academicYear: '2026/2027',
      allocatedHours,
      authorId: currentUser.id,
      authorName: currentUser.name,
      status: 'Draft',
      version: '1.0',
      lastModified: new Date().toISOString(),
      encryptedHash: initialHash,
      schoolName: 'SMP Negeri 1 Nusantara Unggul',
      initialCompetency: 'Peserta didik memiliki pemahaman dasar terkait prasyarat materi pokok.',
      pancasilaProfiles: ['Bernalar Kritis', 'Gotong Royong', 'Mandiri'],
      facilities: 'Perangkat TIK, Proyektor, Lembar Kerja Peserta Didik (LKPD)',
      targetStudents: '32 Siswa Reguler / Heterogen',
      learningModel,
      learningObjectives: [
        'Memahami konsep utama materi dan mengaitkannya dengan fenomena kontekstual.',
        'Menganalisis prosedur pemecahan masalah secara kolaboratif.',
      ],
      meaningfulUnderstanding: 'Peserta didik menyadari relevansi materi ini dalam kehidupan sehari-hari dan pengembangan nalar kritis.',
      triggeringQuestions: [
        'Mengapa kita perlu mempelajari materi ini dalam pemecahan tantangan nyata di lingkungan sekitar?',
      ],
      activities: {
        introduction: {
          duration: 15,
          steps: [
            'Guru membuka dengan salam, apersepsi kontekstual, dan penyampaian tujuan pembelajaran.',
          ],
        },
        coreActivity: {
          duration: 50,
          steps: [
            'Orientasi masalah kontekstual.',
            'Diskusi kelompok dan eksplorasi data.',
            'Presentasi hasil kerja kelompok dan tanggapan.',
          ],
          differentiation: {
            content: 'Bahan bacaan bergambar dan panduan ringkas.',
            process: 'Pendampingan langsung guru bagi kelompok perancah.',
            product: 'Paparan visual atau ringkasan portofolio.',
          },
        },
        closing: {
          duration: 15,
          steps: ['Refleksi hasil belajar siswa dan doa penutup.'],
        },
      },
      assessments: {
        diagnostic: 'Asesmen awal pemahaman konsep prasyarat.',
        formative: 'Observasi keaktifan diskusi dan pengisian LKPD kelompok.',
        summative: 'Tes tertulis studi kasus dan portofolio.',
        rubrics: [
          {
            criterion: 'Penguasaan Konsep',
            exemplary: 'Sangat memahami dan mampu menjelaskan dengan argumen logis.',
            proficient: 'Memahami konsep dengan sedikit bimbingan.',
            developing: 'Masih membutuhkan asistensi intensif guru.',
          },
        ],
      },
      reflection: {
        teacherNotes: 'Catatan awal perencanaan modul ajar.',
        studentQuestions: 'Bagaimana penerapan praktis konsep ini?',
      },
      attachments: {
        worksheetSummary: 'LKPD Praktik Mandiri & Kolaboratif',
        enrichmentRemedial: 'Pengayaan literasi mandiri.',
        references: ['Buku Panduan Guru Kemdikbudristek 2024'],
      },
      comments: [],
      history: [
        {
          id: 'hist_' + Date.now(),
          version: '1.0',
          modifiedBy: currentUser.name,
          timestamp: new Date().toISOString(),
          summary: 'Inisiasi draf modul ajar baru.',
        },
      ],
      collaborators: [
        {
          userId: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          role: 'Penyusun Utama',
          lastActive: 'Baru saja',
        },
      ],
    };

    onCreatePlan(newPlan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 to-blue-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <h3 className="font-bold text-sm">Buat Rencana Pembelajaran / Modul Ajar Baru</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Judul Modul Ajar / RPP:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Transformasi Geometri Berbasis Kearifan Lokal"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran:</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Standar Kurikulum:</label>
              <select
                value={curriculum}
                onChange={(e: any) => setCurriculum(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white cursor-pointer"
              >
                <option value="Kurikulum Merdeka">Kurikulum Merdeka</option>
                <option value="Kurikulum 2013">Kurikulum 2013</option>
                <option value="Cambridge / Hybrid">Cambridge / Hybrid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Fase / Jenjang:</label>
              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white cursor-pointer"
              >
                <option value="Fase D (SMP)">Fase D (SMP Kelas 7-9)</option>
                <option value="Fase E (SMA)">Fase E (SMA Kelas 10)</option>
                <option value="Fase F (SMA)">Fase F (SMA Kelas 11-12)</option>
                <option value="Fase A-C (SD)">Fase A-C (SD Kelas 1-6)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tingkat Kelas:</label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="Kelas VIII"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Topik / Materi Pokok:</label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Contoh: Refleksi dan Rotasi pada Motif Batik Nusantara"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Model Pembelajaran:</label>
              <select
                value={learningModel}
                onChange={(e) => setLearningModel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white cursor-pointer"
              >
                <option value="Problem-Based Learning (PBL)">Problem-Based Learning (PBL)</option>
                <option value="Project-Based Learning (PjBL)">Project-Based Learning (PjBL)</option>
                <option value="Inquiry-Based Learning">Inquiry-Based Learning</option>
                <option value="Discovery Learning">Discovery Learning</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Alokasi Waktu (JP):</label>
              <input
                type="number"
                min="1"
                max="10"
                value={allocatedHours}
                onChange={(e) => setAllocatedHours(parseInt(e.target.value) || 2)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-sm cursor-pointer"
            >
              Inisiasi Modul Ajar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
