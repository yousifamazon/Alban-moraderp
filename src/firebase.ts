import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, onSnapshot, query, where, orderBy, limit, getDocFromServer, writeBatch } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { toast } from 'sonner';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

export { writeBatch };

// Error handling helper
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

const kurdishErrors: Record<string, string> = {
  'permission-denied': 'تۆ مۆڵەتی پێویستت نییە بۆ ئەم کارە. تکایە دڵنیابەرەوە کە چوویتەتە ژوورەوە.',
  'not-found': 'ئەم زانیارییە نەدۆزرایەوە.',
  'already-exists': 'ئەم زانیارییە پێشتر بوونی هەیە.',
  'unavailable': 'سێرڤەر لە ئێستادا بەردەست نییە. تکایە هێڵی ئینتەرنێتەکەت بپشکنە.',
  'unauthenticated': 'تکایە سەرەتا بچۆ ژوورەوە بۆ ئەنجامدانی ئەم کارە.',
  'quota-exceeded': 'بڕی ڕێگەپێدراوی داتا تەواو بووە. تکایە پەیوەندی بە بەڕێوەبەر بکە.',
  'deadline-exceeded': 'کات تەواو بوو پێش ئەوەی کارەکە جێبەجێ بکرێت. دووبارە هەوڵ بدەرەوە.',
  'cancelled': 'کارەکە هەڵوەشایەوە.',
  'data-loss': 'هەندێک داتا لەدەست چوون.',
  'failed-precondition': 'کارەکە سەرکەوتوو نەبوو بەهۆی مەرجێکی پێشوەختە.',
  'out-of-range': 'کارەکە لە دەرەوەی مەودای ڕێگەپێدراوە.',
};

export function handleFirestoreError(error: any, operationType: OperationType, path: string | null) {
  const errorCode = error?.code || 'unknown';
  const kurdishMessage = kurdishErrors[errorCode] || `هەڵەیەک ڕوویدا: ${error.message || 'کێشەی نەزانراو'}`;
  
  toast.error(kurdishMessage, {
    description: `Operation: ${operationType} | Path: ${path}`,
    duration: 5000,
  });

  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

// Connection test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();
