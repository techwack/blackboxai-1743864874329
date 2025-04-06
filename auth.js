import { auth } from './firebase.js';

// DOM Elements
const authControls = document.getElementById('auth-controls');
const mobileAuthControls = document.getElementById('mobile-auth-controls');
const userAvatar = document.createElement('div');
const mobileUserAvatar = document.createElement('div');

// Auth State Handler
const handleAuthState = (user) => {
    if (user) {
        // User is signed in
        renderSignedInUI(user);
        console.log('User signed in:', user);
    } else {
        // User is signed out
        renderSignedOutUI();
        console.log('User signed out');
    }
};

// Render UI for signed-in user
const renderSignedInUI = (user) => {
    // Create user dropdown menu
    const dropdownMenu = `
        <div class="relative ml-3" x-data="{ open: false }">
            <button @click="open = !open" class="flex items-center max-w-xs rounded-full focus:outline-none">
                <div class="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                    ${user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span class="ml-2 text-sm font-medium text-gray-700">${user.displayName || 'User'}</span>
            </button>
            
            <div x-show="open" @click.away="open = false" 
                 class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i class="fas fa-user mr-2"></i> Profile
                </a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i class="fas fa-cog mr-2"></i> Settings
                </a>
                <button onclick="signOut()" class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i class="fas fa-sign-out-alt mr-2"></i> Sign out
                </button>
            </div>
        </div>
    `;

    // Update both desktop and mobile menus
    if (authControls) authControls.innerHTML = dropdownMenu;
    if (mobileAuthControls) mobileAuthControls.innerHTML = `
        <div class="w-full">
            <div class="flex items-center px-3 py-2">
                <div class="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white mr-2">
                    ${user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span class="text-sm font-medium text-gray-700">${user.displayName || 'User'}</span>
            </div>
            <div class="mt-2 space-y-1">
                <a href="#" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i class="fas fa-user mr-2"></i> Profile
                </a>
                <a href="#" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i class="fas fa-cog mr-2"></i> Settings
                </a>
                <button onclick="signOut()" class="w-full text-left block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i class="fas fa-sign-out-alt mr-2"></i> Sign out
                </button>
            </div>
        </div>
    `;
};

// Render UI for signed-out user
const renderSignedOutUI = () => {
    const signInButton = `
        <button onclick="googleSignIn()" class="flex items-center bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium transition">
            <i class="fab fa-google mr-2"></i> Sign in with Google
        </button>
    `;

    if (authControls) authControls.innerHTML = signInButton;
    if (mobileAuthControls) mobileAuthControls.innerHTML = `
        <button onclick="googleSignIn()" class="w-full flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-base font-medium transition">
            <i class="fab fa-google mr-2"></i> Sign in with Google
        </button>
    `;
};

// Google Sign-In
window.googleSignIn = async () => {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
    } catch (error) {
        console.error('Google sign-in error:', error);
        showToast('Sign-in failed: ' + error.message, 'error');
    }
};

// Sign Out
window.signOut = async () => {
    try {
        await auth.signOut();
        showToast('Signed out successfully', 'success');
    } catch (error) {
        console.error('Sign out error:', error);
        showToast('Sign out failed: ' + error.message, 'error');
    }
};

// Toast Notification
const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };

    toast.className = `fixed bottom-4 right-4 ${colors[type]} text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-300 opacity-0`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('opacity-0');
        toast.classList.add('opacity-100');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// Initialize auth state listener
auth.onAuthStateChanged(handleAuthState);

// Export for other modules
export { auth, showToast };