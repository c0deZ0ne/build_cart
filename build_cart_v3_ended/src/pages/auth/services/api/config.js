import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCBjlBCl6AdQUt8-BZhK-TOPT3BRjAjEzM',
  authDomain: 'cutstruct-bulk-sso.firebaseapp.com',
  projectId: 'cutstruct-bulk-sso',
  storageBucket: 'cutstruct-bulk-sso.appspot.com',
  messagingSenderId: '713184327504',
  appId: '1:713184327504:web:ee51aac304fcf8be215e55',
  measurementId: 'G-9S4PZSXSWC',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
