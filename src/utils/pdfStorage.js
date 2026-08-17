// High-Performance IndexedDB Storage for PDF Attachments
// Keeps LocalStorage and React state lightweight, preventing UI lag and quota errors.

const DB_NAME = 'SKARION_PDF_STORE';
const DB_VERSION = 1;
const STORE_NAME = 'pdf_blobs';

let dbPromise = null;

function getDB() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (e) => {
      resolve(e.target.result);
    };

    request.onerror = (e) => {
      console.warn('IndexedDB open error:', e);
      resolve(null);
    };
  });

  return dbPromise;
}

// Convert base64 data URL to Blob
export function dataUrlToBlob(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') return null;
  try {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/pdf';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch (e) {
    console.warn('Failed to convert dataUrl to Blob:', e);
    return null;
  }
}

// Create a fast, native browser Blob URL from base64 Data URL
export function createFastBlobUrl(dataUrl) {
  const blob = dataUrlToBlob(dataUrl);
  if (!blob) return dataUrl; // fallback
  return URL.createObjectURL(blob);
}

// Save PDF data to IndexedDB
export async function savePdfToIndexedDb(id, pdfAttachment) {
  if (!id || !pdfAttachment) return;
  try {
    const db = await getDB();
    if (!db) return;

    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({
      id,
      name: pdfAttachment.name,
      size: pdfAttachment.size,
      type: pdfAttachment.type,
      dataUrl: pdfAttachment.dataUrl,
      uploadedAt: pdfAttachment.uploadedAt,
      savedAt: Date.now()
    });
  } catch (err) {
    console.warn('Failed to store PDF in IndexedDB:', err);
  }
}

// Retrieve PDF data from IndexedDB
export async function getPdfFromIndexedDb(id) {
  if (!id) return null;
  try {
    const db = await getDB();
    if (!db) return null;

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('Failed to read PDF from IndexedDB:', err);
    return null;
  }
}

// Remove PDF from IndexedDB
export async function deletePdfFromIndexedDb(id) {
  if (!id) return;
  try {
    const db = await getDB();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
  } catch (err) {
    console.warn('Failed to delete PDF from IndexedDB:', err);
  }
}
