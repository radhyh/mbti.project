// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBTUI2nTJCAr4xn0FYaa6SGV9xbaKsK1kg",
  authDomain: "mbti-project-3c324.firebaseapp.com",
  projectId: "mbti-project-3c324",
  storageBucket: "mbti-project-3c324.appspot.com",
  messagingSenderId: "539055979955",
  appId: "1:539055979955:web:078e6481299a75b3735fc6"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
firebase.auth().signInAnonymously();