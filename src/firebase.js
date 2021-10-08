import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCslA2UknCfSdi1mHdk-xEILjgvKawuafI",
  authDomain: "netflix-clone-cb592.firebaseapp.com",
  projectId: "netflix-clone-cb592",
  storageBucket: "netflix-clone-cb592.appspot.com",
  messagingSenderId: "739423834407",
  appId: "1:739423834407:web:75f29a823a57a140285902",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth };
export default db;
