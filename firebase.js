// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCX3MRIsvZSsA2B-n_ZoJh7mvWrHsutyFY",
    authDomain: "warmhug-aab78.firebaseapp.com",
    projectId: "warmhug-aab78",
    storageBucket: "warmhug-aab78.appspot.com",
    messagingSenderId: "496577987382",
    appId: "1:496577987382:web:a2b1dabd52fd5f86f62997",
    measurementId: "G-F3QG8MLW6W"
};

// Initialize services
let auth, db;

try {
    const app = !firebase.apps.length 
        ? firebase.initializeApp(firebaseConfig)
        : firebase.app();
    
    console.log("Firebase initialized successfully");
    auth = firebase.auth();
    db = firebase.firestore();

    // Enable offline persistence
    db.enablePersistence()
        .then(() => console.log("Offline persistence enabled"))
        .catch((err) => {
            if (err.code === 'failed-precondition') {
                console.warn("Offline persistence can only be enabled in one tab");
            } else if (err.code === 'unimplemented') {
                console.warn("Offline persistence not supported in this browser");
            }
        });

    // Development mode checks
    if (window.location.hostname.match(/localhost|127\.0\.0\.1/)) {
        db.collection('test').doc('test').get()
            .then(() => console.log("Firestore access verified"))
            .catch(console.error);
    }
} catch (error) {
    console.error("Firebase initialization failed:", error);
    throw error;
}

// Export services
export { auth, db };