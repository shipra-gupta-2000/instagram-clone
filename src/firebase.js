// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//import firebase from 'firebase';
import firebase from 'firebase';
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBTE_vljC4d4RNAV138Ib7gj58sENRIKis",
    authDomain: "instagram-cdeaa.firebaseapp.com",
    databaseURL: "https://instagram-cdeaa-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "instagram-cdeaa",
    storageBucket: "instagram-cdeaa.appspot.com",
    messagingSenderId: "708930676726",
    appId: "1:708930676726:web:8fe3128b8e0aa7b94389d7",
    measurementId: "G-Z7WHEE9CFE"
  });

  const db=firebaseApp.firestore();
  const auth=firebase.auth();
  const storage=firebase.storage();
export {db,auth,storage};