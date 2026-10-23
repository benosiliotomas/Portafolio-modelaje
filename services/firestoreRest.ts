// Read-only access for visitors through Firestore's REST API, so the public page does not
// ship the Firebase SDK. Writes and live updates stay in the admin bundle (photoService).
import { FIREBASE_PROJECT_ID } from './firebaseProject';
import type { Photo } from '../types';

type FirestoreValue =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { nullValue: null }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields?: Record<string, FirestoreValue> } };

interface FirestoreDocument {
  name: string;
  fields?: Record<string, FirestoreValue>;
}

const DOCUMENTS_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/photos`;

export function decodeValue(value: FirestoreValue): unknown {
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('nullValue' in value) return null;
  if ('arrayValue' in value) return (value.arrayValue.values ?? []).map(decodeValue);
  return decodeFields(value.mapValue.fields ?? {});
}

function decodeFields(fields: Record<string, FirestoreValue>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(fields).map(([key, v]) => [key, decodeValue(v)]));
}

export function documentToPhoto(document: FirestoreDocument): Photo | null {
  const data = decodeFields(document.fields ?? {});
  if (typeof data.url !== 'string') return null;
  return {
    ...data,
    id: document.name.split('/').pop() ?? '',
    url: data.url,
    alt: typeof data.alt === 'string' ? data.alt : '',
    order: typeof data.order === 'number' ? data.order : 0,
  } as Photo;
}

export async function fetchPublicPhotos(): Promise<Photo[]> {
  const photos: Photo[] = [];
  let pageToken: string | undefined;

  do {
    const url = `${DOCUMENTS_URL}?pageSize=100${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`No se pudieron cargar las fotos (${response.status}).`);
    const body: { documents?: FirestoreDocument[]; nextPageToken?: string } = await response.json();
    for (const document of body.documents ?? []) {
      const photo = documentToPhoto(document);
      if (photo) photos.push(photo);
    }
    pageToken = body.nextPageToken;
  } while (pageToken);

  return photos.sort((a, b) => a.order - b.order);
}
