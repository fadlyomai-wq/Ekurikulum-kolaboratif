import React from 'react';
import { FileText, Users, BarChart3, HardDrive, ShieldCheck, Plug, Radio } from 'lucide-react';

export type AppTab = 'plans' | 'editor' | 'analytics' | 'offline' | 'security' | 'integrations';

interface NavigationTabsProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  activePlanTitle?: string;
  collaboratorsOnlineCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  activePlanTitle,
  collaboratorsOnlineCount,
}) => {
  const tabs = [
    { id: 'plans' as AppTab, label: 'Katalog Modul Ajar', icon: FileText },
    {
      id: 'editor' as AppTab,
      label: 'Studio Kolaborasi Real-Time',
      icon: Users,
      badge: collaboratorsOnlineCount > 1 ? `${collaboratorsOnlineCount} Aktif` : undefined,
    },
    { id: 'analytics' as AppTab, label: 'Statistik Progres Siswa', icon: BarChart3 },
    { id: 'offline' as AppTab, label: 'Akses Offline & Vault', icon: HardDrive },
    { id: 'security' as AppTab, label: 'Enkripsi & Privasi Sesi', icon: ShieldCheck },
    { id: 'integrations' as AppTab, label: 'Integrasi API Pendidikan', icon: Plug },
  ];

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 animate-pulse">
                    <Radio className="w-2.5 h-2.5" />
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
