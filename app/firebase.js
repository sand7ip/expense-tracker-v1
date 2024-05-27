// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAljD3kUUogwbQLlszWXo8YNcBi_-igeg",
  authDomain: "ease-my-tracker.firebaseapp.com",
  projectId: "ease-my-tracker",
  storageBucket: "ease-my-tracker.appspot.com",
  messagingSenderId: "909404832709",
  appId: "1:909404832709:web:a5a2023c7a7e5d1232c1ac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db= getFirestore(app);
export const auth = getAuth(app);