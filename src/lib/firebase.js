// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDuq8vnjw3ZK41IVGs5LXhIF6FnpweGH6Q",
    authDomain: "fb-shop-v1.firebaseapp.com",
    projectId: "fb-shop-v1",
    storageBucket: "fb-shop-v1.firebasestorage.app",
    messagingSenderId: "851864613737",
    appId: "1:851864613737:web:b642da062d0b6e980703f8",
    measurementId: "G-KVZXT6G2H0"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };