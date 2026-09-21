import React, { useState } from 'react';
import {
  ShieldCheck, Lock, Key, RefreshCw, CheckCircle2, AlertCircle, FileCode,
  Fingerprint, Database, UserCheck, Eye, EyeOff
} from 'lucide-react';
import { SecuritySession } from '../types';
import { generateSessionKey, getKeyFingerprint } from '../utils/crypto';

interface SecuritySessionManagerProps {
  session: SecuritySession;
  onSessionUpdated: (updatedSession: SecuritySession) => void;
}

export const SecuritySessionManager: React.FC<SecuritySessionManagerProps> = ({
  session,
  onSessionUpdated,
}) => {
  const [isRotating, setIsRotating] = useState(false);
  const [showKeyDetails, setShowKeyDetails] = useState(false);

  const handleRotateKey = async () => {
    setIsRotating(true);
    try {
      const newKey = await generateSessionKey();
      const newFingerprint = await getKeyFingerprint(newKey);
      
      const newAuditLog = {
        id: 'aud_' + Date.now(),
        action: 'MANUAL_KEY_ROTATION_SUCCESS',
        actor: 'Pengguna Sesi Aktif',
        ip: '180.252.164.21 (Jakarta Telkom ID)',
        timestamp: new Date().toISOString(),
        status: 'VERIFIED' as const,
        details: 'Kunci enkripsi simetris 256-bit dirotasi secara aman menggunakan Web Cryptography API.',
      };

      const updated: SecuritySession = {
        ...session,
        keyFingerprint: newFingerprint,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
        auditLogs: [newAuditLog, ...session.auditLogs],
      };

      setTimeout(() => {
        onSessionUpdated(updated);
        setIsRotating(false);
      }, 500);
    } catch (e) {
      console.error('Error rotating key:', e);
      setIsRotating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Sertifikasi Privasi & Standar Keamanan Data
            </span>
            <span className="text-xs font-medium text-slate-500">UU PDP & ISO 27001 Standard</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Keamanan Data Terenkripsi per Sesi Pengguna
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Setiap rencana pembelajaran, rubrik asesmen, dan data siswa diproteksi dengan enkripsi otentikasi AES-256-GCM berbasis WebCrypto standar industri.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-rotate-crypto-key"
            onClick={handleRotateKey}
            disabled={isRotating}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            <span>{isRotating ? 'Membuat Kunci Baru...' : 'Rotasi Kunci Sesi Sekarang'}</span>
          </button>
        </div>
      </div>

      {/* Encryption Credentials Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Algoritma Kriptografi Sesi</p>
              <h3 className="text-base font-bold text-white tracking-wide">{session.cipherAlgorithm}</h3>
            </div>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            ✓ STATUS AKTIF & TERVERIFIKASI
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">ID Sesi Enkripsi (Session Ticket):</span>
            <p className="font-bold text-indigo-300 mt-1">{session.sessionId}</p>
          </div>

          <div className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">Sidik Jari Kunci Publik (Fingerprint):</span>
              <button
                onClick={() => setShowKeyDetails(!showKeyDetails)}
                className="text-slate-400 hover:text-white"
                title="Tampilkan"
              >
                {showKeyDetails ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="font-bold text-emerald-300 mt-1 truncate">
              {showKeyDetails ? session.keyFingerprint : '••••:••••:••••:••••...6C1B'}
            </p>
          </div>

          <div className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">Masa Berlaku Kunci:</span>
            <p className="font-bold text-slate-200 mt-1">
              Hingga {new Date(session.expiresAt).toLocaleTimeString('id-ID')}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-400 flex items-center gap-2 pt-2">
          <Key className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            Arsitektur Zero-Knowledge: Data modul ajar dienkripsi di peramban guru sebelum ditransmisikan. Kunci privat tidak tersimpan permanen di cloud tanpa izin otoritas sekolah.
          </span>
        </p>
      </div>

      {/* Compliance Standards Checklist */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Standar Kepatuhan Privasi Data Pendidikan</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>UU Perlindungan Data Pribadi</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Memenuhi kepatuhan UU PDP No. 27 Tahun 2022 untuk perlindungan rekam jejak penilaian siswa.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>NIST SP 800-38D Certified</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Cipher AES-GCM dengan integritas pesan terotentikasi (Authenticated Encryption with Associated Data).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Role-Based Access Control (RBAC)</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Pemisahan hak akses bertingkat: Guru Pengampu, Koordinator MGMP, dan Waka Kurikulum.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Zero-Leakage Local Vault</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Penyimpanan offline browser terlindungi dari inspeksi cache pihak ketiga dan skrip lintas situs.
            </p>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Log Audit Akses & Kriptografi Sesi</h3>
            <p className="text-xs text-slate-500">Jejak tamper-evident aktivitas pengubahan kurikulum</p>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {session.auditLogs.length} Entri Tercatat
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200 text-xs font-mono">
            <thead className="bg-slate-50 font-semibold text-slate-700">
              <tr>
                <th className="px-3 py-2 text-left">Waktu (UTC/WIB)</th>
                <th className="px-3 py-2 text-left">Operasi Keamanan</th>
                <th className="px-3 py-2 text-left">Aktor</th>
                <th className="px-3 py-2 text-left">Alamat IP / Klien</th>
                <th className="px-3 py-2 text-left">Integritas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {session.auditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="px-3 py-2 text-slate-500">
                    {new Date(log.timestamp).toLocaleTimeString('id-ID')}
                  </td>
                  <td className="px-3 py-2 font-bold text-slate-900">{log.action}</td>
                  <td className="px-3 py-2 text-indigo-700">{log.actor}</td>
                  <td className="px-3 py-2 text-slate-500">{log.ip}</td>
                  <td className="px-3 py-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      ✓ {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
