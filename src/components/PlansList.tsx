import React, { useState } from 'react';
import { Search, Filter, FileText, Download, Eye, Edit3, CheckCircle, Clock, AlertTriangle, Shield, Users, ArrowUpRight, Sparkles } from 'lucide-react';
import { LessonPlan, PlanStatus, User } from '../types';

interface PlansListProps {
  plans: LessonPlan[];
  currentUser: User;
  onSelectPlan: (plan: LessonPlan) => void;
  onExportPdf: (plan: LessonPlan) => void;
  onPreviewPlan: (plan: LessonPlan) => void;
  onUpdateStatus: (planId: string, status: PlanStatus) => void;
  onCreateNewPlan: () => void;
}

export const PlansList: React.FC<PlansListProps> = ({
  plans,
  currentUser,
  onSelectPlan,
  onExportPdf,
  onPreviewPlan,
  onUpdateStatus,
  onCreateNewPlan,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');

  const subjects = ['Semua', ...Array.from(new Set(plans.map((p) => p.subject)))];
  const statuses = ['Semua', 'Draft', 'Dalam Review', 'Disetujui', 'Revisi'];

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'Semua' || plan.subject === selectedSubject;
    const matchesStatus = selectedStatus === 'Semua' || plan.status === selectedStatus;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const getStatusBadge = (status: PlanStatus) => {
    switch (status) {
      case 'Disetujui':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" /> Disetujui Waka
          </span>
        );
      case 'Dalam Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Dalam Review Tim
          </span>
        );
      case 'Revisi':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5" /> Perlu Revisi
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Edit3 className="w-3.5 h-3.5" /> Draf Mandiri
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Stats Overview */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/20">
                Pusat Penyusunan RPP Digital Terpadu
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/20">
                Enkripsi Aktif
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Manajemen Rencana Pembelajaran</h1>
            <p className="text-indigo-200 text-sm mt-1 max-w-2xl">
              Susun Modul Ajar dan RPP secara kolaboratif antar guru MGMP dengan sinkronisasi instan, ekspor dokumen resmi PDF, dan verifikasi mutu kurikulum.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="btn-banner-new"
              onClick={onCreateNewPlan}
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-sm shadow-md hover:bg-indigo-50 transition cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Buat Rencana Baru
            </button>
          </div>
        </div>

        {/* Quick summary numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-indigo-700/50 text-xs">
          <div>
            <p className="text-indigo-300">Total Modul Aktif</p>
            <p className="text-xl font-extrabold text-white mt-0.5">{plans.length} Modul</p>
          </div>
          <div>
            <p className="text-indigo-300">Disetujui Waka</p>
            <p className="text-xl font-extrabold text-emerald-300 mt-0.5">
              {plans.filter((p) => p.status === 'Disetujui').length} Modul
            </p>
          </div>
          <div>
            <p className="text-indigo-300">Dalam Review Tim</p>
            <p className="text-xl font-extrabold text-amber-300 mt-0.5">
              {plans.filter((p) => p.status === 'Dalam Review').length} Modul
            </p>
          </div>
          <div>
            <p className="text-indigo-300">Standar Kurikulum</p>
            <p className="text-xl font-extrabold text-white mt-0.5">Merdeka & K13</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="input-search-plans"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan topik, mata pelajaran, kode dokumen, atau penyusun..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Mapel:</span>
            <select
              id="select-filter-subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <span>Status:</span>
            <select
              id="select-filter-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Plans List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredPlans.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-700">Tidak ada modul yang cocok dengan kriteria filter</p>
            <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci pencarian yang berbeda atau reset filter.</p>
          </div>
        ) : (
          filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition flex flex-col justify-between p-5 group"
            >
              <div>
                {/* Header line */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {plan.code}
                      </span>
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {plan.phase} • {plan.grade}
                      </span>
                      <span className="text-xs font-semibold text-indigo-900">{plan.subject}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                      {plan.title}
                    </h3>
                  </div>
                  <div>{getStatusBadge(plan.status)}</div>
                </div>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  <span className="font-semibold text-slate-700">Topik:</span> {plan.topic} • {plan.meaningfulUnderstanding}
                </p>

                {/* Profil Pelajar Pancasila tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {plan.pancasilaProfiles.map((p) => (
                    <span
                      key={p}
                      className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full"
                    >
                      {p}
                    </span>
                  ))}
                  <span className="text-[11px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                    {plan.learningModel.split(' ')[0]}
                  </span>
                </div>

                {/* Meta info & Collaborators */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        plan.authorId === 'user_1'
                          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
                          : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
                      }
                      alt={plan.authorName}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span>{plan.authorName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {plan.comments.length > 0 && (
                      <span className="text-xs text-slate-500 flex items-center gap-1" title="Komentar Masukan">
                        💬 {plan.comments.length}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400">v{plan.version}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <button
                    id={`btn-open-editor-${plan.id}`}
                    onClick={() => onSelectPlan(plan)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Studio Kolaborasi
                  </button>

                  <button
                    id={`btn-preview-plan-${plan.id}`}
                    onClick={() => onPreviewPlan(plan)}
                    className="p-1.5 rounded-lg text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                    title="Pratinjau Modul Ajar"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    id={`btn-export-pdf-${plan.id}`}
                    onClick={() => onExportPdf(plan)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1 cursor-pointer"
                    title="Unduh Berkas Resmi PDF Kurikulum"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    <span className="hidden sm:inline">Ekspor PDF</span>
                  </button>
                </div>

                {/* Quick Status Control for Waka or Author */}
                {currentUser.role === 'Waka Kurikulum' ? (
                  <select
                    value={plan.status}
                    onChange={(e) => onUpdateStatus(plan.id, e.target.value as PlanStatus)}
                    className="text-xs font-semibold px-2 py-1 rounded-md border border-slate-200 bg-slate-50 text-slate-800 cursor-pointer"
                  >
                    <option value="Draft">Draf</option>
                    <option value="Dalam Review">Ajukan Review</option>
                    <option value="Disetujui">Sahkan (Disetujui)</option>
                    <option value="Revisi">Minta Revisi</option>
                  </select>
                ) : (
                  plan.status === 'Draft' && (
                    <button
                      onClick={() => onUpdateStatus(plan.id, 'Dalam Review')}
                      className="text-xs font-medium text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md transition cursor-pointer"
                    >
                      Ajukan Review Tim
                    </button>
                  )
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
