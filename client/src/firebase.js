// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-page-c6543.firebaseapp.com",
  projectId: "blog-page-c6543",
  storageBucket: "blog-page-c6543.appspot.com",
  messagingSenderId: "753675177086",
  appId: "1:753675177086:web:01455a40d0e1148aae5c2f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);