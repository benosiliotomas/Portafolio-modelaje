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
import type { Photo } from '../types';

const PHOTOS_COLLECTION = 'photos';

const getSamplePhotos = (): Photo[] => {
  return [
    { id: 'sample-1', url: 'https://picsum.photos/seed/model1/800/1200', alt: 'Modelo con vestido blanco', concept: 'Serenidad en blanco.', order: 0 },
    { id: 'sample-2', url: 'https://picsum.photos/seed/model2/800/1200', alt: 'Hombre mirando la ciudad', concept: 'Contemplación urbana.', order: 1 },
    { id: 'sample-3', url: 'https://picsum.photos/seed/model3/800/1200', alt: 'Retrato en primer plano', concept: 'Un estudio sobre la confianza.', order: 2 },
    { id: 'sample-4', url: 'https://picsum.photos/seed/model4/800/1200', alt: 'Moda estilo callejero', concept: 'Elegancia casual en movimiento.', order: 3 },
  ];
};

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

// Add a new photo
export const addPhoto = async (photoData: { alt: string; image: Blob }): Promise<void> => {
  if (!db || !storage) throw new Error("Firebase is not configured.");

  const photosCollectionRef = collection(db, PHOTOS_COLLECTION);
  const snapshot = await getDocs(photosCollectionRef);
  const newOrder = snapshot.size;

  const imageId = doc(photosCollectionRef).id;
  const storageRef = ref(storage, `${PHOTOS_COLLECTION}/${imageId}`);

  await uploadBytes(storageRef, photoData.image);
  const url = await getDownloadURL(storageRef);

  await addDoc(photosCollectionRef, {
    url,
    alt: photoData.alt,
    order: newOrder,
    concept: '',
  });
};

// Delete a photo
export const deletePhoto = async (photo: Photo): Promise<void> => {
  if (!db || !storage) throw new Error("Firebase is not configured.");

  const photoDocRef = doc(db, PHOTOS_COLLECTION, photo.id);
  await deleteDoc(photoDocRef);

  const storageRef = ref(storage, photo.url);
  try {
    await deleteObject(storageRef);
  } catch (error: any) {
    if (error.code !== 'storage/object-not-found') {
      console.error("Error deleting photo from Storage:", error);
    }
  }
};

// Update a photo's concept
export const updatePhotoConcept = async (photoId: string, concept: string): Promise<void> => {
  if (!db) throw new Error("Firebase is not configured.");
  const photoDocRef = doc(db, PHOTOS_COLLECTION, photoId);
  await updateDoc(photoDocRef, { concept });
};

// Update photo details (Alt/Title and Concept)
export const updatePhotoDetails = async (photoId: string, alt: string, concept: string): Promise<void> => {
  if (!db) throw new Error("Firebase is not configured.");
  const photoDocRef = doc(db, PHOTOS_COLLECTION, photoId);
  await updateDoc(photoDocRef, { alt, concept });
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