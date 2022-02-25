// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC45rT7VxK-fmme2xE5UtoSfceuU-L3qtQ",
    authDomain: "dimesmastist-app.firebaseapp.com",
    projectId: "dimesmastist-app",
    storageBucket: "dimesmastist-app.appspot.com",
    messagingSenderId: "688617555737",
    appId: "1:688617555737:web:4a3bc24e063ef7fe7b6788"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const googleAuthProvider = new GoogleAuthProvider();

export{
    db,
    googleAuthProvider,
    app
}