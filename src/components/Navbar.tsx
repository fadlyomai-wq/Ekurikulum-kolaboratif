import React, { useState } from 'react';
import { ShieldCheck, Wifi, WifiOff, Bell, RefreshCw, UserCheck, ChevronDown, CheckCircle2, Lock, Download, Plus, AlertCircle, FileText } from 'lucide-react';
import { User, TeamNotification } from '../types';

interface NavbarProps {
  currentUser: User;
  allUsers: User[];
  onSelectUser: (user: User) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  isSyncing: boolean;
  onManualSync: () => void;
  pendingOfflineCount: number;
  notifications: TeamNotification[];
  onMarkNotificationRead: (id: string) => void;
  onOpenSecurityModal: () => void;
  onCreateNewPlan: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  isOnline,
  onToggleOnline,
  isSyncing,
  onManualSync,
  pendingOfflineCount,
  notifications,
  onMarkNotificationRead,
  onOpenSecurityModal,
  onCreateNewPlan,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">KurikulumLink</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  Kurikulum Merdeka
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Sistem Rencana Pembelajaran Kolaboratif & Real-Time E-RPP</p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Encryption badge */}
            <button
              id="btn-security-badge"
              onClick={onOpenSecurityModal}
              title="Keamanan Sesi Terenkripsi AES-256-GCM"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100 transition cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline font-mono">AES-256 Terenkripsi</span>
            </button>

            {/* Online / Offline status toggle */}
            <button
              id="btn-network-toggle"
              onClick={onToggleOnline}
              title={isOnline ? "Klik untuk menguji simulasi mode offline" : "Klik untuk kembali online"}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                isOnline
                  ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  : 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="hidden sm:inline">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                  <span>Mode Offline</span>
                </>
              )}
            </button>

            {/* Sync button / pending offline badge */}
            <button
              id="btn-manual-sync"
              onClick={onManualSync}
              disabled={isSyncing || !isOnline}
              title="Sinkronisasi Perubahan ke Cloud"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                pendingOfflineCount > 0
                  ? 'bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-indigo-600' : ''}`} />
              <span className="hidden md:inline">
                {isSyncing ? 'Sinkronisasi...' : pendingOfflineCount > 0 ? `Sinkron (${pendingOfflineCount})` : 'Tersinkron'}
              </span>
            </button>

            {/* Notifications Tray */}
            <div className="relative">
              <button
                id="btn-notif-toggle"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                title="Notifikasi Tim"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-semibold text-sm text-slate-800">Notifikasi Tim Kurikulum</span>
                    <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                      {unreadCount} baru
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 py-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">Belum ada notifikasi baru.</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => onMarkNotificationRead(notif.id)}
                          className={`p-2.5 rounded-lg transition cursor-pointer hover:bg-slate-50 ${
                            !notif.read ? 'bg-indigo-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="mt-0.5 w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                              <p className="text-xs text-slate-600 mt-0.5">{notif.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {new Date(notif.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} • {notif.authorName}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Create New Plan Button */}
            <button
              id="btn-create-new-plan"
              onClick={onCreateNewPlan}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Modul Baru</span>
            </button>

            {/* Collaborator Profile Switcher */}
            <div className="relative border-l border-slate-200 pl-2">
              <button
                id="btn-user-switcher"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer text-left"
                title="Ganti Profil Pengguna Kolaborator"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
                />
                <div className="hidden lg:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-500">{currentUser.role}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-400 font-medium">Beralih Pengguna Aktif (Multi-User):</p>
                  </div>
                  <div className="py-1 space-y-1">
                    {allUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSelectUser(u);
                          setShowUserMenu(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs transition cursor-pointer ${
                          u.id === currentUser.id ? 'bg-indigo-50 text-indigo-950 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                        <div className="flex-1">
                          <p className="text-xs leading-snug">{u.name}</p>
                          <span className="text-[10px] text-slate-500">{u.role} ({u.subject})</span>
                        </div>
                        {u.id === currentUser.id && <UserCheck className="w-4 h-4 text-indigo-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
