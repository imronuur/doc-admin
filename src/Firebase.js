import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB6PASOGMim3n-dEW1pfMGqAacpSZCDZoA',
  authDomain: 'silicon-ecom.firebaseapp.com',
  projectId: 'silicon-ecom',
  storageBucket: 'silicon-ecom.appspot.com',
  messagingSenderId: '52945181178',
  appId: '1:52945181178:web:811a6d00eba54a95b3ec43',
  measurementId: 'G-Q7X5H5QZ2Q'
};

const app = firebase.initializeApp(firebaseConfig);
export const authFirbase = app.auth();
export const storage = app.storage();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
