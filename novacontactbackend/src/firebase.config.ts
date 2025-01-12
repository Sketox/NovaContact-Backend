// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDFbxRMezXjziKjHHf-DcYJzR2tuxQ_5lk",
  authDomain: "novacontact01.firebaseapp.com",
  projectId: "novacontact01",
  storageBucket: "novacontact01.firebasestorage.app",
  messagingSenderId: "284458503254",
  appId: "1:284458503254:web:d11e71a06f73c607a37ff7"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const firebaseDataBase = getDatabase(app);