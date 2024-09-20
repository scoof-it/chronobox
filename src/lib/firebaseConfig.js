import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDr8vFLNDeIt-PkFzk3i25VOt_BmExF2dA",
  authDomain: "chronobox-u.firebaseapp.com",
  projectId: "chronobox-u",
  storageBucket: "chronobox-u.appspot.com",
  messagingSenderId: "6230113966",
  appId: "1:6230113966:web:b074fa329528c75796b73f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

export { auth, db, storage, provider };