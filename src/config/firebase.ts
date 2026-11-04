export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyB9P0J2TmSjsz7FsrJ9epQ1F82xZiD5Vv0',
  authDomain: 'pawcare-1db6c.firebaseapp.com',
  databaseURL: 'https://pawcare-1db6c-default-rtdb.firebaseio.com',
  projectId: 'pawcare-1db6c',
  storageBucket: 'pawcare-1db6c.firebasestorage.app',
  messagingSenderId: '147878385359',
  appId: '1:147878385359:web:0fd3e20a4ad6b5be59c9ba',
};

// Endpoints oficiais da Firebase Auth REST API
export const AUTH_ENDPOINTS = {
  SIGN_UP: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_CONFIG.apiKey}`,
  SIGN_IN: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_CONFIG.apiKey}`,
  REFRESH: `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_CONFIG.apiKey}`,
};
