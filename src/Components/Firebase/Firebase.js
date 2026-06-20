import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjeQQ8tmvgd7aNZTCmXx0v-k-0GiHIOVI",
  authDomain: "mahanta-group-b342f.firebaseapp.com",
  projectId: "mahanta-group-b342f",
  storageBucket: "mahanta-group-b342f.firebasestorage.app",
  messagingSenderId: "658979847198",
  appId: "1:658979847198:web:4bce685e9692682566020f",
  measurementId: "G-QF690L6NQ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Secondary app for creating users without signing out current admin
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
const secondaryAuth = getAuth(secondaryApp);

export { db, analytics, auth, secondaryAuth };
export default app;
