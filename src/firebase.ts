import { initializeApp } from "firebase/app";
import { getFirestore, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBqIcnypbxuS603PV4b6DYa9YX2fkfYBvk",
  authDomain: "methodinmadness.firebaseapp.com",
  projectId: "methodinmadness",
  storageBucket: "methodinmadness.firebasestorage.app",
  messagingSenderId: "70455480151",
  appId: "1:70455480151:web:4dd799fba2a33726747812",
  measurementId: "G-JKNNZWKNH3",
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const dbDocRef = doc(firestore, "methodInMadness", "main");
