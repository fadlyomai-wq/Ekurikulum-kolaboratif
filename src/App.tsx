/**
 * KurikulumLink - Platform Manajemen Kurikulum & Rencana Pembelajaran Kolaboratif
 * Real-time sync, PDF export, offline vault, student progress analytics,
 * session encryption, and third-party education API hub.
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { NavigationTabs, AppTab } from './components/NavigationTabs';
import { PlansList } from './components/PlansList';
import { CollaborativeEditor } from './components/CollaborativeEditor';
import { StudentAnalyticsDashboard } from './components/StudentAnalyticsDashboard';
import { OfflineVaultManager } from './components/OfflineVaultManager';
import { SecuritySessionManager } from './components/SecuritySessionManager';
import { ApiIntegrationHub } from './components/ApiIntegrationHub';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { NewPlanModal } from './components/NewPlanModal';
import { SecurityInspectorModal } from './components/SecurityInspectorModal';
import { NotificationToast } from './components/NotificationToast';

import {
  INITIAL_USERS,
  INITIAL_PLANS,
  INITIAL_NOTIFICATIONS,
  INITIAL_STUDENT_METRICS,
  INITIAL_API_INTEGRATIONS,
  INITIAL_SECURITY_SESSION,
} from './data/mockData';

import { LessonPlan, User, PlanStatus, CollaborativeComment, TeamNotification, SecuritySession, ApiIntegrationConfig } from './types';
import { generateLessonPlanPdf } from './utils/pdfExport';
import {
  savePlansToOfflineVault,
  getPlansFromOfflineVault,
  queueOfflineAction,
  getOfflineActionQueue,
  clearOfflineActionQueue,
  OfflineAction,
} from './utils/offlineStorage';

export default function App() {
  // 1. Core State
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [plans, setPlans] = useState<LessonPlan[]>(() => {
    const cached = getPlansFromOfflineVault();
    return cached && cached.length > 0 ? cached : INITIAL_PLANS;
  });
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan>(plans[0]);
  const [activeTab, setActiveTab] = useState<AppTab>('plans');

  // 2. Connectivity & Sync State
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingActions, setPendingActions] = useState<OfflineAction[]>(() => getOfflineActionQueue());

  // 3. Notifications State
  const [notifications, setNotifications] = useState<TeamNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeToast, setActiveToast] = useState<TeamNotification | null>(null);

  // 4. Modals
  const [previewPlan, setPreviewPlan] = useState<LessonPlan | null>(null);
  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = useState<boolean>(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);

  // 5. Analytics, Security & API Integrations
  const [securitySession, setSecuritySession] = useState<SecuritySession>(INITIAL_SECURITY_SESSION);
  const [apiIntegrations, setApiIntegrations] = useState<ApiIntegrationConfig[]>(INITIAL_API_INTEGRATIONS);

  // Save to offline vault whenever plans change
  useEffect(() => {
    savePlansToOfflineVault(plans);
  }, [plans]);

  // Real-time notification broadcaster helper
  const broadcastNotification = (newNotif: Omit<TeamNotification, 'id' | 'timestamp' | 'read'>) => {
    const notif: TeamNotification = {
      ...newNotif,
      id: 'notif_' + Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
    setActiveToast(notif);
  };

  // Plan Selection & Editing
  const handleSelectPlan = (plan: LessonPlan) => {
    setSelectedPlan(plan);
    setActiveTab('editor');
  };

  const handleSavePlan = (updatedPlan: LessonPlan) => {
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    setSelectedPlan(updatedPlan);

    if (isOnline) {
      broadcastNotification({
        title: 'Modul Disinkronkan Real-Time',
        message: `${currentUser.name} memperbarui konten modul "${updatedPlan.title}".`,
        type: 'update',
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar,
        planId: updatedPlan.id,
        planTitle: updatedPlan.title,
      });
    } else {
      const action = queueOfflineAction({
        type: 'SAVE_PLAN',
        planId: updatedPlan.id,
        data: updatedPlan,
      });
      if (action) {
        setPendingActions((prev) => [...prev, action]);
      }
      setActiveToast({
        id: 'toast_off_' + Date.now(),
        title: 'Tersimpan di Vault Offline',
        message: 'Perubahan disimpan aman di perangkat Anda dan akan disinkronkan saat online.',
        type: 'sync',
        timestamp: new Date().toISOString(),
        read: false,
        authorName: 'Local Vault Manager',
      });
    }
  };

  // Status changes (e.g. Waka approves or teacher submits)
  const handleUpdateStatus = (planId: string, newStatus: PlanStatus) => {
    const targetPlan = plans.find((p) => p.id === planId);
    if (!targetPlan) return;

    const updatedPlan: LessonPlan = {
      ...targetPlan,
      status: newStatus,
      lastModified: new Date().toISOString(),
      history: [
        {
          id: 'hist_' + Date.now(),
          version: targetPlan.version,
          modifiedBy: currentUser.name,
          timestamp: new Date().toISOString(),
          summary: `Status dokumen diubah menjadi "${newStatus}" oleh ${currentUser.name} (${currentUser.role}).`,
        },
        ...targetPlan.history,
      ],
    };

    setPlans((prev) => prev.map((p) => (p.id === planId ? updatedPlan : p)));
    if (selectedPlan.id === planId) {
      setSelectedPlan(updatedPlan);
    }

    broadcastNotification({
      title: newStatus === 'Disetujui' ? 'Modul Ajar Resmi Disahkan' : 'Pembaruan Status Modul',
      message: `${currentUser.name} (${currentUser.role}) mengubah status modul "${targetPlan.title}" menjadi ${newStatus}.`,
      type: newStatus === 'Disetujui' ? 'approval' : 'update',
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      planId: targetPlan.id,
      planTitle: targetPlan.title,
    });
  };

  // Collaborative Comments
  const handleAddComment = (
    planId: string,
    commentData: Omit<CollaborativeComment, 'id' | 'timestamp' | 'resolved'>
  ) => {
    const newComment: CollaborativeComment = {
      ...commentData,
      id: 'comm_' + Date.now(),
      timestamp: new Date().toISOString(),
      resolved: false,
    };

    setPlans((prev) =>
      prev.map((p) => {
        if (p.id === planId) {
          return {
            ...p,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );

    if (selectedPlan.id === planId) {
      setSelectedPlan((prev) => ({
        ...prev,
        comments: [...prev.comments, newComment],
      }));
    }

    broadcastNotification({
      title: 'Masukan Telaah Baru',
      message: `${commentData.userName} memberikan catatan pada bagian "${commentData.section}".`,
      type: 'comment',
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      planId,
    });
  };

  // Create new lesson plan
  const handleCreateNewPlan = (newPlan: LessonPlan) => {
    setPlans((prev) => [newPlan, ...prev]);
    setSelectedPlan(newPlan);
    setActiveTab('editor');

    broadcastNotification({
      title: 'Modul Ajar Baru Diinisiasi',
      message: `${currentUser.name} membuat modul baru "${newPlan.title}" (${newPlan.subject}).`,
      type: 'update',
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      planId: newPlan.id,
      planTitle: newPlan.title,
    });
  };

  // PDF Export
  const handleExportPdf = (planToExport: LessonPlan) => {
    try {
      const doc = generateLessonPlanPdf(planToExport);
      doc.save(`${planToExport.code}_${planToExport.subject}_${planToExport.grade}.pdf`);
      
      broadcastNotification({
        title: 'Ekspor PDF Kurikulum Berhasil',
        message: `Dokumen ${planToExport.code} (${planToExport.title}) berhasil diekspor ke format PDF resmi.`,
        type: 'sync',
        authorName: 'Sistem Ekspor PDF',
      });
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Gagal mengekspor PDF. Silakan gunakan fitur Cetak dari Pratinjau Dokumen.');
    }
  };

  // Sync reconciling
  const handleManualSync = async () => {
    if (!isOnline || isSyncing) return;
    setIsSyncing(true);

    setTimeout(() => {
      clearOfflineActionQueue();
      setPendingActions([]);
      setIsSyncing(false);

      broadcastNotification({
        title: 'Sinkronisasi Cloud Selesai',
        message: 'Seluruh antrean perubahan data modul berhasil disinkronkan dengan basis data pusat.',
        type: 'sync',
        authorName: 'Sistem Sinkronisasi',
      });
    }, 1000);
  };

  const handleToggleOnline = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);

    if (nextState) {
      // Reconnected! Trigger sync if queue has items
      if (pendingActions.length > 0) {
        handleManualSync();
      } else {
        setActiveToast({
          id: 'toast_on_' + Date.now(),
          title: 'Koneksi Pulih (Online)',
          message: 'Terhubung kembali ke server. Sinkronisasi real-time kembali aktif.',
          type: 'sync',
          timestamp: new Date().toISOString(),
          read: false,
          authorName: 'Konektivitas',
        });
      }
    } else {
      setActiveToast({
        id: 'toast_off_sim_' + Date.now(),
        title: 'Mode Offline Aktif',
        message: 'Simulasi mode offline. Dokumen tetap dapat disunting dan tersimpan di browser.',
        type: 'sync',
        timestamp: new Date().toISOString(),
        read: false,
        authorName: 'Konektivitas',
      });
    }
  };

  // API Integration trigger
  const handleTriggerApiSync = async (integrationId: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setApiIntegrations((prev) =>
          prev.map((item) =>
            item.id === integrationId
              ? {
                  ...item,
                  status: 'Terkoneksi',
                  lastSync: new Date().toISOString(),
                  syncedCount: item.syncedCount + plans.length,
                }
              : item
          )
        );
        resolve();
      }, 1000);
    });
  };

  const collaboratorsOnlineCount = allUsers.filter((u) => u.isOnline).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 1. Header / Navbar */}
      <Navbar
        currentUser={currentUser}
        allUsers={allUsers}
        onSelectUser={setCurrentUser}
        isOnline={isOnline}
        onToggleOnline={handleToggleOnline}
        isSyncing={isSyncing}
        onManualSync={handleManualSync}
        pendingOfflineCount={pendingActions.length}
        notifications={notifications}
        onMarkNotificationRead={(id) => {
          setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
        }}
        onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
        onCreateNewPlan={() => setIsNewPlanModalOpen(true)}
      />

      {/* 2. Navigation Tabs */}
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activePlanTitle={selectedPlan?.title}
        collaboratorsOnlineCount={collaboratorsOnlineCount}
      />

      {/* 3. Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'plans' && (
          <PlansList
            plans={plans}
            currentUser={currentUser}
            onSelectPlan={handleSelectPlan}
            onExportPdf={handleExportPdf}
            onPreviewPlan={(p) => setPreviewPlan(p)}
            onUpdateStatus={handleUpdateStatus}
            onCreateNewPlan={() => setIsNewPlanModalOpen(true)}
          />
        )}

        {activeTab === 'editor' && (
          <CollaborativeEditor
            plan={selectedPlan}
            currentUser={currentUser}
            allUsers={allUsers}
            isOnline={isOnline}
            onSavePlan={handleSavePlan}
            onExportPdf={handleExportPdf}
            onPreviewPlan={(p) => setPreviewPlan(p)}
            onAddComment={handleAddComment}
          />
        )}

        {activeTab === 'analytics' && (
          <StudentAnalyticsDashboard metrics={INITIAL_STUDENT_METRICS} />
        )}

        {activeTab === 'offline' && (
          <OfflineVaultManager
            isOnline={isOnline}
            onToggleOnline={handleToggleOnline}
            pendingActions={pendingActions}
            onForceSync={handleManualSync}
            isSyncing={isSyncing}
            plans={plans}
          />
        )}

        {activeTab === 'security' && (
          <SecuritySessionManager
            session={securitySession}
            onSessionUpdated={setSecuritySession}
          />
        )}

        {activeTab === 'integrations' && (
          <ApiIntegrationHub
            integrations={apiIntegrations}
            onTriggerSync={handleTriggerApiSync}
            onUpdateConfig={(updated) => {
              setApiIntegrations((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
            }}
          />
        )}
      </main>

      {/* 4. Modals & Notifications */}
      <DocumentPreviewModal
        plan={previewPlan}
        onClose={() => setPreviewPlan(null)}
        onExportPdf={handleExportPdf}
      />

      <NewPlanModal
        isOpen={isNewPlanModalOpen}
        onClose={() => setIsNewPlanModalOpen(false)}
        currentUser={currentUser}
        onCreatePlan={handleCreateNewPlan}
      />

      <SecurityInspectorModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        session={securitySession}
        onRotateKey={() => {
          setSecuritySession((prev) => ({
            ...prev,
            keyFingerprint: 'A4:91:FE:33:02:88...7E11',
            createdAt: new Date().toISOString(),
          }));
        }}
      />

      <NotificationToast
        notification={activeToast}
        onClose={() => setActiveToast(null)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 KurikulumLink — Platform Kolaboratif RPP & Manajemen Kurikulum Digital Indonesia.</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Standar Kurikulum Merdeka</span>
            <span>•</span>
            <span>Enkripsi AES-256-GCM</span>
            <span>•</span>
            <span>Offline-First Sync</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
