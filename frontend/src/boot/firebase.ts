import { boot } from 'quasar/wrappers';
import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBgVlLKMoxB7XkBJq7nSFIupCqizynq5yM',
  authDomain: 'ciwort.firebaseapp.com',
  projectId: 'ciwort',
  storageBucket: 'ciwort.appspot.com',
  messagingSenderId: '1095827234848',
  appId: '1:1095827234848:web:1ed78eef37c938a4351c45',
  measurementId: 'G-68HHFK0MW7',
};

const firebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(firebaseApp);

export default boot(({ app }) => {
  // Add Firebase Auth to the global properties
  app.config.globalProperties.$auth = auth;
});

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $auth: Auth;
  }
}