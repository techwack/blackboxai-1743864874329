import { auth, db } from './firebase.js';

// DOM elements
const moodOptions = document.querySelectorAll('.mood-option');
const moodNote = document.getElementById('moodNote');
const submitBtn = document.getElementById('submitMood');

// State
let selectedMood = null;

// Event listeners
moodOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove selected class from all options
        moodOptions.forEach(opt => opt.classList.remove('mood-selected'));
        
        // Add selected class to clicked option
        option.classList.add('mood-selected');
        
        // Store selected mood
        selectedMood = option.dataset.mood || option.textContent.trim();
        
        // Enable submit button
        submitBtn.disabled = false;
    });
});

submitBtn.addEventListener('click', saveMood);

// Save mood to Firebase
async function saveMood() {
    if (!selectedMood) return;
    
    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Saving...';
        
        const userId = auth.currentUser?.uid || 'anonymous';
        const moodData = {
            mood: selectedMood,
            note: moodNote.value,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userId: userId
        };
        
        await db.collection('moodEntries').add(moodData);
        
        // Show success message
        submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i> Saved!';
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-heart mr-2"></i> Save My Mood';
            submitBtn.disabled = false;
        }, 2000);
        
        // Clear selection after saving
        moodOptions.forEach(opt => opt.classList.remove('mood-selected'));
        moodNote.value = '';
        selectedMood = null;
        
    } catch (error) {
        console.error("Error saving mood:", error);
        submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i> Try Again';
        submitBtn.disabled = false;
    }
}

// Listen for auth state changes to handle anonymous users
auth.onAuthStateChanged((user) => {
    if (!user) {
        // If not signed in, sign in anonymously
        auth.signInAnonymously().catch(error => {
            console.error("Anonymous sign-in failed:", error);
        });
    }
});