# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Bundai is a Japanese language learning web application focused on Kanji, vocabulary, and spaced repetition systems (SRS). The app is built with React + Vite and uses Apollo Client for GraphQL API communication.

## Development Commands

### Running the application
```bash
npm run dev       # Start development server with hot reload
npm run preview   # Preview production build locally
```

### Building and linting
```bash
npm run build     # Production build using Vite
npm run lint      # Run ESLint checks
```

### Package management
This project uses npm (not yarn despite the yarn.lock file). Use `npm install` to install dependencies.

## Architecture

### Technology Stack
- **React 19** with JSX (no TypeScript except for `src/lib/utils.ts`)
- **Vite** for build tooling
- **React Router DOM v7** for routing
- **Apollo Client** for GraphQL API calls
- **Tailwind CSS v4** with custom animations via `tw-animate-css`
- **Radix UI** for accessible component primitives

### API Configuration
- GraphQL API endpoint: `https://api.bundai.app/graphql`
- Apollo Client configured in `src/lib/apolloClient.js`
- No authentication headers in Apollo setup; auth tokens stored in localStorage

### Authentication System
Authentication is managed via localStorage with the following pattern:
- Token key: `bundaiAuthToken` (defined in `src/lib/auth.js`)
- Additional user data stored: `userId`, `userEmail`, `userName`, `verified`, `passed`
- Custom event `bundai:auth-change` dispatched on auth state changes
- Helper functions: `hasAuthToken()`, `setAuthData()`, `getAuthData()`, `clearAuthToken()`

### Project Structure

#### Source Code Organization
- `src/pages/` - Full page components (screens) with `.screen.jsx` naming convention
- `src/components/` - Reusable UI components (Button, GlassCard, Sidebar, AnimatedBackground)
- `src/layouts/` - Layout wrappers (DashboardLayout with auth protection)
- `src/graphql/mutations/` - GraphQL mutation definitions using `graphql-tag`
- `src/graphql/queries/` - GraphQL query definitions
- `src/lib/` - Core utilities (apolloClient, auth, utils)
- `src/util/` - Data files and business logic (jlptArray.js, levelSystem.js, similar.json)
- `src/theme/` - Theme configuration
- `src/assets/` - Static assets

#### Mobile App
- `mobileSrc/` contains a separate mobile application codebase (React Native)
- Similar structure to web app but not directly related to this web build

### Routing Architecture

The app uses a two-tier routing structure:

**Public routes:**
- `/` - Landing page
- `/login`, `/signup`, `/forgot-password` - Authentication flows
- `/terms`, `/privacy`, `/refund` - Legal pages

**Protected routes** (wrapped in `DashboardLayout`):
- `/dashboard` - Main dashboard with kanji categories
- `/dashboard/kanji-template` - Kanji listing by category
- `/dashboard/kanji-detail` - Individual kanji details
- `/dashboard/quiz`, `/dashboard/quiz-engine` - Quiz modes
- `/dashboard/srs`, `/dashboard/srs-engine` - Spaced repetition system
- `/dashboard/similars`, `/dashboard/similar-detail` - Similar kanji comparison
- `/dashboard/settings` - User settings

### Layout System

`DashboardLayout` provides two rendering modes:

1. **Full-screen mode** (no sidebar):
   - Used for: kanji-template, kanji-detail, quiz-engine, srs-engine, similar-detail
   - Background color: `#f7f5ff`

2. **Regular mode** (with sidebar):
   - Desktop: Sidebar always visible (left: 256px / 16rem)
   - Mobile: Hamburger menu to toggle sidebar
   - All other dashboard routes use this mode

### Data Architecture

#### Kanji Learning System
The app implements a 50-level progressive learning system based on JLPT levels:

- **Levels 1-4**: JLPT N5 (~80 kanji, 20 per level, 30 words per level)
- **Levels 5-10**: JLPT N4 (~166 kanji, 25-28 per level, 40 words per level)
- **Levels 11-20**: JLPT N3 (~367 kanji, 35-40 per level, 45-50 words per level)
- **Levels 21-30**: JLPT N2 (~367 kanji, 35-40 per level, 50-55 words per level)
- **Levels 31-50**: JLPT N1 (~1020 kanji, 45-55 per level, 60-70 words per level)

Configuration: `src/util/levelSystem.js`
- `getLevelContent(level)` - Returns kanji and words for a specific level
- `getLevelInfo(level)` - Returns metadata about a level
- Words are filtered by "easiness factor" - only words using known kanji from current/previous levels

#### Data Sources
- `src/util/jlptArray.js` - Large (~7.5MB) file containing all JLPT kanji data with readings, meanings, and usage examples
- `src/util/similar.json` - Similar kanji comparison data (~2.6MB)
- `src/util/hiragana.json`, `src/util/katakana.json` - Kana character sets
- `src/util/constants.js` - App-wide constants (topics, words categories, kana)

### GraphQL Operations

#### Mutations
- `logIn`, `signUp`, `logOut` - Authentication
- `forgetPassword` - Password reset
- `addFlashCard`, `addBulkFlashCard` - Flashcard management
- `calculateNextReviewDate` - SRS date calculation

#### Queries
- `me` - Current user data
- `findPendingCards` - Cards due for review

All GraphQL files use `gql` from `graphql-tag` or `@apollo/client`.

### Styling System

**Color Palette** (defined in `src/colors.js` and used throughout):
- Primary Purple: `#5632d4`
- Light Purple: `#dcd5ff`
- Hover Purple: `#8c7bfa`
- Background: `#f7f5ff`
- Card Background: `#ffffff`
- Text Dark: `#1f1a3d`
- Text Muted: `#5b6070`

**Tailwind Configuration:**
- Uses Tailwind CSS v4 with Vite plugin (`@tailwindcss/vite`)
- Custom animations from `tw-animate-css`
- Import order in `src/index.css`: tailwindcss → tw-animate-css → custom CSS

### State Management Pattern

The app primarily uses:
- React hooks (`useState`, `useEffect`) for local component state
- `useNavigate()` and `useLocation()` from React Router for routing
- Apollo Client hooks (`useMutation`, `useQuery`) for server state
- localStorage for persistent auth state
- No global state management library (Redux/Zustand/etc.)

## Code Conventions

### File Naming
- Pages: `*.screen.jsx` (e.g., `dashboard.screen.jsx`)
- Components: PascalCase.jsx (e.g., `Button.jsx`)
- GraphQL operations: `*.mutation.js` or `*.query.js`
- Utilities: camelCase.js (e.g., `levelSystem.js`)

### Component Export Pattern
- Default exports for pages and major components
- Named exports for utility functions

### ESLint Configuration
- Modern flat config format (`eslint.config.js`)
- React Hooks rules enforced
- Unused vars allowed if they match pattern `^[A-Z_]` (constants)
- Fast Refresh enabled for development

### Navigation State Pattern
Pages receive data via `navigate()` with state object:
```javascript
navigate('/dashboard/kanji-template', {
  state: {
    jlptLevel: 5,
    title: 'JLPT Level 5'
  }
})
```

Receiving page uses: `const location = useLocation()` then accesses `location.state`.

## Important Notes

### No Test Framework
This project does not have testing configured. Do not assume Jest, Vitest, or any test runner is available.

### No TypeScript
Only one file uses TypeScript: `src/lib/utils.ts`. All other files are plain JavaScript with JSX.

### Large Data Files
`src/util/jlptArray.js` and `src/util/similar.json` are very large files. Avoid reading them entirely; use targeted operations when possible.

### Authentication Flow
Always check `hasAuthToken()` before accessing protected routes. The `DashboardLayout` handles this automatically, but be aware of the pattern when creating new authenticated flows.

### GraphQL Error Handling
Mutations return an `errorMessage` field. Always check this field in the response before assuming success.
