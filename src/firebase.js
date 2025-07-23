import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAt4IxCEUeq2D_x-cc0fecb8TlEKciORjM",
  authDomain: "to-be-budgeted.firebaseapp.com",
  projectId: "to-be-budgeted",
  storageBucket: "to-be-budgeted.firebasestorage.app",
  messagingSenderId: "1061858386336",
  appId: "1:1061858386336:web:c5078d74df2b32d34144c5",
  measurementId: "G-GS7CZ3ZH6J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics
export const analytics = getAnalytics(app);

export default app; 