# Contributing to FitClient

Thank you for your interest in contributing to FitClient! This document provides guidelines and information for contributors.

## 🚀 Quick Start

### Prerequisites

- Node.js 18 and npm
- Git
- A code editor (VS Code recommended)
- Firebase project (for production features)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Fitclients.git
   cd Fitclients
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Open http://localhost:5173e demo credentials: `trainer@demo.com` / `demo123 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn/ui components
│   └── ...              # Custom components
├── contexts/            # React contexts (Auth, Data, etc.)
├── hooks/               # Custom React hooks
├── lib/                 # Utilities, services, and types
├── pages/               # Page components
└── App.tsx              # Main app component
```

## 📝 Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **Prettier**: Code is automatically formatted with Prettier
- **ESLint**: Follow ESLint rules for code quality
- **Naming**: Use descriptive names for variables, functions, and components

### Component Guidelines

- **Functional Components**: Use functional components with hooks
- **Props Interface**: Define TypeScript interfaces for component props
- **File Naming**: Use PascalCase for component files (e.g., `ClientCard.tsx`)
- **Export**: Use named exports for components

```typescript
interface ClientCardProps {
  client: Client;
  onEdit?: (client: Client) => void;
}

export const ClientCard = ({ client, onEdit }: ClientCardProps) => {
  // Component implementation
};
```

### State Management

- **Context**: Use React Context for global state (Auth, Data, Subscription)
- **Local State**: Use `useState` for component-specific state
- **Custom Hooks**: Extract reusable logic into custom hooks

### Styling

- **TailwindCSS**: Use TailwindCSS for styling
- **Shadcn/ui**: Use existing Shadcn/ui components when possible
- **Responsive**: Ensure components work on mobile and desktop
- **Accessibility**: Follow accessibility best practices

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- **Unit Tests**: Test utility functions and business logic
- **Component Tests**: Test React components with Vitest + React Testing Library
- **Test Files**: Use `.spec.ts` or `.test.ts` extension
- **Test Structure**: Use `describe` and `it` blocks

```typescript
import { describe, it, expect } from vitest;
import { render, screen } from@testing-library/react;
import { ClientCard } from./ClientCard';

describe('ClientCard', () => {
  it('should display client name', () => {
    const client = { id: '1', name: 'John Doe', email: 'john@example.com' };
    render(<ClientCard client={client} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

## 🔧 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Write clean, well-documented code
- Add tests for new functionality
- Update documentation if needed
- Follow the existing code patterns

### 3. Test Your Changes

```bash
# Type checking
npm run typecheck

# Run tests
npm test

# Build the project
npm run build
```

### 4. Commit Your Changes

Use conventional commit messages:

```bash
git commit -mfeat: add client search functionality"
git commit -m "fix: resolve session scheduling bug"
git commit -m docs: update README with new features"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 5sh and Create Pull Request

```bash
git push origin feature/your-feature-name
```

## 🔄 Pull Request Process

### Before Submitting
1*Ensure Tests Pass**: All tests should pass
2**Type Checking**: No TypeScript errors
3**Build Success**: Project builds without errors
4. **Code Review**: Self-review your changes

### Pull Request Template

When creating a PR, include:

- **Description**: What changes were made and why
- **Testing**: How to test the changes
- **Screenshots**: If UI changes were made
- **Checklist**: Ensure all items are completed

### Review Process1. **Code Review**: Maintainers will review your code2hecks**: Automated tests and builds must pass
3. **Approval**: At least one maintainer must approve
4. **Merge**: Changes will be merged after approval

## 🐛 Bug Reports

### Before Reporting
1ck existing issues for duplicates
2. Try to reproduce the issue
3ck if itsa known issue

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**Steps to Reproduce**1 to...2. Click on ...
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g. macOS, Windows]
- Browser: [e.g. Chrome, Safari]
- Version: [e.g. 1.0Additional Context**
Any other context about the problem
```

## 💡 Feature Requests

### Before Requesting

1. Check if the feature already exists2sider if it aligns with the project goals
3. Think about implementation complexity

### Feature Request Template

```markdown
**Problem Statement**
What problem does this feature solve?

**Proposed Solution**
How should this feature work?

**Alternative Solutions**
Other ways to solve this problem

**Additional Context**
Any other relevant information
```

## 🔒 Security

### Reporting Security Issues

- **DO NOT** create a public issue for security vulnerabilities
- Email security issues to: [security@fitclients.io]
- Include detailed information about the vulnerability
- Allow time for investigation and fix

## 📚 Resources

### Documentation

- [README.md](./README.md) - Project overview and setup
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Firebase configuration
- [DOMAIN_SETUP.md](./DOMAIN_SETUP.md) - Domain configuration

### Technologies

- [React](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [Firebase](https://firebase.google.com/) - Backend services
- [Vitest](https://vitest.dev/) - Testing framework

## 🤝 Community

### Getting Help

- **Issues**: Use GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Code of Conduct**: Be respectful and inclusive

### Recognition

Contributors will be recognized in:
- Project README
- Release notes
- GitHub contributors page

## 📄 License

By contributing to FitClient, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to FitClient! 🚀 