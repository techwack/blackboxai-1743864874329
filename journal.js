import { auth, db } from './firebase.js';

// DOM elements
const promptsContainer = document.getElementById('promptsContainer');
const journalEntry = document.getElementById('journalEntry');
const newPromptBtn = document.getElementById('newPromptBtn');
const saveEntryBtn = document.getElementById('saveEntryBtn');
const entriesContainer = document.getElementById('entriesContainer');

// State
let currentPrompt = null;

// Initialize
loadPrompts();
loadPreviousEntries();

// Event listeners
newPromptBtn.addEventListener('click', loadPrompts);
saveEntryBtn.addEventListener('click', saveJournalEntry);

// Load gentle prompts (in production, these would come from Gemini API)
async function loadPrompts() {
    try {
        promptsContainer.innerHTML = `
            <div class="text-center py-4 col-span-2">
                <div class="animate-pulse">
                    <i class="fas fa-spinner fa-spin text-gray-400 text-2xl mb-2"></i>
                    <p class="text-gray-500">Loading thoughtful prompts...</p>
                </div>
            </div>
        `;

        // Sample prompts (in real app, fetch from Gemini API)
        const prompts = [
            "What's something small that brought you comfort today?",
            "Describe a moment when you felt truly understood",
            "What would your ideal day of rest look like?",
            "Write a letter to your future self about how you're feeling right now",
            "What's something you're grateful for in this moment?"
        ];

        // Display prompts
        promptsContainer.innerHTML = prompts.map(prompt => `
            <div class="prompt-card bg-white p-4 rounded-lg border border-gray-100 cursor-pointer hover:border-pink-200">
                <p class="text-gray-700">${prompt}</p>
                <button class="mt-3 text-sm text-pink-500 hover:text-pink-700 use-prompt" data-prompt="${prompt}">
                    <i class="fas fa-angle-right mr-1"></i> Use this prompt
                </button>
            </div>
        `).join('');

        // Add event listeners to prompt buttons
        document.querySelectorAll('.use-prompt').forEach(btn => {
            btn.addEventListener('click', (e) => {
                currentPrompt = e.target.dataset.prompt;
                journalEntry.value = currentPrompt + '\n\n';
                journalEntry.focus();
            });
        });

    } catch (error) {
        console.error("Error loading prompts:", error);
        promptsContainer.innerHTML = `
            <div class="text-center py-4 col-span-2 text-red-500">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                Couldn't load prompts. Try again later.
            </div>
        `;
    }
}

// Load previous journal entries
async function loadPreviousEntries() {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const snapshot = await db.collection('journalEntries')
            .where('userId', '==', userId)
            .orderBy('timestamp', 'desc')
            .limit(5)
            .get();

        if (snapshot.empty) {
            entriesContainer.innerHTML = '<p class="text-gray-500 text-center py-4">No entries yet. Your thoughts are safe here.</p>';
            return;
        }

        entriesContainer.innerHTML = snapshot.docs.map(doc => {
            const data = doc.data();
            const date = data.timestamp?.toDate() || new Date();
            return `
                <div class="border-b border-gray-100 py-4 last:border-0">
                    <p class="text-sm text-gray-500 mb-2">${date.toLocaleDateString()}</p>
                    <p class="text-gray-700 whitespace-pre-line">${data.entry}</p>
                    ${data.prompt ? `<p class="text-xs text-gray-400 mt-2">Prompt: ${data.prompt}</p>` : ''}
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error("Error loading entries:", error);
        entriesContainer.innerHTML = `
            <div class="text-center py-4 text-red-500">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                Couldn't load entries. Try again later.
            </div>
        `;
    }
}

// Save journal entry to Firebase
async function saveJournalEntry() {
    if (!journalEntry.value.trim()) {
        alert("Please write something before saving");
        return;
    }

    try {
        saveEntryBtn.disabled = true;
        saveEntryBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Saving...';

        const userId = auth.currentUser?.uid || 'anonymous';
        const entryData = {
            entry: journalEntry.value.trim(),
            prompt: currentPrompt || null,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userId: userId
        };

        await db.collection('journalEntries').add(entryData);

        // Reset form
        journalEntry.value = '';
        currentPrompt = null;
        saveEntryBtn.innerHTML = '<i class="fas fa-save mr-2"></i> Save Entry';
        saveEntryBtn.disabled = false;

        // Reload entries
        loadPreviousEntries();

        // Show success
        const successMsg = document.createElement('div');
        successMsg.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg';
        successMsg.innerHTML = '<i class="fas fa-check mr-2"></i>Entry saved';
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 3000);

    } catch (error) {
        console.error("Error saving entry:", error);
        saveEntryBtn.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i> Try Again';
        saveEntryBtn.disabled = false;
    }
}

// Handle auth state changes
auth.onAuthStateChanged((user) => {
    if (!user) {
        auth.signInAnonymously().catch(error => {
            console.error("Anonymous sign-in failed:", error);
        });
    } else {
        loadPreviousEntries();
    }
});