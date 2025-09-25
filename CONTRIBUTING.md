# Contributing to Control Desktop

Thank you for your interest in contributing to Control Desktop! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Environment Setup](#development-environment-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)
- [Community](#community)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/Greatness0123/control-desktop.git`
3. Add the upstream repository: `git remote add upstream https://github.com/Greatness0123/control-desktop.git`
4. Create a new branch for your feature or bugfix: `git checkout -b feature/your-feature-name`

## Development Environment Setup

### Prerequisites

- Node.js (v20.x or later)
- pnpm (v9.x or later)
- Git

### Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration.

3. Start the development server:
   ```bash
   pnpm dev
   ```

## Project Structure

The project follows a monorepo structure using pnpm workspaces:

```
control-desktop/
├── apps/
│   └── ui-tars/         # Main desktop application
│       ├── src/
│       │   ├── main/    # Electron main process
│       │   ├── preload/ # Electron preload scripts
│       │   └── renderer/ # React frontend
├── multimodal/          # Multimodal processing modules
├── packages/            # Shared packages and libraries
├── docs/                # Documentation
└── scripts/             # Build and utility scripts
```

## Coding Standards

This project follows strict coding standards to maintain code quality and consistency:

### TypeScript

- Use TypeScript for all new code
- Follow the existing type definitions
- Avoid using `any` type when possible
- Use interfaces for object shapes

### React

- Use functional components with hooks
- Follow the component structure in the existing codebase
- Use the UI component library for consistent styling

### Electron

- Follow Electron security best practices
- Use IPC communication patterns consistently
- Separate concerns between main and renderer processes

### Formatting

The project uses ESLint and Prettier for code formatting:

- Run `pnpm lint` to check for linting issues
- Run `pnpm format` to automatically format code

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types include:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or modifying tests
- `chore`: Changes to the build process or auxiliary tools

Examples:
```
feat(chat): add file attachment feature
fix(ui): correct button alignment in chat input
docs: update README with new installation instructions
```

## Pull Request Process

1. Update your fork with the latest changes from upstream:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. Ensure your code passes all tests and linting:
   ```bash
   pnpm test
   pnpm lint
   ```

3. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a pull request against the `main` branch of the original repository.

5. In your pull request description:
   - Clearly describe the changes
   - Link to any related issues
   - Include screenshots for UI changes
   - Explain your testing approach

6. Wait for code review and address any feedback.

## Testing

All new features and bug fixes should include appropriate tests:

- Unit tests for utility functions and components
- Integration tests for complex features
- E2E tests for critical user flows

Run tests with:
```bash
pnpm test
```

## Documentation

Documentation is crucial for the project:

- Update README.md when adding new features
- Document new components and functions with JSDoc comments
- Create or update markdown files in the `docs/` directory for complex features
- Include usage examples where appropriate

## Issue Reporting

When reporting issues, please use the issue templates and include:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Environment information (OS, Node version, etc.)

## Feature Requests

Feature requests are welcome! Please use the feature request template and:

- Clearly describe the feature
- Explain the use case and benefits
- Suggest an implementation approach if possible
- Consider how it fits with the existing architecture

## Community

Join our community channels to discuss the project:

- [GitHub Discussions](https://github.com/Greatness0123/control-desktop/discussions)
- [Discord Server](https://discord.gg/control-desktop)

## License

By contributing to Control Desktop, you agree that your contributions will be licensed under the project's [Apache-2.0 License](LICENSE).