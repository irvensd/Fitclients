# Firebase Deployment Instructions

## Issue: Firestore Permission Denied Errors

The app is encountering permission denied errors because Firestore security rules need to be deployed to the Firebase project.

## Solution: Deploy Firestore Rules

### Method 1: Using Firebase CLI (Recommended)

1. **Install Firebase CLI** (if not already installed):

   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:

   ```bash
   firebase login
   ```

3. **Initialize the project** (if not already done):

   ```bash
   firebase init firestore
   ```

   - Select existing project: `fitclients-4c5f2`
   - Use existing `firestore.rules` file
   - Use existing `firestore.indexes.json` file

4. **Deploy the rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Method 2: Via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `fitclients-4c5f2`
3. Navigate to **Firestore Database** → **Rules**
4. Replace the rules with the content from `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated trainers to access their own data
    // Using email as the document ID for trainers
    match /trainers/{trainerId} {
      allow read, write, create: if request.auth != null &&
        (request.auth.token.email == trainerId || request.auth.uid == trainerId);

      // Allow access to subcollections (clients, sessions, payments)
      // Only the owner trainer can access their subcollections
      match /{collection}/{document} {
        allow read, write, create, delete: if request.auth != null &&
          (request.auth.token.email == trainerId || request.auth.uid == trainerId);
      }
    }

    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. Click **Publish**

## Temporary Workaround

Until the rules are deployed, users can:

1. **Use Demo Account**: `trainer@demo.com` / `demo123` (works in offline mode)
2. **View Error Message**: The app shows a helpful error message explaining the situation
3. **Continue Development**: The app gracefully handles the permission errors

## Database Structure

The app uses this Firestore structure:

```
/trainers/{userEmail}/
  ├── clients/{clientId}
  ├── sessions/{sessionId}
  └── payments/{paymentId}
```

Each trainer's data is completely isolated using their email as the document ID.

## Verification

After deploying rules, test by:

1. Creating a new Firebase account
2. Logging into the app
3. Trying to add a client (should work without permission errors)
