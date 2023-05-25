// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAebULGACuZI_MOynSFrBd5whiEITYoQw",
  authDomain: "realtor-clone-878cb.firebaseapp.com",
  projectId: "realtor-clone-878cb",
  storageBucket: "realtor-clone-878cb.appspot.com",
  messagingSenderId: "792588809385",
  appId: "1:792588809385:web:4e96ce91831e6d4448e5b8",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
