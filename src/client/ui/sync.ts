import type { SyncResult } from '../types/index.js';

export interface SyncOptions {
  onSyncComplete: (result: SyncResult) => void;
  onSyncError: (error: Error) => void;
}

/**
 * Initialize the sync button functionality.
 */
export function initSyncButton(options: SyncOptions): void {
  const syncBtn = document.querySelector('.sync-btn') as HTMLButtonElement | null;
  const statusEl = document.querySelector('.status');

  if (!syncBtn || !statusEl) {
    console.warn('Sync button or status element not found');
    return;
  }

  syncBtn.addEventListener('click', async () => {
    syncBtn.disabled = true;
    statusEl.textContent = 'Syncing...';

    try {
      const res = await fetch('/api/sync', { method: 'POST' });
      if (!res.ok) {
        throw new Error('Sync failed');
      }
      const data = (await res.json()) as SyncResult;
      statusEl.textContent = `+${data.added} activities (${data.total} total)`;
      options.onSyncComplete(data);
    } catch (err) {
      statusEl.textContent = 'Sync failed';
      options.onSyncError(err as Error);
    } finally {
      syncBtn.disabled = false;
    }
  });
}
