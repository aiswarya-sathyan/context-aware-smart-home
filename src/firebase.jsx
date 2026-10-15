import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKQjLkwtmT8FQ-3O_KhERJy0g2lLx_OaE",
  authDomain: "smart-home-3cf04.firebaseapp.com",
  databaseURL: "https://smart-home-3cf04-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-home-3cf04",
  storageBucket: "smart-home-3cf04.firebasestorage.app",
  messagingSenderId: "370600529325",
  appId: "1:370600529325:web:0d303ffd23ff5eb0d46524"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and export it as named export 'db'
export const db = getDatabase(app);