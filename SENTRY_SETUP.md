# Sentry Setup for FitClients

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install @sentry/react @sentry/vite-plugin
```

### 2. Environment Configuration

Create or update your `.env.local` file:

```bash
# Sentry Configuration
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
VITE_SENTRY_ENABLED=false  # Set to true to enable in development
VITE_ENVIRONMENT=production
VITE_APP_VERSION=1.0.0

# Optional: Enhanced logging to Sentry
VITE_SENTRY_DEBUG=false
VITE_SENTRY_INFO=false

# For source map uploads (production builds)
SENTRY_ORG=your-organization-slug
SENTRY_PROJECT=your-project-slug
SENTRY_AUTH_TOKEN=your-auth-token
```

### 3. Create Sentry Project

1. **Sign up** at [sentry.io](https://sentry.io)
2. **Create a new project** and select "React"
3. **Copy the DSN** from the project settings
4. **Generate an auth token** for source map uploads:
   - Go to Settings → Auth Tokens
   - Create a new token with `project:releases` and `project:write` scopes

### 4. Test the Integration

```bash
# Start development server
npm run dev

# Enable Sentry in development (optional)
VITE_SENTRY_ENABLED=true npm run dev

# Build for production (will upload source maps if configured)
npm run build
```

## 🔧 Features Enabled

### ✅ Error Tracking
- Automatically captures JavaScript errors and unhandled promises
- Filters out browser extension and network errors
- Associates errors with user context (email, ID, role)

### ✅ Performance Monitoring
- Tracks page load times and navigation
- Monitors Firebase and API call performance
- Captures user interactions and routes

### ✅ User Context
- Sets user information on login (email, ID, role)
- Clears user context on logout
- Tracks user actions with breadcrumbs

### ✅ Production Optimizations
- Only initializes in production or when explicitly enabled
- Intelligent error filtering to reduce noise
- Source map uploads for better stack traces
- Performance sampling (10% in production, 100% in development)

## 📊 What Gets Tracked

### Automatic Error Capture
```typescript
// These are automatically sent to Sentry:
- JavaScript exceptions
- Unhandled promise rejections
- Network errors (when not handled)
- React component errors (via error boundary)
```

### Manual Error Reporting
```typescript
// Use logger.error() for important errors:
logger.error(new Error('Something went wrong'), { userId: 'user-123' });

// Or use Sentry directly:
import { captureSentryException } from '@/lib/sentry';
captureSentryException(error, {
  tags: { component: 'client-form' },
  extra: { clientId: 'client-123' }
});
```

### User Actions (Breadcrumbs)
```typescript
// These actions are automatically tracked:
- User login/logout
- Page navigation
- Button clicks
- Form submissions
- API calls
```

## 🛠️ Development vs Production

### Development Mode
- Sentry only initializes if `VITE_SENTRY_ENABLED=true`
- Logs Sentry events to console for debugging
- 100% performance sampling
- No source map uploads

### Production Mode
- Automatically initializes if DSN is provided
- Silent error reporting
- 10% performance sampling
- Automatic source map uploads
- Error filtering for noise reduction

## 🚨 Error Filtering

Sentry is configured to filter out common noise:

```typescript
// Ignored errors:
- Browser extension errors
- Network errors already handled by the app
- Non-Error promise rejections
- Specific known issues (configurable)
```

## 📈 Monitoring Dashboard

In your Sentry dashboard, you'll see:

1. **Issues**: All errors grouped by type
2. **Performance**: Page load times, transaction durations
3. **Releases**: Error tracking per app version
4. **User Feedback**: Errors associated with specific users

## 🔒 Privacy & Security

- **User emails** are tracked for debugging but can be scrubbed
- **Sensitive data** is not sent (passwords, tokens, etc.)
- **Environment variables** are not included in error reports
- **Source maps** are uploaded but not publicly accessible

## 📝 Best Practices

### 1. Use Meaningful Error Messages
```typescript
// Good
throw new Error('Failed to save client data: validation failed');

// Better
logger.error('Client validation failed', { 
  clientId, 
  validationErrors,
  userAction: 'save-client'
});
```

### 2. Add Context to Errors
```typescript
// Add tags for filtering
captureSentryException(error, {
  tags: { 
    component: 'client-form',
    action: 'create-client'
  },
  extra: { 
    clientData: sanitizedClientData 
  }
});
```

### 3. Use Breadcrumbs for User Flow
```typescript
// Manual breadcrumbs for important actions
addSentryBreadcrumb('Client form submitted', 'user-action', 'info', {
  clientId,
  formFields: Object.keys(formData)
});
```

## 🆘 Troubleshooting

### Sentry Not Initializing
- Check that `VITE_SENTRY_DSN` is set correctly
- Verify environment variables are loaded
- Check browser console for initialization messages

### Source Maps Not Uploading
- Verify `SENTRY_AUTH_TOKEN` has correct permissions
- Check that build script includes source map generation
- Ensure organization and project slugs are correct

### Too Many Events
- Review error filtering configuration
- Adjust performance sampling rates
- Use Sentry's quota management features

### Missing User Context
- Verify authentication flow calls `setSentryUser()`
- Check that user context is cleared on logout
- Confirm user data structure matches expected format

## 📚 Additional Resources

- [Sentry React Documentation](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Sentry Source Maps](https://docs.sentry.io/platforms/javascript/sourcemaps/)
- [Error Filtering Guide](https://docs.sentry.io/product/data-management-settings/filtering/)

---

**Next Steps**: After installing and configuring Sentry, deploy your app and monitor the dashboard for any issues. The integration will help you catch and fix problems before users report them! 