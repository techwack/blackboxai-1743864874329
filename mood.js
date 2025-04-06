import { auth, showToast } from './auth.js';
import { db } from './firebase.js';

// Mood configuration
const moodOptions = [
    { emoji: '😊', label: 'Happy', value: 'happy', color: '#FDE68A' },
    { emoji: '😄', label: 'Excited', value: 'excited', color: '#FCD34D' },
    { emoji: '😌', label: 'Calm', value: 'calm', color: '#A7F3D0' },
    { emoji: '😐', label: 'Neutral', value: 'neutral', color: '#E5E7EB' },
    { emoji: '😕', label: 'Confused', value: 'confused', color: '#BFDBFE' },
    { emoji: '😟', label: 'Worried', value: 'worried', color: '#93C5FD' },
    { emoji: '😔', label: 'Sad', value: 'sad', color: '#60A5FA' },
    { emoji: '😠', label: 'Angry', value: 'angry', color: '#FCA5A5' },
    { emoji: '😨', label: 'Anxious', value: 'anxious', color: '#C4B5FD' },
    { emoji: '😴', label: 'Tired', value: 'tired', color: '#DDD6FE' }
];

const colorOptions = [
    '#FF6B6B', '#FF8E8E', '#FFB3B3', '#FFD8D8', // Reds
    '#4ECDC4', '#88D8C0', '#B2E4DB', '#DCF0ED', // Teals
    '#FFE66D', '#FFED8A', '#FFF3A8', '#FFF9C5', // Yellows
    '#B19CD9', '#C5B2E3', '#D8C9EC', '#ECE0F5', // Purples
    '#A0CED9', '#B9DEE5', '#D1E9F0', '#EAF4F8'  // Blues
];

// DOM Elements
let selectedMood = null;
let selectedColor = null;

// Initialize mood tracking
export const initMoodTracking = (user) => {
    renderMoodOptions();
    renderColorOptions();
    setupEventListeners();
    loadMoodHistory(user);
};

// Render mood selection options
const renderMoodOptions = () => {
    const container = document.getElementById('mood-options-container');
    container.innerHTML = '';

    moodOptions.forEach(mood => {
        const option = document.createElement('button');
        option.className = 'mood-option flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-gray-200 hover:border-accent';
        option.innerHTML = `
            <span class="text-4xl mb-2">${mood.emoji}</span>
            <span class="text-sm font-medium">${mood.label}</span>
        `;
        option.dataset.value = mood.value;
        option.dataset.color = mood.color;
        option.addEventListener('click', () => selectMood(mood.value));
        container.appendChild(option);
    });
};

// Render color selection options
const renderColorOptions = () => {
    const container = document.getElementById('color-options-container');
    container.innerHTML = '';

    colorOptions.forEach(color => {
        const option = document.createElement('button');
        option.className = 'color-picker rounded-full hover:opacity-90 transition';
        option.style.backgroundColor = color;
        option.dataset.color = color;
        option.addEventListener('click', () => selectColor(color));
        container.appendChild(option);
    });
};

// Select mood handler
const selectMood = (moodValue) => {
    selectedMood = moodOptions.find(m => m.value === moodValue);
    selectedColor = selectedMood.color;
    
    // Update UI
    document.querySelectorAll('.mood-option').forEach(option => {
        option.classList.toggle('selected', option.dataset.value === moodValue);
        option.classList.toggle('bg-primary/10', option.dataset.value === moodValue);
    });
    
    document.querySelectorAll('.color-picker').forEach(picker => {
        picker.classList.toggle('selected', picker.dataset.color === selectedMood.color);
    });
    
    updateSubmitButton();
};

// Select color handler
const selectColor = (color) => {
    selectedColor = color;
    selectedMood = null;
    
    // Update UI
    document.querySelectorAll('.mood-option').forEach(option => {
        option.classList.remove('selected', 'bg-primary/10');
    });
    
    document.querySelectorAll('.color-picker').forEach(picker => {
        picker.classList.toggle('selected', picker.dataset.color === color);
    });
    
    updateSubmitButton();
};

// Update submit button state
const updateSubmitButton = () => {
    const submitButton = document.getElementById('submit-mood');
    submitButton.disabled = !(selectedMood || selectedColor);
};

// Setup event listeners
const setupEventListeners = () => {
    document.getElementById('submit-mood').addEventListener('click', submitMood);
};

// Submit mood to Firestore
const submitMood = async () => {
    const user = auth.currentUser;
    if (!user) {
        showToast('Please sign in to track your mood', 'error');
        return;
    }

    const notes = document.getElementById('mood-notes').value;
    const moodData = {
        userId: user.uid,
        mood: selectedMood ? selectedMood.value : 'custom',
        emoji: selectedMood ? selectedMood.emoji : '',
        color: selectedColor,
        notes: notes,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        await db.collection('moodEntries').add(moodData);
        showToast('Mood saved successfully!', 'success');
        document.getElementById('mood-notes').value = '';
        loadMoodHistory(user);
    } catch (error) {
        console.error('Error saving mood:', error);
        showToast('Failed to save mood: ' + error.message, 'error');
    }
};

// Load mood history from Firestore
const loadMoodHistory = async (user) => {
    const historyContainer = document.getElementById('mood-history');
    historyContainer.innerHTML = '<p class="text-gray-500">Loading your mood history...</p>';

    try {
        const snapshot = await db.collection('moodEntries')
            .where('userId', '==', user.uid)
            .orderBy('timestamp', 'desc')
            .limit(7)
            .get();

        if (snapshot.empty) {
            historyContainer.innerHTML = '<p class="text-gray-500">No mood entries yet. Check in to get started!</p>';
            return;
        }

        historyContainer.innerHTML = '';
        snapshot.forEach(doc => {
            const entry = doc.data();
            const date = entry.timestamp?.toDate() || new Date();
            
            const entryElement = document.createElement('div');
            entryElement.className = 'bg-white p-4 rounded-lg shadow-sm border-l-4';
            entryElement.style.borderLeftColor = entry.color;
            
            entryElement.innerHTML = `
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center">
                        <span class="text-2xl mr-3">${entry.emoji || '🎨'}</span>
                        <span class="font-medium capitalize">${entry.mood}</span>
                    </div>
                    <span class="text-sm text-gray-500">
                        ${date.toLocaleDateString()} • ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                </div>
                ${entry.notes ? `<p class="text-gray-700 mt-2">${entry.notes}</p>` : ''}
            `;
            
            historyContainer.appendChild(entryElement);
        });
    } catch (error) {
        console.error('Error loading mood history:', error);
        historyContainer.innerHTML = '<p class="text-red-500">Failed to load mood history</p>';
    }
};