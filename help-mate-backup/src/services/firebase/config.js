import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyDbDlmW6iNWotGF1sjjOdq58jA24-g0yo8",
  authDomain: "help-mate-e9954.firebaseapp.com",
  projectId: "help-mate-e9954",
  storageBucket: "help-mate-e9954.firebasestorage.app",
  messagingSenderId: "785792845984",
  appId: "1:785792845984:web:66023acbb67ab1c56861c5",
  measurementId: "G-ZLC3ERHLXB"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;