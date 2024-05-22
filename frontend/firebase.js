// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-bff12.firebaseapp.com",
  projectId: "mern-estate-bff12",
  storageBucket: "mern-estate-bff12.appspot.com",
  messagingSenderId: "303527227620",
  appId: "1:303527227620:web:3790e6a3d283107b4c7cf1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);