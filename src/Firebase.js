import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB6PASOGMim3n-dEW1pfMGqAacpSZCDZoA',
  authDomain: 'silicon-ecom.firebaseapp.com',
  projectId: 'silicon-ecom',
  storageBucket: 'silicon-ecom.appspot.com',
  messagingSenderId: '52945181178',
  appId: '1:52945181178:web:811a6d00eba54a95b3ec43',
  measurementId: 'G-Q7X5H5QZ2Q'
};

const app = initializeApp(firebaseConfig);
export const authFirbase = getAuth(app);
export const storage = getStorage(app);
// export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
