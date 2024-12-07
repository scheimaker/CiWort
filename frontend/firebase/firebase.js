
import { initializeApp } from 'firebase/app';




const firebaseConfig = {
  apiKey: 'AIzaSyBgVlLKMoxB7XkBJq7nSFIupCqizynq5yM',
  authDomain: 'ciwort.firebaseapp.com',
  projectId: 'ciwort',
  storageBucket: 'ciwort.appspot.com',
  messagingSenderId: '1095827234848',
  appId: '1:1095827234848:web:1ed78eef37c938a4351c45',
  measurementId: 'G-68HHFK0MW7',
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
