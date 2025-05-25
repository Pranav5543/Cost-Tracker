import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBfongLdhte51YH1V9XdB0OV4woqnzfwDE",
  authDomain: "karkhana-ecebc.firebaseapp.com",
  projectId: "karkhana-ecebc",
  storageBucket: "karkhana-ecebc.firebasestorage.app",
  messagingSenderId: "271933917301",
  appId: "1:271933917301:web:4caa79d7cae9dd649d503c",
  measurementId: "G-69ZDRQKHE0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
