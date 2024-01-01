import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyAVbPPQBD2WF609qDR_C7sNMhnCzf5ZM28",
  authDomain: "quizplay-react.firebaseapp.com",
  projectId: "quizplay-react",
  storageBucket: "quizplay-react.appspot.com",
  messagingSenderId: "415053950910",
  appId: "1:415053950910:web:93cf014948ee06956ed3ef"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
export {db}