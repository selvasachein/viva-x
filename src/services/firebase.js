import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCS7aS-TRbzTf4vTQq5nIsA-1SVJvO_eIY",
  authDomain: "viva-x-smart-queue.firebaseapp.com",
  projectId: "viva-x-smart-queue",
  storageBucket: "viva-x-smart-queue.firebasestorage.app",
  messagingSenderId: "271666163491",
  appId: "1:271666163491:web:ea6b9fbde4a1363c39a696"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);