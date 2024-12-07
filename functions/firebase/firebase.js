const admin = require('firebase-admin');
// import { initializeApp } from "firebase/app";
import { initializeApp } from 'firebase/app';
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// Import Firebase service account key
const serviceAccount = require('../firebaseServiceAccountKey.json');


const firebaseConfig = {
  apiKey: 'AIzaSyBgVlLKMoxB7XkBJq7nSFIupCqizynq5yM',
  authDomain: 'ciwort.firebaseapp.com',
  projectId: 'ciwort',
  storageBucket: 'ciwort.appspot.com',
  messagingSenderId: '1095827234848',
  appId: '1:1095827234848:web:1ed78eef37c938a4351c45',
  measurementId: 'G-68HHFK0MW7',
};

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ciwort.firebaseapp.com',
});

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
