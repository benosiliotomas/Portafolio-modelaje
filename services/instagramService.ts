// Admin-side access to the ordered list of Instagram links shown on /contenido.
// Visitors read the same document without the SDK (firestoreRest.fetchSavedInstagramPosts).
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { INSTAGRAM_DOC_PATH } from './firestoreRest';
import type { SavedPosts } from '../lib/instagramList';

export const subscribeToInstagramPosts = (onChange: (saved: SavedPosts) => void): (() => void) => {
  if (!db) {
    onChange({ status: 'error' });
    return () => { };
  }

  return onSnapshot(doc(db, ...INSTAGRAM_DOC_PATH), (snapshot) => {
    if (!snapshot.exists()) {
      onChange({ status: 'missing' });
      return;
    }
    const posts = snapshot.data().posts;
    onChange({
      status: 'saved',
      posts: Array.isArray(posts) ? posts.filter((p): p is string => typeof p === 'string') : [],
    });
  }, (error) => {
    console.error('Error loading Instagram posts:', error);
    onChange({ status: 'error' });
  });
};

// The whole list is written at once, so order, additions and removals are a single save.
export const saveInstagramPosts = async (posts: string[]): Promise<void> => {
  if (!db) throw new Error('Firebase is not configured.');
  await setDoc(doc(db, ...INSTAGRAM_DOC_PATH), { posts, updatedAt: serverTimestamp() });
};
