import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAA36E6OcnXUUSAeRJlSr5ldE5ZxApamzw",
    authDomain: "nexora-7c2cc.firebaseapp.com",
    projectId: "nexora-7c2cc",
    storageBucket: "nexora-7c2cc.firebasestorage.app",
    messagingSenderId: "136727218576",
    appId: "1:136727218576:web:f27c80864a077178f68b15",
    measurementId: "G-3QZW5N2SY6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { 
    auth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    sendPasswordResetEmail
};