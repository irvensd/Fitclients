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
VITE_ENABLE_ERROR_TRACKING=true
VITE_ENABLE_OFFLINE_MODE=true

# Sentry Configuration (for error tracking)
VITE_SENTRY_DSN=your_sentry_dsn_here
VITE_SENTRY_ENABLED=false
VITE_SENTRY_DEBUG=false
VITE_SENTRY_INFO=false
SENTRY_ORG=fitclients
SENTRY_PROJECT=fitclients-web
SENTRY_AUTH_TOKEN=your_sentry_auth_token_here

# API Configuration
VITE_API_BASE_URL=https://api.fitclients.io
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key_here
```

## Current Default Values

The app currently uses these hardcoded values as fallbacks:

- **Project ID**: fitclients-4c5f2
- **Auth Domain**: fitclients-4c5f2.firebaseapp.com
- **Storage Bucket**: fitclients-4c5f2.firebasestorage.app

## Sentry Setup (Error Tracking)

### 1. Create Sentry Account
1. Go to [sentry.io](https://sentry.io) and create an account
2. Create a new project for "React"
3. Copy the DSN from your project settings

### 2. Configure Environment Variables
```bash
# Required for production error tracking
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id

# Optional: Enable Sentry in development
VITE_SENTRY_ENABLED=true

# Optional: Send debug/info messages to Sentry
VITE_SENTRY_DEBUG=false
VITE_SENTRY_INFO=false

# For source map uploads (production builds)
SENTRY_ORG=your-organization-slug
SENTRY_PROJECT=your-project-slug
SENTRY_AUTH_TOKEN=your-auth-token
```

### 3. Sentry Features
- **Error Tracking**: Automatically captures JavaScript errors and exceptions
- **Performance Monitoring**: Tracks page load times and API calls
- **User Context**: Associates errors with specific users for better debugging
- **Source Maps**: Uploaded automatically for better stack traces
- **Breadcrumbs**: Tracks user actions leading up to errors

### 4. Production Deployment
- Sentry only initializes in production or when `VITE_SENTRY_ENABLED=true`
- Source maps are uploaded automatically during production builds
- Errors are filtered to reduce noise (browser extensions, network errors)

## Security Notes

- Never commit `.env.local` to version control
- Use different Firebase projects for development and production
- Use different Sentry projects for development and production
- Rotate API keys and auth tokens regularly
- Use Firebase Security Rules to protect your data 