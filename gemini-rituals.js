import { auth, showToast } from './auth.js';
import { db } from './firebase.js';

// Rituals configuration
const rituals = [
    {
        id: 'breathing',
        title: 'Deep Breathing',
        icon: 'fas fa-wind',
        description: 'A simple 4-7-8 breathing exercise to calm your nervous system',
        duration: 5, // minutes
        steps: [
            'Find a comfortable seated position',
            'Inhale deeply through your nose for 4 seconds',
            'Hold your breath for 7 seconds',
            'Exhale completely through your mouth for 8 seconds',
            'Repeat for several cycles'
        ]
    },
    {
        id: 'grounding',
        title: '5-4-3-2-1 Grounding',
        icon: 'fas fa-mountain',
        description: 'A sensory exercise to bring you into the present moment',
        duration: 3,
        steps: [
            'Name 5 things you can see around you',
            'Name 4 things you can touch or feel',
            'Name 3 things you can hear',
            'Name 2 things you can smell',
            'Name 1 thing you can taste or appreciate'
        ]
    },
    {
        id: 'progressive',
        title: 'Muscle Relaxation',
        icon: 'fas fa-spa',
        description: 'Tense and release each muscle group to relieve tension',
        duration: 8,
        steps: [
            'Start with your feet - tense for 5 seconds, then release',
            'Move to your calves - tense and release',
            'Continue upward through each muscle group',
            'Finish with your face - scrunch and relax',
            'Notice the difference between tension and relaxation'
        ]
    },
    {
        id: 'gratitude',
        title: 'Gratitude Reflection',
        icon: 'fas fa-heart',
        description: 'Focus on positive aspects of your life',
        duration: 5,
        steps: [
            'Think of 3 things you\'re grateful for today',
            'Reflect on why each one matters to you',
            'Consider people who have helped you recently',
            'Acknowledge something positive about yourself',
            'Carry this gratitude forward into your day'
        ]
    }
];

// Music configuration
const musicTracks = [
    {
        id: 'rain',
        title: 'Gentle Rain',
        icon: 'fas fa-cloud-rain',
        duration: '30:00',
        audioSrc: 'https://assets.mixkit.co/sfx/preview/mixkit-rain-forest-1240.mp3'
    },
    {
        id: 'waves',
        title: 'Ocean Waves',
        icon: 'fas fa-water',
        duration: '30:00',
        audioSrc: 'https://assets.mixkit.co/sfx/preview/mixkit-waves-coming-to-shore-1270.mp3'
    },
    {
        id: 'forest',
        title: 'Forest Ambience',
        icon: 'fas fa-tree',
        duration: '30:00',
        audioSrc: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-ambience-1681.mp3'
    }
];

// Initialize rituals
export const initRituals = (user) => {
    renderRituals();
    renderMusicPlayer();
    setupEventListeners();
    if (user) {
        trackRitualUsage(user);
    }
};

// Render ritual cards
const renderRituals = () => {
    const container = document.getElementById('rituals-container');
    container.innerHTML = '';

    rituals.forEach(ritual => {
        const card = document.createElement('div');
        card.className = 'ritual-card bg-white p-6 rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition';
        card.innerHTML = `
            <div class="flex items-start">
                <div class="text-2xl text-accent mr-4">
                    <i class="${ritual.icon}"></i>
                </div>
                <div>
                    <h3 class="font-semibold text-lg text-dark mb-1">${ritual.title}</h3>
                    <p class="text-gray-600 text-sm mb-2">${ritual.description}</p>
                    <span class="text-xs text-gray-500">${ritual.duration} min</span>
                </div>
            </div>
        `;
        card.addEventListener('click', () => showRitual(ritual));
        container.appendChild(card);
    });
};

// Show selected ritual
const showRitual = (ritual) => {
    const container = document.getElementById('active-ritual-container');
    const title = document.getElementById('active-ritual-title');
    const content = document.getElementById('ritual-content');

    // Set title
    title.textContent = ritual.title;

    // Build content based on ritual type
    if (ritual.id === 'breathing') {
        content.innerHTML = `
            <div class="text-center">
                <div class="breathing-circle w-40 h-40 bg-accent/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <div class="text-4xl">🌬️</div>
                </div>
                <div class="space-y-4">
                    ${ritual.steps.map(step => `<p class="text-gray-700">${step}</p>`).join('')}
                </div>
                <div class="mt-6">
                    <button id="start-breathing" class="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-6 rounded-full transition">
                        Start Breathing Exercise
                    </button>
                </div>
            </div>
        `;
    } else {
        content.innerHTML = `
            <div class="space-y-4">
                <h4 class="font-medium text-dark">Instructions:</h4>
                <ol class="list-decimal list-inside space-y-2">
                    ${ritual.steps.map(step => `<li class="text-gray-700">${step}</li>`).join('')}
                </ol>
                <div class="mt-6">
                    <button class="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-6 rounded-full transition">
                        Start ${ritual.duration} Minute Session
                    </button>
                </div>
            </div>
        `;
    }

    // Show the container
    container.classList.remove('hidden');
};

// Render music player
const renderMusicPlayer = () => {
    const container = document.getElementById('music-container');
    container.innerHTML = '';

    musicTracks.forEach(track => {
        const player = document.createElement('div');
        player.className = 'bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition';
        player.innerHTML = `
            <div class="flex items-center mb-3">
                <div class="text-accent text-xl mr-3">
                    <i class="${track.icon}"></i>
                </div>
                <h4 class="font-medium text-dark">${track.title}</h4>
            </div>
            <audio controls class="w-full">
                <source src="${track.audioSrc}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
            <div class="text-xs text-gray-500 mt-1">${track.duration}</div>
        `;
        container.appendChild(player);
    });
};

// Track ritual usage in Firestore
const trackRitualUsage = async (user) => {
    try {
        await db.collection('ritualUsage').doc(user.uid).set({
            lastAccessed: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error('Error tracking ritual usage:', error);
    }
};

// Setup event listeners
const setupEventListeners = () => {
    // Close ritual button
    document.getElementById('close-ritual')?.addEventListener('click', () => {
        document.getElementById('active-ritual-container').classList.add('hidden');
    });

    // Breathing exercise button
    document.addEventListener('click', (e) => {
        if (e.target.id === 'start-breathing') {
            startBreathingExercise();
        }
    });
};

// Start breathing exercise
const startBreathingExercise = () => {
    const button = document.getElementById('start-breathing');
    button.disabled = true;
    button.textContent = 'Exercise in progress...';

    // Simple breathing animation
    const circle = document.querySelector('.breathing-circle');
    circle.style.animation = 'pulse 8s infinite ease-in-out';

    // Timer for 5 minutes
    let timeLeft = 5 * 60;
    const timer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timer);
            button.disabled = false;
            button.textContent = 'Complete! Start Again?';
            circle.style.animation = 'none';
        }
    }, 1000);
};