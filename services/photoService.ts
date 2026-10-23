import {
  collection,
  query,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  writeBatch,
  orderBy,
  getDocs
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage, isConfigured } from './firebaseConfig';
import { createImageVariants } from '../lib/imageVariants';
import type { Photo, PhotoVariant } from '../types';

const PHOTOS_COLLECTION = 'photos';

// Variant files never change once uploaded, so browsers may cache them for a year.
const VARIANT_CACHE_CONTROL = 'public, max-age=31536000, immutable';

// Get photos with real-time updates
export const subscribeToPhotos = (
  onPhotosUpdate: (photos: Photo[]) => void,
  onError: (error: Error) => void
): (() => void) => {
  if (!isConfigured || !db) {
    const errorMsg = "Firebase no está configurado. Edita `services/firebaseConfig.ts` para conectar tu base de datos en la nube.";
    console.error("Firebase is not configured. Cannot fetch photos.");
    onError(new Error(errorMsg));
    onPhotosUpdate([]);
    return () => { };
  }

  const q = query(collection(db, PHOTOS_COLLECTION), orderBy('order', 'asc'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const photos: Photo[] = [];
    querySnapshot.forEach((doc) => {
      photos.push({ id: doc.id, ...doc.data() } as Photo);
    });
    onPhotosUpdate(photos);
  }, (error) => {
    console.error("Error fetching photos from Firestore:", error);
    onError(new Error("No se pudieron cargar las fotos desde la nube."));
    onPhotosUpdate([]);
  });

  return unsubscribe;
};

// Add a new photo: resized in the browser, so only optimized files reach Storage.
export const addPhoto = async (photoData: { alt: string; image: Blob }): Promise<void> => {
  if (!db || !storage) throw new Error("Firebase is not configured.");
  const firebaseStorage = storage;

  const { width, height, variants } = await createImageVariants(photoData.image);

  const photosCollectionRef = collection(db, PHOTOS_COLLECTION);
  const snapshot = await getDocs(photosCollectionRef);
  const newOrder = snapshot.size;
  const imageId = doc(photosCollectionRef).id;

  const uploaded: PhotoVariant[] = await Promise.all(
    variants.map(async ({ width: variantWidth, blob }) => {
      const extension = blob.type === 'image/webp' ? 'webp' : 'jpg';
      const storageRef = ref(firebaseStorage, `${PHOTOS_COLLECTION}/${imageId}_${variantWidth}.${extension}`);
      await uploadBytes(storageRef, blob, { contentType: blob.type, cacheControl: VARIANT_CACHE_CONTROL });
      return { width: variantWidth, url: await getDownloadURL(storageRef) };
    })
  );

  await addDoc(photosCollectionRef, {
    url: uploaded[uploaded.length - 1].url,
    variants: uploaded,
    width,
    height,
    alt: photoData.alt,
    order: newOrder,
    concept: '',
    hidden: false,
  });
};

// Delete a photo and every stored file that belongs to it
export const deletePhoto = async (photo: Photo): Promise<void> => {
  if (!db || !storage) throw new Error("Firebase is not configured.");
  const firebaseStorage = storage;

  const photoDocRef = doc(db, PHOTOS_COLLECTION, photo.id);
  await deleteDoc(photoDocRef);

  const fileUrls = new Set([photo.url, ...(photo.variants ?? []).map(v => v.url)]);
  await Promise.all([...fileUrls].map(async (url) => {
    try {
      await deleteObject(ref(firebaseStorage, url));
    } catch (error: unknown) {
      const code = (error as { code?: string }).code;
      if (code !== 'storage/object-not-found') {
        console.error("Error deleting photo from Storage:", error);
      }
    }
  }));
};

// Update photo details (alt text and caption)
export const updatePhotoDetails = async (photoId: string, alt: string, concept: string): Promise<void> => {
  if (!db) throw new Error("Firebase is not configured.");
  const photoDocRef = doc(db, PHOTOS_COLLECTION, photoId);
  await updateDoc(photoDocRef, { alt, concept });
};

// Hide a photo from visitors without deleting it
export const setPhotoHidden = async (photoId: string, hidden: boolean): Promise<void> => {
  if (!db) throw new Error("Firebase is not configured.");
  const photoDocRef = doc(db, PHOTOS_COLLECTION, photoId);
  await updateDoc(photoDocRef, { hidden });
};

// Update the order of all photos
export const updatePhotosOrder = async (photos: Photo[]): Promise<void> => {
  if (!db) throw new Error("Firebase is not configured.");

  const batch = writeBatch(db);
  photos.forEach((photo, index) => {
    const docRef = doc(db, PHOTOS_COLLECTION, photo.id);
    batch.update(docRef, { order: index });
  });

  await batch.commit();
};
