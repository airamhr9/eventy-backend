// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWIQCv7tzqa0MojVSQ_VkHlwpVjrOFFLM",
  authDomain: "eventy-a8e4c.firebaseapp.com",
  databaseURL: "https://eventy-a8e4c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "eventy-a8e4c",
  storageBucket: "eventy-a8e4c.appspot.com",
  messagingSenderId: "411939915264",
  appId: "1:411939915264:web:1801d4d640d5ae882cbae5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const rdb = getDatabase(firebaseConfig);
const auth = getAuth(firebaseConfig);
