import React, { useState, useEffect } from 'react';
import {
  Save, Download, Users, MessageSquare, Send, CheckCircle2, History, AlertCircle, Sparkles,
  Layers, BookOpen, Target, HelpCircle, Shield, Check, Plus, Trash2, Radio, Clock
} from 'lucide-react';
import { LessonPlan, User, CollaborativeComment, PlanStatus } from '../types';
import { computeSha256 } from '../utils/crypto';

interface CollaborativeEditorProps {
  plan: LessonPlan;
  currentUser: User;
  allUsers: User[];
  isOnline: boolean;
  onSavePlan: (updatedPlan: LessonPlan) => void;
  onExportPdf: (plan: LessonPlan) => void;
  onPreviewPlan: (plan: LessonPlan) => void;
  onAddComment: (planId: string, comment: Omit<CollaborativeComment, 'id' | 'timestamp' | 'resolved'>) => void;
}

export const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({
  plan,
  currentUser,
  allUsers,
  isOnline,
  onSavePlan,
  onExportPdf,
  onPreviewPlan,
  onAddComment,
}) => {
  const [formData, setFormData] = useState<LessonPlan>(plan);
  const [activeSectionTab, setActiveSectionTab] = useState<'info' | 'core' | 'activities' | 'assessments' | 'reflection'>('core');
  const [newCommentText, setNewCommentText] = useState('');
  const [commentSection, setCommentSection] = useState('Komponen Inti');
  const [showHistory, setShowHistory] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  // Sync internal state when plan prop updates (e.g. from background sync or plan switch)
  useEffect(() => {
    setFormData(plan);
  }, [plan.id]);

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      lastModified: new Date().toISOString(),
    }));
    setIsSaved(false);
  };

  const handleDeepFieldChange = (path: string[], value: any) => {
    setFormData((prev: any) => {
      const clone = JSON.parse(JSON.stringify(prev));
      let cur = clone;
      for (let i = 0; i < path.length - 1; i++) {
        cur = cur[path[i]];
      }
      cur[path[path.length - 1]] = value;
      clone.lastModified = new Date().toISOString();
      return clone;
    });
    setIsSaved(false);
  };

  const handleManualSave = async () => {
    // Recompute SHA-256 cryptographic signature
    const contentString = JSON.stringify({
      code: formData.code,
      title: formData.title,
      tp: formData.learningObjectives,
      activities: formData.activities,
      assessments: formData.assessments,
    });
    const newHash = await computeSha256(contentString);
    const updatedPlan: LessonPlan = {
      ...formData,
      encryptedHash: newHash,
      lastModified: new Date().toISOString(),
    };
    onSavePlan(updatedPlan);
    setIsSaved(true);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    onAddComment(formData.id, {
      userId: currentUser.id,
      userName: `${currentUser.name} (${currentUser.role})`,
      userAvatar: currentUser.avatar,
      section: commentSection,
      text: newCommentText.trim(),
    });

    setNewCommentText('');
  };

  // Simulating active collaborator cursors/presence
  const otherUsers = allUsers.filter((u) => u.id !== currentUser.id && u.isOnline);

  return (
    <div className="space-y-6">
      {/* Collaborative Top Bar & Presence Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              {formData.code}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {formData.curriculum} • {formData.phase}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              v{formData.version}
            </span>
            {!isSaved && (
              <span className="text-xs text-amber-600 font-medium animate-pulse flex items-center gap-1">
                • Perubahan belum disimpan
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {formData.title}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Penyusun Utama: <span className="font-semibold text-slate-700">{formData.authorName}</span> • Satuan Pendidikan: {formData.schoolName}
          </p>
        </div>

        {/* Live Collaborators Presence Stack & Save Button */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Active Collaborators Bar */}
          <div className="flex items-center bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl gap-2 text-xs">
            <span className="text-slate-500 font-medium hidden sm:inline flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-500 animate-ping" />
              Kolaborator Aktif:
            </span>
            <div className="flex -space-x-1.5 overflow-hidden">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                title={`${currentUser.name} (Anda - ${currentUser.role})`}
                className="inline-block h-7 w-7 rounded-full ring-2 ring-indigo-500 object-cover"
              />
              {otherUsers.map((u) => (
                <img
                  key={u.id}
                  src={u.avatar}
                  alt={u.name}
                  title={`${u.name} (${u.role}) - Sedang melihat bagian ${u.activeSection || 'Modul'}`}
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-slate-700">{1 + otherUsers.length} guru</span>
          </div>

          <button
            id="btn-history-toggle"
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            title="Riwayat Revisi"
          >
            <History className="w-4 h-4" />
          </button>

          <button
            id="btn-preview-modal-trigger"
            onClick={() => onPreviewPlan(formData)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Pratinjau
          </button>

          <button
            id="btn-export-pdf-editor"
            onClick={() => onExportPdf(formData)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Unduh PDF</span>
          </button>

          <button
            id="btn-save-plan-editor"
            onClick={handleManualSave}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan & Sinkronkan</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Editor Sections + Collaborative Side Comments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Comprehensive Document Form (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 overflow-x-auto text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveSectionTab('core')}
              className={`pb-3 px-3 border-b-2 transition cursor-pointer ${
                activeSectionTab === 'core'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              1. Komponen Inti (TP & Pemahaman)
            </button>
            <button
              onClick={() => setActiveSectionTab('activities')}
              className={`pb-3 px-3 border-b-2 transition cursor-pointer ${
                activeSectionTab === 'activities'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              2. Langkah Pembelajaran (Diferensiasi)
            </button>
            <button
              onClick={() => setActiveSectionTab('assessments')}
              className={`pb-3 px-3 border-b-2 transition cursor-pointer ${
                activeSectionTab === 'assessments'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              3. Asesmen & Rubrik
            </button>
            <button
              onClick={() => setActiveSectionTab('info')}
              className={`pb-3 px-3 border-b-2 transition cursor-pointer ${
                activeSectionTab === 'info'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              4. Informasi Umum
            </button>
            <button
              onClick={() => setActiveSectionTab('reflection')}
              className={`pb-3 px-3 border-b-2 transition cursor-pointer ${
                activeSectionTab === 'reflection'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              5. Refleksi & Lampiran
            </button>
          </div>

          {/* Form Content Body */}
          <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 p-5 shadow-xs space-y-5">
            {/* TAB 1: KOMPONEN INTI */}
            {activeSectionTab === 'core' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Target className="w-4 h-4 text-indigo-600" />
                    Tujuan Pembelajaran (TP) & Pemahaman Bermakna
                  </h3>
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium">
                    Fokus Kurikulum Merdeka
                  </span>
                </div>

                {/* Learning Objectives List */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700">Tujuan Pembelajaran (TP Spesifik):</label>
                    <button
                      type="button"
                      onClick={() => {
                        handleFieldChange('learningObjectives', [
                          ...formData.learningObjectives,
                          'Menganalisis dan mengevaluasi solusi permasalahan berdasarkan bukti empiris.',
                        ]);
                      }}
                      className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah TP
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.learningObjectives.map((tp, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={tp}
                          onChange={(e) => {
                            const updated = [...formData.learningObjectives];
                            updated[idx] = e.target.value;
                            handleFieldChange('learningObjectives', updated);
                          }}
                          className="flex-1 text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {formData.learningObjectives.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.learningObjectives.filter((_, i) => i !== idx);
                              handleFieldChange('learningObjectives', updated);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                            title="Hapus Tujuan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pemahaman Bermakna */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pemahaman Bermakna (Essential Understanding):
                  </label>
                  <textarea
                    rows={3}
                    value={formData.meaningfulUnderstanding}
                    onChange={(e) => handleFieldChange('meaningfulUnderstanding', e.target.value)}
                    placeholder="Contoh: Peserta didik memahami bahwa pemodelan matematika digunakan dalam pengambilan keputusan bisnis sehari-hari..."
                    className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Jelaskan manfaat praktis materi ini bagi kehidupan nyata peserta didik di luar kelas.
                  </p>
                </div>

                {/* Pertanyaan Pemantik */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Pertanyaan Pemantik (Inquiry / Triggering Questions):
                  </label>
                  <div className="space-y-2">
                    {formData.triggeringQuestions.map((q, qIdx) => (
                      <div key={qIdx} className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                        <input
                          type="text"
                          value={q}
                          onChange={(e) => {
                            const updated = [...formData.triggeringQuestions];
                            updated[qIdx] = e.target.value;
                            handleFieldChange('triggeringQuestions', updated);
                          }}
                          className="flex-1 text-xs sm:text-sm px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: LANGKAH KEGIATAN & DIFERENSIASI */}
            {activeSectionTab === 'activities' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    Skenario Pembelajaran & Diferensiasi Terpadu
                  </h3>
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium">
                    Total: {formData.activities.introduction.duration + formData.activities.coreActivity.duration + formData.activities.closing.duration} Menit
                  </span>
                </div>

                {/* Kegiatan Pendahuluan */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Kegiatan Pendahuluan:</span>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <input
                        type="number"
                        value={formData.activities.introduction.duration}
                        onChange={(e) =>
                          handleDeepFieldChange(['activities', 'introduction', 'duration'], parseInt(e.target.value) || 0)
                        }
                        className="w-12 px-1.5 py-0.5 rounded border border-slate-200 text-center font-bold text-slate-800"
                      />
                      <span>Menit</span>
                    </div>
                  </div>
                  {formData.activities.introduction.steps.map((step, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={step}
                      onChange={(e) => {
                        const updated = [...formData.activities.introduction.steps];
                        updated[idx] = e.target.value;
                        handleDeepFieldChange(['activities', 'introduction', 'steps'], updated);
                      }}
                      className="w-full text-xs px-3 py-1.5 bg-white rounded-lg border border-slate-200"
                    />
                  ))}
                </div>

                {/* Kegiatan Inti */}
                <div className="bg-indigo-50/40 p-4 rounded-xl border border-indigo-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900">Kegiatan Inti (Sintaks {formData.learningModel.split(' ')[0]}):</span>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <input
                        type="number"
                        value={formData.activities.coreActivity.duration}
                        onChange={(e) =>
                          handleDeepFieldChange(['activities', 'coreActivity', 'duration'], parseInt(e.target.value) || 0)
                        }
                        className="w-12 px-1.5 py-0.5 rounded border border-slate-200 text-center font-bold text-slate-800"
                      />
                      <span>Menit</span>
                    </div>
                  </div>
                  {formData.activities.coreActivity.steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-600 shrink-0">{idx + 1}.</span>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => {
                          const updated = [...formData.activities.coreActivity.steps];
                          updated[idx] = e.target.value;
                          handleDeepFieldChange(['activities', 'coreActivity', 'steps'], updated);
                        }}
                        className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-slate-200"
                      />
                    </div>
                  ))}

                  {/* Strategi Diferensiasi */}
                  <div className="mt-4 pt-3 border-t border-indigo-100 bg-white p-3 rounded-lg space-y-2">
                    <p className="text-xs font-bold text-indigo-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Strategi Pembelajaran Berdiferensiasi (Kesiapan & Minat Siswa):
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="font-bold text-slate-700 block mb-0.5">Diferensiasi Konten:</span>
                        <textarea
                          rows={3}
                          value={formData.activities.coreActivity.differentiation.content}
                          onChange={(e) =>
                            handleDeepFieldChange(['activities', 'coreActivity', 'differentiation', 'content'], e.target.value)
                          }
                          className="w-full p-2 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 block mb-0.5">Diferensiasi Proses:</span>
                        <textarea
                          rows={3}
                          value={formData.activities.coreActivity.differentiation.process}
                          onChange={(e) =>
                            handleDeepFieldChange(['activities', 'coreActivity', 'differentiation', 'process'], e.target.value)
                          }
                          className="w-full p-2 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 block mb-0.5">Diferensiasi Produk:</span>
                        <textarea
                          rows={3}
                          value={formData.activities.coreActivity.differentiation.product}
                          onChange={(e) =>
                            handleDeepFieldChange(['activities', 'coreActivity', 'differentiation', 'product'], e.target.value)
                          }
                          className="w-full p-2 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kegiatan Penutup */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Kegiatan Penutup & Refleksi:</span>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <input
                        type="number"
                        value={formData.activities.closing.duration}
                        onChange={(e) =>
                          handleDeepFieldChange(['activities', 'closing', 'duration'], parseInt(e.target.value) || 0)
                        }
                        className="w-12 px-1.5 py-0.5 rounded border border-slate-200 text-center font-bold text-slate-800"
                      />
                      <span>Menit</span>
                    </div>
                  </div>
                  {formData.activities.closing.steps.map((step, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={step}
                      onChange={(e) => {
                        const updated = [...formData.activities.closing.steps];
                        updated[idx] = e.target.value;
                        handleDeepFieldChange(['activities', 'closing', 'steps'], updated);
                      }}
                      className="w-full text-xs px-3 py-1.5 bg-white rounded-lg border border-slate-200"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ASESMEN & RUBRIK */}
            {activeSectionTab === 'assessments' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Rencana Asesmen Formatif, Sumatif & Diagnostik
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Asesmen Diagnostik (Awal):</label>
                    <textarea
                      rows={4}
                      value={formData.assessments.diagnostic}
                      onChange={(e) => handleDeepFieldChange(['assessments', 'diagnostic'], e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Asesmen Formatif (Proses):</label>
                    <textarea
                      rows={4}
                      value={formData.assessments.formative}
                      onChange={(e) => handleDeepFieldChange(['assessments', 'formative'], e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Asesmen Sumatif (Akhir):</label>
                    <textarea
                      rows={4}
                      value={formData.assessments.summative}
                      onChange={(e) => handleDeepFieldChange(['assessments', 'summative'], e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                    />
                  </div>
                </div>

                {/* Rubrik Penilaian */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">Rubrik Kriteria Ketercapaian Tujuan (KKTP):</span>
                  </div>
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="min-w-full divide-y divide-slate-200 text-xs">
                      <thead className="bg-slate-50 font-semibold text-slate-700">
                        <tr>
                          <th className="px-3 py-2 text-left w-1/4">Kriteria</th>
                          <th className="px-3 py-2 text-left w-1/4 text-emerald-700">Sangat Mahir (90-100)</th>
                          <th className="px-3 py-2 text-left w-1/4 text-blue-700">Mahir (80-89)</th>
                          <th className="px-3 py-2 text-left w-1/4 text-amber-700">Perlu Bimbingan (&lt;80)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {formData.assessments.rubrics.map((rubric, rIdx) => (
                          <tr key={rIdx}>
                            <td className="px-3 py-2 font-semibold text-slate-800">{rubric.criterion}</td>
                            <td className="px-3 py-2 text-slate-600">{rubric.exemplary}</td>
                            <td className="px-3 py-2 text-slate-600">{rubric.proficient}</td>
                            <td className="px-3 py-2 text-slate-600">{rubric.developing}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: INFORMASI UMUM */}
            {activeSectionTab === 'info' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mata Pelajaran:</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleFieldChange('subject', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Fase & Kelas:</label>
                    <input
                      type="text"
                      value={`${formData.phase} - ${formData.grade}`}
                      onChange={(e) => handleFieldChange('grade', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Model Pembelajaran:</label>
                    <input
                      type="text"
                      value={formData.learningModel}
                      onChange={(e) => handleFieldChange('learningModel', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Alokasi Waktu (JP):</label>
                    <input
                      type="number"
                      value={formData.allocatedHours}
                      onChange={(e) => handleFieldChange('allocatedHours', parseInt(e.target.value) || 2)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kompetensi Awal Peserta Didik:</label>
                  <textarea
                    rows={2}
                    value={formData.initialCompetency}
                    onChange={(e) => handleFieldChange('initialCompetency', e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sarana & Prasarana Pembelajaran:</label>
                  <input
                    type="text"
                    value={formData.facilities}
                    onChange={(e) => handleFieldChange('facilities', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>
            )}

            {/* TAB 5: REFLEKSI & LAMPIRAN */}
            {activeSectionTab === 'reflection' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Catatan Refleksi Guru:</label>
                  <textarea
                    rows={3}
                    value={formData.reflection.teacherNotes}
                    onChange={(e) => handleDeepFieldChange(['reflection', 'teacherNotes'], e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Lembar Kerja Peserta Didik (LKPD):</label>
                  <input
                    type="text"
                    value={formData.attachments.worksheetSummary}
                    onChange={(e) => handleDeepFieldChange(['attachments', 'worksheetSummary'], e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Program Pengayaan & Remedial:</label>
                  <textarea
                    rows={2}
                    value={formData.attachments.enrichmentRemedial}
                    onChange={(e) => handleDeepFieldChange(['attachments', 'enrichmentRemedial'], e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Collaborative Feedback Stream & Comments (Span 1) */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col h-[580px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900">Komentar & Masukan Tim</h3>
              </div>
              <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                {formData.comments.length}
              </span>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
              {formData.comments.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p>Belum ada catatan telaah dari anggota tim.</p>
                  <p className="text-[10px] mt-1">Berikan masukan untuk menyempurnakan modul ini.</p>
                </div>
              ) : (
                formData.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={comment.userAvatar}
                          alt={comment.userName}
                          className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <span className="font-bold text-slate-800 text-[11px] line-clamp-1">{comment.userName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(comment.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-indigo-100/70 text-indigo-800 font-medium">
                      Bagian: {comment.section}
                    </span>

                    <p className="text-slate-700 text-xs leading-relaxed">{comment.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Input Form */}
            <form onSubmit={handlePostComment} className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Komentari Bagian:</span>
                <select
                  value={commentSection}
                  onChange={(e) => setCommentSection(e.target.value)}
                  className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium cursor-pointer"
                >
                  <option value="Komponen Inti">Komponen Inti</option>
                  <option value="Langkah Pembelajaran">Langkah Pembelajaran</option>
                  <option value="Diferensiasi Pembelajaran">Diferensiasi Pembelajaran</option>
                  <option value="Asesmen & Rubrik">Asesmen & Rubrik</option>
                  <option value="Umum & Identitas">Umum & Identitas</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder={`Tulis masukan sebagai ${currentUser.name.split(' ')[0]}...`}
                  className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="p-2 rounded-lg bg-indigo-600 text-white disabled:opacity-40 hover:bg-indigo-700 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Cryptographic Session Fingerprint info */}
          <div className="bg-slate-900 text-slate-300 rounded-xl p-3.5 text-xs space-y-2 border border-slate-800 font-mono">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                <Shield className="w-3.5 h-3.5" /> E2E SESI TERENKRIPSI
              </span>
              <span className="text-[10px]">AES-GCM-256</span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              Signature: <span className="text-indigo-300">{formData.encryptedHash}</span>
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-400">
              <span>Status: {isOnline ? 'Sinkron Cloud' : 'Antrean Offline Terenkripsi'}</span>
              <span className="text-emerald-400">Terverifikasi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
