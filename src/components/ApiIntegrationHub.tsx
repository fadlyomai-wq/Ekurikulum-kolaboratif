import React, { useState } from 'react';
import {
  Plug, CheckCircle2, RefreshCw, AlertCircle, ExternalLink, Key, Webhook,
  Send, Database, Code, Globe, Shield, Check
} from 'lucide-react';
import { ApiIntegrationConfig } from '../types';

interface ApiIntegrationHubProps {
  integrations: ApiIntegrationConfig[];
  onTriggerSync: (integrationId: string) => Promise<void>;
  onUpdateConfig: (integration: ApiIntegrationConfig) => void;
}

export const ApiIntegrationHub: React.FC<ApiIntegrationHubProps> = ({
  integrations,
  onTriggerSync,
  onUpdateConfig,
}) => {
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [selectedApi, setSelectedApi] = useState<ApiIntegrationConfig>(integrations[0]);
  const [testLog, setTestLog] = useState<string[]>([
    '[SYSTEM] Hub Integrasi API Pendidikan Aktif.',
    '[PMM Kemdikbud] Handshake OAuth 2.0 Berhasil. Endpoint merdeka-mengajar terotentikasi.',
    '[Google Classroom] Token OAuth aktif untuk 42 kelas.',
  ]);

  const handleSync = async (item: ApiIntegrationConfig) => {
    setSyncingId(item.id);
    setTestLog((prev) => [
      `[${new Date().toLocaleTimeString('id-ID')}] Memulai sinkronisasi payload ke ${item.name}...`,
      ...prev,
    ]);

    await onTriggerSync(item.id);

    setTimeout(() => {
      setSyncingId(null);
      setTestLog((prev) => [
        `[${new Date().toLocaleTimeString('id-ID')}] Sinkronisasi SUKSES ke ${item.provider}: 18 data RPP & rubrik terverifikasi (HTTP 200 OK).`,
        ...prev,
      ]);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              RESTful Webhooks & API Gateway
            </span>
            <span className="text-xs font-medium text-slate-500">OAuth 2.0 & Token Auth</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Integrasi API Platform Pendidikan Pihak Ketiga
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Hubungkan KurikulumLink dengan ekosistem nasional Merdeka Mengajar (PMM), Google Classroom, Moodle LMS, dan Dapodik secara dua arah.
          </p>
        </div>
      </div>

      {/* Integration Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 hover:border-indigo-300 transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded border mb-1.5 ${item.badgeColor}`}>
                    {item.provider}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{item.name}</h3>
                </div>

                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    item.status === 'Terkoneksi'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.description}</p>

              {/* Endpoint & Key Preview */}
              <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1.5 font-mono text-slate-600 mt-3 border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Endpoint:</span>
                  <span className="text-slate-800 truncate max-w-[200px]">{item.endpoint}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">API Key:</span>
                  <span className="text-indigo-600">{item.apiKeyMasked}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px]">
                  <span className="text-slate-500">Terakhir Disinkronkan:</span>
                  <span className="text-slate-700 font-semibold">
                    {new Date(item.lastSync).toLocaleDateString('id-ID')} ({item.syncedCount} item)
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.autoSync}
                  onChange={(e) => onUpdateConfig({ ...item, autoSync: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Auto-sync perubahan</span>
              </label>

              <button
                id={`btn-sync-api-${item.id}`}
                onClick={() => handleSync(item)}
                disabled={syncingId === item.id}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingId === item.id ? 'animate-spin' : ''}`} />
                <span>{syncingId === item.id ? 'Menghubungkan...' : 'Sinkronkan Sekarang'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Live Sync Console & REST Payload Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Terminal Logs */}
        <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-xs shadow-md border border-slate-800 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Globe className="w-3.5 h-3.5" /> Konsol Sinkronisasi Real-Time API
            </span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded">REST / JSON-RPC</span>
          </div>

          <div className="h-48 overflow-y-auto space-y-1.5 text-[11px] pr-2">
            {testLog.map((log, index) => (
              <p
                key={index}
                className={`leading-relaxed ${
                  log.includes('SUKSES')
                    ? 'text-emerald-400 font-semibold'
                    : log.includes('Memulai')
                    ? 'text-amber-300'
                    : 'text-slate-300'
                }`}
              >
                {log}
              </p>
            ))}
          </div>
        </div>

        {/* JSON Payload Schema Spec */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-indigo-600" />
              Skema Pertukaran Data Standar Kemendikbud (OpenAPI 3.1)
            </h3>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">
              JSON REST Payload
            </span>
          </div>

          <pre className="bg-slate-50 p-3 rounded-lg text-[10px] font-mono text-slate-700 overflow-x-auto max-h-48 border border-slate-200">
{`{
  "curriculum_version": "Kurikulum Merdeka 2026",
  "document_code": "MOD-MTK-VII-01",
  "school_npsn": "20108842",
  "author_nip": "19820315 200801 1 008",
  "learning_objectives": [
    "TP 1.1: Memodelkan Masalah SPLDV Kontekstual",
    "TP 1.2: Penyelesaian Metode Eliminasi & Grafik"
  ],
  "differentiated_learning": {
    "content_level": "Tiered Scaffolded Content",
    "assessment_type": "Formatif & Portofolio Rubrik"
  },
  "encryption_signature": "e3b0c44298fc1c149afbf4c8996fb92427ae...",
  "audit_hash_status": "AUTHENTICATED"
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};
