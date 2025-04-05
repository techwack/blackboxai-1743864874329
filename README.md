
Built by https://www.blackbox.ai

---

```markdown
# Warm Hug | A Comforting Companion

## Project Overview
Warm Hug is a web application designed to provide users with a comforting digital experience. It includes features such as mood tracking, journaling, chat companions, and relaxation rituals. The application utilizes Firebase for authentication and data storage, ensuring user privacy and easy access to cloud-based data.

## Installation
To run this project locally, you need to set up a Firebase project, initialize Firebase in your app, and replace the placeholder API keys in `firebase.js` with your own.

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/warm-hug.git
   cd warm-hug
   ```

2. Configure your Firebase project:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable Firestore and Authentication (Email/Password and Google sign-in).
   - Copy the configuration details into `firebase.js`.

3. Open `index.html` in your browser:
   ```bash
   open index.html
   ```

## Usage
- **Mood Check-In**: Users can log their moods by selecting an emoji or color and adding an optional note.
- **Journal**: Users can write journal entries either freely or guided by prompts.
- **Chat Companion**: Users can engage in a chat with an AI companion designed to listen without judgments.
- **Reset Rituals**: Various calming exercises and music options are available to help users recenter and find peace.

## Features
- **User Authentication**: Allows users to sign in using Google or anonymously.
- **Mood Tracking**: Users can select their mood and add notes, which are stored in Firebase Firestore.
- **Journaling**: Free writing or guided prompts to help express thoughts and feelings.
- **AI Chat Companion**: Conversational AI that provides comforting responses to user input.
- **Relaxation Rituals**: Breathing exercises, calming music, and creative prompts for stress relief.

## Dependencies
The project uses the following dependencies:
- **Tailwind CSS**: For styling the components responsive and aesthetically.
- **Firebase SDK**: For user authentication and Firestore database functionality.
- **Font Awesome**: For icons used throughout the application.

Ensure you have these included in your `index.html`:
```html
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
<script src="https://www.gstatic.com/firebasejs/9.6.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore-compat.js"></script>
```

## Project Structure
```
/warm-hug
|-- index.html          # Main landing page
|-- firebase.js         # Firebase configuration and initialization
|-- auth.js             # User authentication logic
|-- mood-checkin.html   # Mood check-in page
|-- mood.js             # Mood check-in functionality
|-- journal.html        # Journal page
|-- journal.js          # Journal functionality
|-- chat.html           # Chat companion page
|-- gemini-chat.js      # Chat functionality
|-- rituals.html        # Rituals page
|-- gemini-rituals.js   # Rituals functionality
|-- mood-checkin.html   # Mood selection interface
|-- mood.js             # Mood tracking logic
|-- styles.css          # Custom CSS styles (alternatively included within HTML)
```

## Contribution
If you would like to contribute to this project, feel free to fork the repository and submit a pull request. We appreciate any help!

## License
This project is licensed under the MIT License. See the LICENSE file for more information.
```