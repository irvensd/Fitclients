# Environment Setup Guide

## Firebase Configuration

Create a `.env.local` file in the root directory with the following variables:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# App Configuration
VITE_APP_NAME=FitClients
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=false
VITE_ENABLE_OFFLINE_MODE=true

# API Configuration
VITE_API_BASE_URL=https://api.fitclients.io
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key_here
```

## Current Default Values

The app currently uses these hardcoded values as fallbacks:

- **Project ID**: fitclients-4c5f2
- **Auth Domain**: fitclients-4c5f2.firebaseapp.com
- **Storage Bucket**: fitclients-4c5f2.firebasestorage.app

## Security Notes

- Never commit `.env.local` to version control
- Use different Firebase projects for development and production
- Rotate API keys regularly
- Use Firebase Security Rules to protect your data 