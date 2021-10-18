// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getDatabase} from "firebase/database"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOestmxztidEGb4XJbzSzlvwZcg19ogtc",
  authDomain: "eventy-a8e4c.firebaseapp.com",
  databaseURL: "https://eventy-a8e4c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "eventy-a8e4c",
  storageBucket: "eventy-a8e4c.appspot.com",
  messagingSenderId: "411939915264",
  appId: "1:411939915264:web:1801d4d640d5ae882cbae5"
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const rdb = getDatabase(app)
export const auth = getAuth(app)
export const storage = getStorage(app)




