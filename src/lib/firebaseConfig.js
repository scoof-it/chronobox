import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC_jG5gdvjFGwovFs6UCZF872TUXVks5X4",
  authDomain: "chrono-box.firebaseapp.com",
  projectId: "chrono-box",
  storageBucket: "chrono-box.appspot.com",
  messagingSenderId: "787640700742",
  appId: "1:787640700742:web:8f3243156d5f053db35f47"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

export { auth, db, storage, provider };