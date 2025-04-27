// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1jHfq-wlKuJrhedq54zTrvFGEhI8gN6M",
  authDomain: "resume-template-66a2d.firebaseapp.com",
  projectId: "resume-template-66a2d",
  storageBucket: "resume-template-66a2d.firebasestorage.app",
  messagingSenderId: "44282380780",
  appId: "1:44282380780:web:e39dc3a032cda565f700c9",
  measurementId: "G-KNGZKP6E6F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);