import { LessonPlan } from '../types';

const STORAGE_KEY = 'kurikulumlink_encrypted_vault_v1';
const QUEUE_KEY = 'kurikulumlink_offline_action_queue_v1';

export interface OfflineAction {
  id: string;
  type: 'SAVE_PLAN' | 'UPDATE_STATUS' | 'ADD_COMMENT';
  planId: string;
  data: any;
  timestamp: string;
}

export function savePlansToOfflineVault(plans: LessonPlan[]) {
  try {
    const payload = JSON.stringify(plans);
    localStorage.setItem(STORAGE_KEY, payload);
    localStorage.setItem(`${STORAGE_KEY}_timestamp`, new Date().toISOString());
  } catch (error) {
    console.error('Failed to save plans to offline vault:', error);
  }
}

export function getPlansFromOfflineVault(): LessonPlan[] | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as LessonPlan[];
  } catch (error) {
    console.error('Failed to read from offline vault:', error);
    return null;
  }
}

export function queueOfflineAction(action: Omit<OfflineAction, 'id' | 'timestamp'>) {
  try {
    const existingQueue = getOfflineActionQueue();
    const newAction: OfflineAction = {
      ...action,
      id: 'act_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
    };
    existingQueue.push(newAction);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(existingQueue));
    return newAction;
  } catch (e) {
    console.error('Failed to queue offline action', e);
    return null;
  }
}

export function getOfflineActionQueue(): OfflineAction[] {
  try {
    const data = localStorage.getItem(QUEUE_KEY);
    if (!data) return [];
    return JSON.parse(data) as OfflineAction[];
  } catch (e) {
    return [];
  }
}

export function clearOfflineActionQueue() {
  localStorage.removeItem(QUEUE_KEY);
}

export function getStorageStats() {
  const vaultData = localStorage.getItem(STORAGE_KEY) || '';
  const queueData = localStorage.getItem(QUEUE_KEY) || '[]';
  const timestamp = localStorage.getItem(`${STORAGE_KEY}_timestamp`) || new Date().toISOString();
  
  return {
    vaultBytes: new Blob([vaultData]).size,
    pendingQueueCount: JSON.parse(queueData).length,
    lastSaved: timestamp,
  };
}
