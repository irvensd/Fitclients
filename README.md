# FitClient CRM

A modern, production-ready CRM application specifically designed for personal trainers and fitness coaches.

## 🏋️ Features

- **Client Management**: Add, edit, and track client profiles with fitness levels and goals
- **Admin Dashboard**: Overview of total clients, upcoming sessions, and unpaid invoices
- **Authentication**: Secure trainer-only login with Firebase Auth
- **Responsive Design**: Works seamlessly on all devices
- **Modern UI**: Clean, professional interface with dark sidebar navigation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase project for authentication

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up Firebase Authentication:

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing one
   - Enable Authentication → Sign-in method → Email/Password
   - Go to Project Settings → General → Your apps → Web app
   - Copy the config values

4. Create environment file:
   ```bash
   cp .env.example .env
   ```
5. Update `.env` with your Firebase configuration values

6. Start the development server:
   ```bash
   npm run dev
   ```

## 🔐 Authentication

The application uses Firebase Authentication with email/password sign-in:

- **Public Routes**: Landing page (`/`), Login page (`/login`)
- **Protected Routes**: All admin CRM functionality requires authentication
- **Demo Account**: Use `trainer@demo.com` / `demo123` for testing (requires Firebase setup)

## 📱 Routes

- `/` - Landing page (redirects to `/admin` if authenticated)
- `/login` - Trainer login page
- `/admin` - Dashboard (protected)
- `/clients` - Client management (protected)
- `/sessions` - Sessions management (placeholder)
- `/workouts` - Workout plans (placeholder)
- `/payments` - Payment tracking (placeholder)
- `/progress` - Progress tracking (placeholder)

## 🛠️ Development

```bash
# Development server
npm run dev

# Type checking
npm run typecheck

# Build for production
npm run build

# Run tests
npm test
```

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn/ui components
│   ├── Layout.tsx       # Main app layout with sidebar
│   ├── ProtectedRoute.tsx # Route protection
│   └── LandingRedirect.tsx # Landing page logic
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Firebase auth context
├── lib/                 # Utilities and configuration
│   ├── firebase.ts      # Firebase setup
│   ├── types.ts         # TypeScript types
│   └── utils.ts         # Utility functions
├── pages/               # Page components
│   ├── Landing.tsx      # Marketing landing page
│   ├── Login.tsx        # Authentication page
│   ├── Dashboard.tsx    # Admin dashboard
│   ├── Clients.tsx      # Client management
│   └── ...              # Other CRM pages
└── App.tsx              # Main app component
```

## 🎨 Design System

- **Colors**: Fitness-focused green primary (`#22C55E`) with professional grays
- **Typography**: Clean, modern fonts optimized for readability
- **Layout**: Responsive design with collapsible sidebar navigation
- **Components**: Built with Radix UI primitives and TailwindCSS

## 📋 MVP Features Status

- ✅ **Client Management**: Fully implemented with CRUD operations
- ✅ **Authentication**: Firebase Auth with trainer login
- ✅ **Dashboard**: Admin overview with key metrics
- ✅ **Landing Page**: Optimized marketing page
- 🔄 **Sessions**: Placeholder (ready for implementation)
- 🔄 **Workouts**: Placeholder (ready for implementation)
- 🔄 **Payments**: Placeholder (ready for implementation)
- 🔄 **Progress**: Placeholder (ready for implementation)

## 🔒 Security

- Firebase Authentication handles all auth flows
- Protected routes prevent unauthorized access
- Environment variables for sensitive configuration
- HTTPS required for production deployment

## 📧 Support

This is a demo application built for personal trainers. For production use, ensure proper Firebase project setup and security rules configuration.
