import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; 
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCox2OFNOoYB8DgeVHcnLttyJqDdP8iSak",
  authDomain: "attendiq-zuse.firebaseapp.com",
  projectId: "attendiq-zuse",
  storageBucket: "attendiq-zuse.firebasestorage.app",
  messagingSenderId: "1032512818372",
  appId: "1:1032512818372:web:347e0034f06ffa79c44d91",
  measurementId: "G-3WZ66ENY4Q"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);