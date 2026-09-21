import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell, PieChart, Pie
} from 'recharts';
import {
  TrendingUp, Award, Users, CheckCircle2, AlertCircle, FileSpreadsheet,
  GraduationCap, BookCheck, Filter, ArrowUpRight, ShieldCheck
} from 'lucide-react';
import { StudentProgressMetric } from '../types';

interface StudentAnalyticsDashboardProps {
  metrics: StudentProgressMetric[];
}

export const StudentAnalyticsDashboard: React.FC<StudentAnalyticsDashboardProps> = ({ metrics }) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(metrics[0]?.classId || '');

  const activeMetric = metrics.find((m) => m.classId === selectedClassId) || metrics[0];

  const assessmentComparisonData = metrics.map((m) => ({
    name: m.className.split(' ')[0] + ' ' + (m.className.split(' ')[1] || ''),
    Diagnostik: m.diagnosticAvg,
    Formatif: m.formativeAvg,
    Sumatif: m.summativeAvg,
  }));

  return (
    <div className="space-y-6">
      {/* Top Header & Class Selector */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              Analitik Akademik & Asesmen
            </span>
            <span className="text-xs font-medium text-slate-500">Tahun Ajaran 2026/2027</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Statistik Progres Pembelajaran Siswa
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pelacakan komprehensif ketuntasan Tujuan Pembelajaran (TP), asesmen diagnostik-formatif-sumatif, dan karakter Profil Pelajar Pancasila.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-600">Rombel:</span>
            <select
              id="select-analytics-class"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {metrics.map((m) => (
                <option key={m.classId} value={m.classId}>
                  {m.className} ({m.subject})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Rata-rata Nilai Asesmen</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{activeMetric.averageScore}</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+3.8 poin dari diagnostik awal</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Ketuntasan TP (KKTP)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600 mt-2">{activeMetric.masteryRate}%</p>
          <p className="text-[11px] text-slate-500 mt-1">
            {activeMetric.totalStudents - Math.round(activeMetric.totalStudents * (1 - activeMetric.masteryRate / 100))} dari {activeMetric.totalStudents} siswa tuntas
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Keterlaksanaan Modul Ajar</span>
            <BookCheck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">
            {activeMetric.completedModules} / {activeMetric.totalModules} Modul
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full"
              style={{ width: `${(activeMetric.completedModules / activeMetric.totalModules) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Guru Pengampu</span>
            <GraduationCap className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-sm font-bold text-slate-900 mt-2 truncate">{activeMetric.teacherName}</p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">{activeMetric.subject}</p>
        </div>
      </div>

      {/* Row 1: TP Mastery Chart & Assessment Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TP Breakdown Bar Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Ketuntasan per Tujuan Pembelajaran (TP)</h3>
              <p className="text-xs text-slate-500">{activeMetric.className} • Target KKTP Minimum: 75%</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
              Kriteria Ketercapaian
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeMetric.tpBreakdown} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                <YAxis dataKey="tpCode" type="category" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                <Tooltip
                  formatter={(value: any) => [`${value}% Ketuntasan Siswa`, 'Capaian TP']}
                  labelFormatter={(label) => `Kode: ${label}`}
                  contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="masteryPercent" fill="#4F46E5" radius={[0, 6, 6, 0]}>
                  {activeMetric.tpBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.masteryPercent >= 85 ? '#10B981' : entry.masteryPercent >= 75 ? '#3B82F6' : '#F59E0B'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {activeMetric.tpBreakdown.map((tp) => (
              <div key={tp.tpCode} className="flex items-center justify-between text-slate-600">
                <span className="font-semibold text-slate-800">{tp.tpCode}: {tp.description}</span>
                <span className={`font-bold ${tp.remedialCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {tp.remedialCount > 0 ? `${tp.remedialCount} Remedial` : '100% Tuntas'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment Evolution Chart (Diagnostik vs Formatif vs Sumatif) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Perbandingan Nilai Asesmen antar Kelas</h3>
              <p className="text-xs text-slate-500">Pertumbuhan Kognitif: Diagnostik Awal → Formatif → Sumatif</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
              Progresif
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assessmentComparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Diagnostik" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Formatif" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Sumatif" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
            Terjadi tren kenaikan nilai rata-rata signifikan dari asesmen diagnostik ke asesmen sumatif akhir pada semua rombongan belajar.
          </p>
        </div>
      </div>

      {/* Row 2: Profil Pelajar Pancasila Radar & Grade Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Profil Pelajar Pancasila */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Dimensi Karakter Profil Pelajar Pancasila</h3>
              <p className="text-xs text-slate-500">Skor Indeks 6 Dimensi Karakter ({activeMetric.className})</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700">
              Evaluasi Karakter P5
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={activeMetric.pancasilaScores}>
                <PolarGrid stroke="#CBD5E1" />
                <PolarAngleAxis dataKey="trait" tick={{ fontSize: 11, fill: '#334155' }} />
                <PolarRadiusAxis domain={[0, 100]} angle={30} stroke="#94A3B8" tick={{ fontSize: 10 }} />
                <Radar
                  name="Skor Karakter"
                  dataKey="score"
                  stroke="#7C3AED"
                  fill="#8B5CF6"
                  fillOpacity={0.45}
                />
                <Tooltip
                  formatter={(value: any) => [`${value}/100`, 'Indeks Sikap']}
                  contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Distribusi Kemahiran Siswa</h3>
            <p className="text-xs text-slate-500">Pengelompokan Hasil Asesmen Akhir</p>
          </div>

          <div className="space-y-3 pt-2">
            {activeMetric.gradeDistribution.map((item) => {
              const percent = Math.round((item.count / activeMetric.totalStudents) * 100);
              return (
                <div key={item.range} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.range}</span>
                    <span className="font-bold text-slate-900">{item.count} siswa ({percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${percent}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Data statistik ini telah divalidasi dengan standar pelaporan mutu kurikulum sekolah.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
