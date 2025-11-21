# 📚 Shared Libraries (`packages/`)

The shared packages in the monorepo are designed to be independent and reusable modules, ensuring consistency and separation of concerns. **We use the `packages/` directory, which is common in Turborepo structures.**

## Package Overview

| Directory | Purpose | Key Exports | Dependencies | Peer Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| **`packages/auth`** | Authentication and authorization logic. Provides hooks to access user state and authentication mutations. | `AuthProvider`, `useAuth`, `ProtectedRoute`, `useSignInMutation`, `useSignUpMutation`, `useGoogleOAuthMutation`, `usePasswordRecoveryMutation`, `useResetPasswordMutation`, `useUserQuery` | `@templatev2/config`, `@supabase/supabase-js`, `@tanstack/react-query` | `react`, `react-dom`, `next`, `@chakra-ui/react` |
| **`packages/data`** | Server state management logic for application data (distinct from Auth). Contains React Query hooks for data fetching and mutations. | `useDashboardData`, `useCreateTaskMutation`, `useUpdateTaskMutation`, `DashboardTask` types | `@templatev2/auth`, `@templatev2/config`, `@supabase/supabase-js`, `@tanstack/react-query` | `react`, `react-dom` |
| **`packages/ui`** | Base React components built on top of Chakra UI v3.29 and Tailwind utilities. Includes theming configuration. | `Button`, `Layout`, `Header`, `Sidebar`, `TaskList`, `TaskItem`, `CreateTaskForm`, `LoadingSkeleton`, `theme`, and wrapper components for Chakra UI primitives | `@emotion/react`, `@emotion/styled`, `framer-motion`, `react`, `react-dom` | `@templatev2/config`, `@templatev2/data`, `@templatev2/i18n`, `next`, `react`, `react-dom`, `react-i18next` |
| **`packages/i18n`** | Internationalization configuration. Provides the provider and loads translation files. | `I18nProvider`, `i18n`, translation JSON files (en.json, es.json) | `i18next`, `react`, `react-i18next` | `react`, `react-dom`, `next` |
| **`packages/config`** | Storage for environment variables, Supabase client configuration, and Zustand stores. Contains shared configuration and client-side state. | `supabaseClient`, `useSidebarStore`, `useLanguageStore`, database types | `@supabase/supabase-js`, `zustand` | None |

## Detailed Package Descriptions

### `packages/auth`

**Purpose**: Centralizes all authentication logic and provides React Context for user state management.

**Key Components**:
- `AuthProvider`: React Context provider that manages user session state
- `ProtectedRoute`: HOC/Component for protecting routes that require authentication

**Key Hooks**:
- `useAuth()`: Access current user, loading state, and signOut function
- `useUserQuery()`: React Query hook to fetch authenticated user
- `useSignInMutation()`: Email/password sign-in mutation
- `useSignUpMutation()`: Email/password sign-up mutation with email verification
- `useGoogleOAuthMutation()`: Google OAuth sign-in flow
- `usePasswordRecoveryMutation()`: Send password recovery email
- `useResetPasswordMutation()`: Reset password with recovery token

**Integration**: The `AuthProvider` wraps the application in `apps/web/src/app/providers.tsx`. All authentication pages consume the hooks from this package.

**Dependencies**: 
- Depends on `@templatev2/config` for Supabase client
- Uses React Query for all async operations
- Requires Chakra UI peer dependency for `ProtectedRoute` spinner

### `packages/data`

**Purpose**: Manages all server-side data fetching and mutations using React Query.

**Key Hooks**:
- `useDashboardData()`: Fetches all tasks for the authenticated user from `dashboard_tasks` table
- `useCreateTaskMutation()`: Creates a new task and invalidates the tasks cache
- `useUpdateTaskMutation()`: Updates an existing task (e.g., toggle completion) and invalidates cache

**Types**:
- `DashboardTask`: Task interface matching Supabase table structure
- `DashboardTaskInsert`: Type for task creation
- `DashboardTaskUpdate`: Type for task updates

**Integration**: Used by dashboard pages in `apps/web/src/app/page.tsx` to fetch and manage tasks. All hooks automatically handle authentication (via `@templatev2/auth`) and RLS policies.

**Dependencies**:
- Depends on `@templatev2/auth` to get current user ID
- Depends on `@templatev2/config` for Supabase client
- Uses React Query for caching and state management

### `packages/ui`

**Purpose**: Shared UI component library built on Chakra UI v3.29 with custom theming.

**Key Components**:
- **Layout**: `Layout`, `Header`, `Sidebar`, `LoadingSkeleton`
- **Tasks**: `TaskList`, `TaskItem`, `CreateTaskForm`
- **Primitives**: Wrapper components for Chakra UI primitives (`Button`, `Box`, `Flex`, `VStack`, `HStack`, `Input`, `Field`, `Card`, `Alert`, `Badge`, etc.)
- **Theme**: Custom theme configuration with Brand and Semantic color palettes

**Theme Configuration**:
- Custom color palettes defined in `tailwind.config.ts` and integrated into Chakra theme
- Brand palette: Primary actions and corporate identity
- Semantic palette: Success, warning, and danger states
- All colors accessible as Chakra design tokens

**Chakra UI v3.29 Compliance**:
- All components use the v3.29 composition API where applicable
- Client components marked with `"use client"` for Next.js compatibility
- Object-based styling for SSR compatibility (e.g., `bg={{ base: "white", _dark: "gray.800" }}`)

**Integration**: Imported by `apps/web` and used in all pages. The custom theme is provided via `ChakraProvider` in `apps/web/src/app/providers.tsx`.

**Dependencies**:
- Chakra UI v3.29 as dev dependency (for types)
- Emotion and Framer Motion for styling
- Peer dependencies on config, data, and i18n packages for some components

### `packages/i18n`

**Purpose**: Provides internationalization (i18n) support using react-i18next.

**Key Exports**:
- `I18nProvider`: React Context provider that initializes i18next
- `i18n`: i18next instance for direct use
- Translation files: `locales/en.json`, `locales/es.json`

**Features**:
- Automatic language detection from localStorage
- Language persistence across sessions
- Synchronization with Zustand language store from `packages/config`

**Integration**: The `I18nProvider` wraps the application in `apps/web/src/app/providers.tsx`. All pages and components use `useTranslation()` hook to access translations.

**Supported Languages**: English (en), Spanish (es)

**Dependencies**:
- `i18next` for core i18n functionality
- `react-i18next` for React integration

### `packages/config`

**Purpose**: Central configuration package containing Supabase client, Zustand stores, and shared types.

**Key Exports**:
- `supabaseClient`: Configured Supabase client instance using environment variables
- `useSidebarStore`: Zustand store for sidebar open/closed state
- `useLanguageStore`: Zustand store for current language with localStorage persistence
- Database types: TypeScript types for Supabase database schema

**Stores**:
- **useSidebarStore**: Manages UI state for sidebar visibility (`isSidebarOpen`, `toggleSidebar`, `openSidebar`, `closeSidebar`)
- **useLanguageStore**: Manages language preference (`language`, `setLanguage`) with localStorage persistence

**Integration**: 
- Supabase client used by `packages/auth` and `packages/data`
- Stores used by UI components in `packages/ui` (Header, Sidebar)
- Database types used throughout the monorepo for type safety

**Dependencies**:
- `@supabase/supabase-js` for database client
- `zustand` for state management

## State Management Strategy

### React Query (Server State)
**Used in**: `packages/auth`, `packages/data`

- Manages all asynchronous state (authentication, database queries, mutations)
- Handles caching, background refetching, and optimistic updates
- Automatically handles loading and error states
- Integrates with Supabase for data fetching

**Key Patterns**:
- All hooks return `{ data, isLoading, error }` pattern
- Mutations automatically invalidate related queries
- Queries are keyed by resource type and user ID for proper caching

### Zustand (Client State)
**Used in**: `packages/config`

- Manages purely client-side UI state
- Lightweight and fast
- Supports localStorage persistence where needed
- No boilerplate compared to Redux

**Current Stores**:
- `useSidebarStore`: Sidebar visibility (ephemeral)
- `useLanguageStore`: Language preference (persisted in localStorage)

## Package Dependency Graph

```
apps/web
  ├── @templatev2/ui
  │     ├── @templatev2/config (peer)
  │     ├── @templatev2/data (peer)
  │     └── @templatev2/i18n (peer)
  ├── @templatev2/auth
  │     └── @templatev2/config
  ├── @templatev2/data
  │     ├── @templatev2/auth
  │     └── @templatev2/config
  ├── @templatev2/i18n
  └── @templatev2/config

packages/auth
  └── @templatev2/config

packages/data
  ├── @templatev2/auth
  └── @templatev2/config

packages/ui
  ├── @templatev2/config (peer)
  ├── @templatev2/data (peer)
  └── @templatev2/i18n (peer)
```

## Adding New Packages

When creating a new package:

1. **Create directory** in `packages/[package-name]`
2. **Initialize package.json** with:
   - `name: "@templatev2/[package-name]"`
   - `version: "0.0.0"`
   - `private: true`
   - Appropriate dependencies and peerDependencies
3. **Create tsconfig.json** extending `../../tsconfig.base.json`
4. **Create eslint.config.mjs** extending `../../eslint.config.base.mjs`
5. **Add to pnpm-workspace.yaml** (automatically included via `packages/*`)
6. **Export main index.ts** from `src/index.ts`
7. **Update this documentation** with package details

## 🤖 Agent Guidelines: Package Development

When working with packages:

1. **Dependency Management**: 
   - Use `workspace:*` for internal package dependencies
   - Declare peer dependencies for packages that should be provided by the consuming app
   - Keep dependencies minimal and well-justified

2. **Type Safety**: 
   - All packages must have TypeScript configured
   - Export types alongside implementations
   - Use strict TypeScript configuration

3. **Reusability**: 
   - Extract reusable logic into packages
   - Avoid duplication across apps
   - Design packages to be framework-agnostic where possible

4. **Testing**: 
   - Unit tests in package directories
   - Test exports and key functionality
   - Mock external dependencies appropriately

5. **Documentation**: 
   - Document package purpose and key exports
   - Include usage examples
   - Keep README.md updated (if applicable)

