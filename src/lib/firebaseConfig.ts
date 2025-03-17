import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getMessaging, isSupported } from "firebase/messaging";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAsPE7UwcsLRyDExYHtyAnF9hBgr0Z0lKc",
    authDomain: "ecommerce-22984.firebaseapp.com",
    projectId: "ecommerce-22984",
    storageBucket: "ecommerce-22984.firebasestorage.app",
    messagingSenderId: "982247400347",
    appId: "1:982247400347:web:9fec7244a2678b5604773e",
    measurementId: "G-1LNBV0R9WV",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, storage, googleProvider };
