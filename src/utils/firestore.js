import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
   apiKey: "AIzaSyBHQhD5b-0bokWIf_5h5IOXjfAY_0oUeUc",
  authDomain: "massoterapia-a4dec.firebaseapp.com",
  projectId: "massoterapia-a4dec",
  storageBucket: "massoterapia-a4dec.appspot.com",
  messagingSenderId: "17630666919",
  appId: "1:17630666919:web:8a2aa57aa0daff456f3b82",
  measurementId: "G-Z0MKL7TZ2Q"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
export { db };