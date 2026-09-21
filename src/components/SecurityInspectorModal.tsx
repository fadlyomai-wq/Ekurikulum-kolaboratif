import React from 'react';
import { X, ShieldCheck, Lock, Key, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';
import { SecuritySession } from '../types';

interface SecurityInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: SecuritySession;
  onRotateKey: () => void;
}

export const SecurityInspectorModal: React.FC<SecurityInspectorModalProps> = ({
  isOpen,
  onClose,
  session,
  onRotateKey,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm">Inspektor Keamanan Sesi Kriptografi</h3>
              <p className="text-[10px] text-slate-400">Proteksi Enkripsi Sesi Pengguna Real-Time</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-900">Sesi Terenkripsi End-to-End Aktif</p>
              <p className="text-emerald-700 text-[11px] mt-0.5 leading-relaxed">
                Koneksi browser Anda diproteksi oleh cipher AES-256-GCM terotentikasi. Data rencana pembelajaran tidak dapat diakses pihak ketiga di luar tim sekolah.
              </p>
            </div>
          </div>

          <div className="space-y-2 font-mono text-[11px] bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Algoritma:</span>
              <span className="font-bold text-slate-900">{session.cipherAlgorithm}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ID Sesi:</span>
              <span className="text-indigo-700 font-bold">{session.sessionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Kunci Fingerprint:</span>
              <span className="text-emerald-700 font-bold truncate max-w-[200px]">{session.keyFingerprint}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Kedaluwarsa:</span>
              <span>{new Date(session.expiresAt).toLocaleTimeString('id-ID')}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                onRotateKey();
              }}
              className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold hover:bg-indigo-100 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Rotasi Kunci Sekarang</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
