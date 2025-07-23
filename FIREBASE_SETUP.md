# Firebase Setup Instructions

## 🔥 **Step 1: Create Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `to-be-budgeted` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 🔐 **Step 2: Enable Authentication**

1. In Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable these providers:
   - **Email/Password** (enable)
   - **Google** (enable)
5. For Google, you'll need to configure OAuth consent screen

## 📊 **Step 3: Enable Firestore Database**

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select a location close to your users
5. Click "Done"

## ⚙️ **Step 4: Get Your Config**

1. In Firebase Console, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register app with nickname: `to-be-budgeted-web`
6. Copy the config object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## 🔧 **Step 5: Update Your Code**

1. Open `src/firebase.js`
2. Replace the placeholder config with your actual Firebase config
3. Save the file

## 🚀 **Step 6: Test It**

1. Run your app: `npm run dev`
2. You should see the login page for "To be budgeted"
3. Try signing up with email/password or Google
4. After successful login, you'll be redirected to the dashboard

## 📝 **Next Steps**

- [ ] Set up Firestore security rules
- [ ] Connect transactions to Firestore
- [ ] Add user data persistence
- [ ] Implement real-time updates

## 🔒 **Security Rules (Later)**

When you're ready, update Firestore security rules to protect user data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /users/{userId}/transactions/{document} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /users/{userId}/goals/{document} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
``` 