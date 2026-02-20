import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAuth, Auth } from 'firebase/auth';

// --- PEGA TU OBJETO DE CONFIGURACIÓN DE FIREBASE AQUÍ ---
// Reemplaza estos valores de marcador de posición con las credenciales reales de tu proyecto de Firebase.
// La aplicación se conectará a la nube en cuanto lo hagas.
const firebaseConfig = {
  apiKey: "AIzaSyAF0670ZL8fJHGQufNbdn9WaYTko0r0Su4",
  authDomain: "modelo-portafolio.firebaseapp.com",
  projectId: "modelo-portafolio",
  storageBucket: "modelo-portafolio.firebasestorage.app",
  messagingSenderId: "945440806728",
  appId: "1:945440806728:web:2f7a5ab78d0b13865d057d"
};
// -----------------------------------------------------------

let app: FirebaseApp;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let auth: Auth | null = null;
let isConfigured = false;

try {
  // Comprueba si la configuración ha sido cambiada de los valores de marcador de posición
  if (firebaseConfig.apiKey !== "YOUR_API_KEY" && firebaseConfig.projectId !== "YOUR_PROJECT_ID") {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
    isConfigured = true;
  } else {
    // Este es un aviso para el desarrollador, no para el usuario final.
    console.warn("Firebase no está configurado. Por favor, añade tus credenciales en 'services/firebaseConfig.ts' para conectar el portafolio a la nube. Mostrando datos de ejemplo.");
  }
} catch (error) {
  console.error("Error al inicializar Firebase. Por favor, revisa tu configuración en 'services/firebaseConfig.ts'.", error);
  isConfigured = false;
}

export { db, storage, auth, isConfigured };
