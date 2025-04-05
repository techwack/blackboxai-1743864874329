import { auth } from './firebase.js';

// DOM elements
const authContainer = document.getElementById('auth-container');

// Auth state listener
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        renderApp();
    } else {
        // No user signed in
        renderAuthOptions();
    }
});

function renderAuthOptions() {
    authContainer.innerHTML = `
        <div class="space-y-4">
            <h2 class="text-2xl font-light text-center text-gray-700 mb-6">Welcome</h2>
            
            <button id="googleSignIn" class="btn-primary w-full bg-white border border-gray-300 rounded-lg py-3 px-4 flex items-center justify-center space-x-2 text-gray-700 hover:bg-gray-50">
                <i class="fab fa-google text-red-500"></i>
                <span>Continue with Google</span>
            </button>
            
            <button id="anonSignIn" class="btn-primary w-full bg-pink-100 text-pink-700 rounded-lg py-3 px-4 hover:bg-pink-200">
                <i class="fas fa-user-secret mr-2"></i>
                Continue Anonymously
            </button>
            
            <p class="text-xs text-gray-500 text-center mt-6">
                By continuing, you agree to our <a href="#" class="text-pink-500">Privacy Policy</a>.
                We never share your data without consent.
            </p>
        </div>
    `;

    // Add event listeners
    document.getElementById('googleSignIn').addEventListener('click', signInWithGoogle);
    document.getElementById('anonSignIn').addEventListener('click', signInAnonymously);
}

function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .catch((error) => {
            console.error("Google sign-in error:", error);
            showError("Couldn't sign in with Google. Please try again.");
        });
}

function signInAnonymously() {
    auth.signInAnonymously()
        .catch((error) => {
            console.error("Anonymous sign-in error:", error);
            showError("Couldn't sign in anonymously. Please try again.");
        });
}

function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm';
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>${message}`;
    authContainer.prepend(errorElement);
    
    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}

function renderApp() {
    // Main app will be rendered here
    authContainer.innerHTML = `
        <div class="text-center py-8">
            <i class="fas fa-check-circle text-green-500 text-4xl mb-4"></i>
            <p class="text-gray-700">You're signed in!</p>
            <button id="signOutBtn" class="mt-6 text-sm text-pink-500 hover:text-pink-700">
                <i class="fas fa-sign-out-alt mr-1"></i> Sign out
            </button>
        </div>
    `;
    
    document.getElementById('signOutBtn').addEventListener('click', () => {
        auth.signOut();
    });
}