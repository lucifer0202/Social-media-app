// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDZYjrdexOBvID3waDbKja-RQr3ww1nP50",
  authDomain: "quakka-socialmedia.firebaseapp.com",
  projectId: "quakka-socialmedia",
  storageBucket: "quakka-socialmedia.appspot.com",
  messagingSenderId: "672405811492",
  appId: "1:672405811492:web:11347287a971af32a3c3b1",
  measurementId: "G-XXWJ7E7J33"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { firestore, auth, storage };
