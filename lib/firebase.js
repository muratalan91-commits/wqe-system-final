import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwEQhOa1-k7AZ5Z6i-EiGAr2dPL-i04T8",
  authDomain: "e-belge-8953f.firebaseapp.com",
  projectId: "e-belge-8953f",
  storageBucket: "e-belge-8953f.firebasestorage.app",
  messagingSenderId: "1053527570578",
  appId: "1:1053527570578:web:a621ace1ab781a86f2ce4b"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

