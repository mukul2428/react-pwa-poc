import { openDB } from 'idb';
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_INDEX_DB_KEY;

const dbPromise = openDB('app-db', 1, {
  upgrade(db) {
    db.createObjectStore('credentials');
  },
});

function encryptData(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
}

function decryptData(data) {
  const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

// Save credentials to IndexedDB
export async function saveCredentials(email, password) {
  const db = await dbPromise;
  const encryptedCredentials = encryptData({ email, password });
  await db.put('credentials', encryptedCredentials, 'user');
}

// Retrieve credentials from IndexedDB
export async function getCredentials() {
  const db = await dbPromise;
  const encryptedCredentials = await db.get('credentials', 'user');
  if (encryptedCredentials) {
    return decryptData(encryptedCredentials);
  }
  return null;
}
