// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getApps,getApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRIhv-5GN6U68sFd-ia4viWLjbjSbcHmg",
  authDomain: "warp-c3245.firebaseapp.com",
  projectId: "warp-c3245",
  storageBucket: "warp-c3245.firebasestorage.app",
  messagingSenderId: "850447507692",
  appId: "1:850447507692:web:2a7ebe8f87ded89f35c5c9",
  measurementId: "G-JQT3PYC4HE"
};

// Initialize Firebase
const app = getApps().length===0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();


export {auth};
