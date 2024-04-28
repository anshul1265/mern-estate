// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-d546e.firebaseapp.com",
  projectId: "mern-estate-d546e",
  storageBucket: "mern-estate-d546e.appspot.com",
  messagingSenderId: "344418340849",
  appId: "1:344418340849:web:252f771498aa384a957e50"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);