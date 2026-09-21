import React from 'react';
import {
  HardDrive, Wifi, WifiOff, RefreshCw, ShieldCheck, Database, CheckCircle2,
  Clock, Download, Upload, AlertTriangle, ArrowDownToLine, Zap
} from 'lucide-react';
import { OfflineAction, getStorageStats } from '../utils/offlineStorage';
import { LessonPlan } from '../types';

interface OfflineVaultManagerProps {
  isOnline: boolean;
  onToggleOnline: () => void;
  pendingActions: OfflineAction[];
  onForceSync: () => void;
  isSyncing: boolean;
  plans: LessonPlan[];
}

export const OfflineVaultManager: React.FC<OfflineVaultManagerProps> = ({
  isOnline,
  onToggleOnline,
  pendingActions,
  onForceSync,
  isSyncing,
  plans,
}) => {
  const stats = getStorageStats();

  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(plans, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `KurikulumLink_Backup_Vault_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Offline-First & Local Vault Storage
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              AES-256-GCM
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Akses Offline & Penyimpanan Vault Mandiri
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dukungan penuh penyusunan RPP tanpa koneksi internet (khusus wilayah 3T atau sinyal terbatas). Semua data terenkripsi lokal dan otomatis sinkron saat terhubung kembali.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-toggle-offline-test"
            onClick={onToggleOnline}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
              isOnline
                ? 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
            }`}
          >
            {isOnline ? (
              <>
                <WifiOff className="w-4 h-4 text-amber-600" />
                <span>Simulasikan Mode Offline</span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 text-white" />
                <span>Aktifkan Kembali Online</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Connectivity Status Banner */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition ${
          isOnline
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            : 'bg-amber-50 border-amber-200 text-amber-950'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isOnline ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
            }`}
          >
            {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-sm font-bold">
              {isOnline ? 'Terhubung ke Jaringan Server (Online)' : 'Bekerja dalam Mode Offline Mandiri'}
            </h3>
            <p className="text-xs opacity-80 mt-0.5">
              {isOnline
                ? 'Data modul tersinkronisasi real-time antar rekan guru dengan latensi rendah.'
                : 'Setiap ketikan dan perubahan RPP disimpan aman ke dalam Local Vault terenkripsi browser Anda.'}
            </p>
          </div>
        </div>

        {pendingActions.length > 0 && isOnline && (
          <button
            onClick={onForceSync}
            disabled={isSyncing}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sinkronkan Sekarang ({pendingActions.length})</span>
          </button>
        )}
      </div>

      {/* Vault Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Modul Tersimpan Offline</span>
            <Database className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{plans.length} Modul</p>
          <p className="text-xs text-slate-500">Siap diedit dan diekspor ke PDF kapan pun</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Ukuran Vault Terenkripsi</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600">
            {(stats.vaultBytes / 1024).toFixed(1)} KB
          </p>
          <p className="text-xs text-slate-500">Format JSON aman dengan cipher AES-GCM-256</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Antrean Sinkronisasi Menunggu</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600">{pendingActions.length} Tindakan</p>
          <p className="text-xs text-slate-500">Akan dikirim otomatis saat internet terdeteksi</p>
        </div>
      </div>

      {/* Pending Offline Actions Queue Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Antrean Perubahan Offline (Sync Queue)</h3>
            <p className="text-xs text-slate-500">Daftar aksi yang dieksekusi saat internet terputus</p>
          </div>
          <button
            onClick={handleExportBackup}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Unduh Cadangan Vault (.JSON)</span>
          </button>
        </div>

        {pendingActions.length === 0 ? (
          <div className="py-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200 text-xs text-slate-500">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
            <p className="font-semibold text-slate-700">Semua perubahan telah tersinkronisasi bersih ke server</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Tidak ada antrean tertunda saat ini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 font-semibold text-slate-700">
                <tr>
                  <th className="px-3 py-2 text-left">ID Aksi</th>
                  <th className="px-3 py-2 text-left">Tipe Operasi</th>
                  <th className="px-3 py-2 text-left">Target Dokumen</th>
                  <th className="px-3 py-2 text-left">Waktu Eksekusi</th>
                  <th className="px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {pendingActions.map((action) => (
                  <tr key={action.id}>
                    <td className="px-3 py-2 font-mono text-slate-500">{action.id}</td>
                    <td className="px-3 py-2 font-bold text-indigo-700">{action.type}</td>
                    <td className="px-3 py-2 text-slate-700">{action.planId}</td>
                    <td className="px-3 py-2 text-slate-500">
                      {new Date(action.timestamp).toLocaleTimeString('id-ID')}
                    </td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        Antrean Offline
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
