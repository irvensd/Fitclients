# Re-enabling Firebase Database

The app is currently running in **offline demo mode** to avoid permission errors. All data is stored locally and resets on refresh.

## To Re-enable Firebase

### Step 1: Fix Firestore Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Login with: `fitclientsio@gmail.com`
3. Select project: `fitclients-4c5f2`
4. Go to **Firestore Database** → **Rules**
5. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated trainers to access their own data
    match /trainers/{trainerId} {
      allow read, write, create: if request.auth != null &&
        (request.auth.token.email == trainerId || request.auth.uid == trainerId);

      // Allow access to subcollections (clients, sessions, payments)
      match /{collection}/{document} {
        allow read, write, create, delete: if request.auth != null &&
          (request.auth.token.email == trainerId || request.auth.uid == trainerId);
      }
    }
  }
}
```

6. Click **Publish**

### Step 2: Update DataContext.tsx

In `src/contexts/DataContext.tsx`:

1. **Remove the early return** (lines 75-79):

   ```typescript
   // DELETE THESE LINES:
   console.log("Using offline mode - Firebase rules need to be deployed");
   setClients([]);
   setSessions([]);
   setPayments([]);
   setLoading(false);
   setError(null);
   return;
   ```

2. **Uncomment Firebase code** (remove `/*` and `*/` around the Firebase subscription code)

3. **Replace offline actions** with Firebase calls (uncomment the try/catch blocks in addClient, addSession, etc.)

### Step 3: Test

1. Create a new Firebase account through the app
2. Try adding a client
3. Verify data persists after refresh

## Current Offline Mode Features

- ✅ Add/edit/delete clients, sessions, payments
- ✅ Real-time UI updates
- ✅ Dashboard metrics update
- ✅ Charts populate with data
- ✅ Global search works
- ✅ Calendar shows sessions
- ⚠️ Data resets on refresh (expected behavior)

Perfect for demos and testing the new account experience!
