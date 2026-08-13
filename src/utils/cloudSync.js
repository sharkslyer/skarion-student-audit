// SKARION NeonDB PostgreSQL Realtime Sync Engine
// Connects to NeonDB Cloud Database on https://skarion.vercel.app/api/students

export const STORAGE_KEY = 'SKARION_AUDIT_LOG_NEONDB_V25';
export const API_URL = '/api/students';

let broadcastChannel = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  broadcastChannel = new BroadcastChannel('SKARION_NEONDB_CHANNEL');
}

export function broadcastUpdate(students) {
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type: 'STUDENTS_UPDATED', students });
    } catch (e) {
      console.warn('Broadcast error:', e);
    }
  }
}

// Generate an encrypted/encoded shareable URL for instant cross-device state transfer
export function generateShareableUrl(students) {
  try {
    const jsonStr = JSON.stringify(students);
    const encoded = btoa(encodeURIComponent(jsonStr));
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}#sync=${encoded}`;
  } catch (e) {
    console.error('Failed to generate shareable URL', e);
    return window.location.href;
  }
}

// Parse state from shareable URL hash
export function parseStateFromUrl() {
  try {
    const hash = window.location.hash;
    if (hash && hash.includes('#sync=')) {
      const encoded = hash.split('#sync=')[1];
      const jsonStr = decodeURIComponent(atob(encoded));
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse state from URL hash', e);
  }
  return null;
}

// 1. Save Locally
export function saveLocally(students) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    broadcastUpdate(students);
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

// 2. Load Locally
export function loadLocally() {
  try {
    const fromUrl = parseStateFromUrl();
    if (fromUrl) return fromUrl;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('LocalStorage read error:', e);
  }
  return null;
}

// 3. Push to NeonDB PostgreSQL Database
export async function pushToCloudDb(students) {
  saveLocally(students);
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ students })
    });
    return res.ok;
  } catch (e) {
    console.warn('NeonDB push warning:', e);
    return false;
  }
}

// 4. Fetch from NeonDB PostgreSQL Database
export async function fetchFromCloudDb() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && Array.isArray(data.students) && data.students.length > 0) {
      return {
        timestamp: Date.now(),
        students: data.students
      };
    }
  } catch (e) {
    console.warn('NeonDB fetch warning:', e);
  }
  return null;
}
