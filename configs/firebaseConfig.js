import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "ai-course-generator-e35bd.firebaseapp.com",
    projectId: "ai-course-generator-e35bd",
    storageBucket: "ai-course-generator-e35bd.firebasestorage.app",
    messagingSenderId: "429146578835",
    appId: "1:429146578835:web:94513d6096149d898e9266",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
