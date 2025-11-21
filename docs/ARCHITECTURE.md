# 🏛️ Base Template Monorepo Architecture

## 1. Overview
This project is a **100% TypeScript Monorepo** designed as a core web application template. It uses **Turborepo** to prioritize **development speed**, **security**, and **low infrastructure costs** (Zero-Backend/BaaS approach).

## 2. Core Technology Stack

| Category | Technology | Version | Role in the Project |
| :--- | :--- | :--- | :--- |
| **Monorepo Tool** | **Turborepo** | ^2.0.0 | High-performance tool for fast, incremental builds, remote caching, and task orchestration across packages. |
| **Package Manager** | **pnpm** | ^10.20.0 | Efficient package management with workspace support. |
| **Frontend** | **Next.js** | 16.0.3 | React framework with App Router, routing, optimization, and SSR/SSG capabilities. |
| **UI Library** | **React** | 19.2.0 | UI framework foundation. |
| **UI Components** | **Chakra UI** | ^3.29.0 | Accessible, structured component library with custom theming. |
| **Styles** | **Tailwind CSS** | ^4.1.17 | Utility-first CSS framework for low-level styling and rapid customization. |
| **BaaS (Backend)** | **Supabase** | ^2.47.10 | Provides Database (PostgreSQL), Auth (GoTrue), Storage, and instant APIs. |
| **Client State** | **Zustand** | ^5.0.8 | Lightweight, minimal boilerplate local UI state management. |
| **Server State** | **React Query (TanStack Query)** | ^5.62.14 | Manages server data (caching, synchronization, mutations). Essential for optimizing Supabase communication. |
| **i18n** | **react-i18next** | ^14.1.3 | Internationalization library for multi-language support. |
| **Type Checking** | **TypeScript** | ^5.0.0 | Strict type checking across the entire monorepo. |

## 3. Monorepo Structure (Turborepo)

The architecture follows the separation pattern of "Apps" (deployable applications) and "Packages" (reusable libraries/modules).

### `apps/`
Contains the deployable applications.
* **`apps/web`**: The main Next.js application (the template frontend).
  - Uses Next.js App Router
  - Integrates all shared packages
  - Contains page routes: `/`, `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`, `/auth/callback`, `/dashboard`

### `packages/`
Contains shared logic to be reused across different `apps/`. **Note: Turborepo uses the name `packages/` for shared code.**

| Package | Purpose | Key Exports | Dependencies |
| :--- | :--- | :--- | :--- |
| **`packages/ui`** | Shared UI components built on Chakra UI v3.29 | `Button`, `Layout`, `Header`, `Sidebar`, `TaskList`, `TaskItem`, `CreateTaskForm`, `LoadingSkeleton`, theme | `@chakra-ui/react`, `tailwindcss`, `react` |
| **`packages/auth`** | Authentication and authorization logic | `AuthProvider`, `useAuth`, `ProtectedRoute`, `useSignInMutation`, `useSignUpMutation`, `useGoogleOAuthMutation`, `usePasswordRecoveryMutation`, `useResetPasswordMutation` | `@templatev2/config`, `@supabase/supabase-js`, `@tanstack/react-query` |
| **`packages/data`** | Server state management for application data | `useDashboardData`, `useCreateTaskMutation`, `useUpdateTaskMutation`, `DashboardTask` types | `@templatev2/auth`, `@templatev2/config`, `@supabase/supabase-js`, `@tanstack/react-query` |
| **`packages/i18n`** | Internationalization configuration | `I18nProvider`, `i18n`, translation files (en.json, es.json) | `react-i18next`, `i18next` |
| **`packages/config`** | Environment variables, Supabase client, Zustand stores | `supabaseClient`, `useSidebarStore`, `useLanguageStore`, database types | `@supabase/supabase-js`, `zustand` |

## 4. Key Architectural Patterns

### 4.1. State Management Strategy
- **Server State (React Query)**: Used in `packages/auth` and `packages/data` for all database-related operations (user authentication, dashboard tasks, etc.). Manages asynchronous state, caching, and re-fetching.
- **Client State (Zustand)**: Used in `packages/config` for purely UI-related state (e.g., sidebar visibility, language preference). Manages synchronous, lightweight state with localStorage persistence where needed.

### 4.2. Component Architecture
- **Shared Components**: All reusable UI components live in `packages/ui`
- **Page Components**: Route-specific pages live in `apps/web/src/app`
- **Client Components**: All interactive components are marked with `"use client"` directive for Next.js App Router compatibility
- **SSR Compatibility**: Components use object-based styling (`bg={{ base: "white", _dark: "gray.800" }}`) instead of hooks like `useColorModeValue`

### 4.3. Chakra UI v3.29 Migration
The project uses Chakra UI v3.29 with the updated component API:
- **Composition API**: Components like `Menu`, `Card`, `Alert`, `Checkbox` use the `.Root`, `.Trigger`, `.Content` pattern
- **Props Changes**: `colorScheme` → `colorPalette`, `spacing` → `gap`, `thickness` → `borderWidth`, `speed` → `animationDuration`
- **Form Components**: `FormControl` → `Field.Root`, `FormLabel` → `Field.Label`
- **Native Select**: `Select` → `NativeSelect.Root` / `NativeSelect.Field` / `NativeSelect.Indicator`

## 5. Build & Development Workflow

### Turborepo Tasks (turbo.json)
- **`build`**: Builds all packages and apps with caching enabled
- **`dev`**: Runs development servers (persistent, no cache)
- **`lint`**: Runs ESLint across all packages with caching
- **`format`**: Formats code with Prettier
- **`type-check`**: Runs TypeScript type checking

### Package Scripts
All packages follow consistent script naming:
- `lint`: ESLint validation
- `type-check`: TypeScript type checking
- `build`: Production build (where applicable)

## 6. Security & Best Practices

### 6.1. Supabase Security
- **Row Level Security (RLS)**: All database tables have RLS policies enabled
- **Environment Variables**: Never expose Supabase service role keys in client-side code
- **Authentication**: All auth logic centralized in `packages/auth`

### 6.2. TypeScript Strictness
- Strict TypeScript configuration enforced across all packages
- No `any` types allowed
- All Supabase types defined in `packages/config/src/types/database.types.ts`

### 6.3. Code Quality
- ESLint configuration extends base config from root
- Prettier for consistent formatting
- All packages have type checking in their build pipeline

## 7. Environment Variables

Required environment variables (defined in `.env.local` at root):
```
NEXT_PUBLIC_SUPABASE_URL=[YOUR_SUPABASE_URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_SUPABASE_ANON_KEY]
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🤖 Agent Guidelines: Best Practices & Simplicity

The primary goal is **maintainability and rapid iteration**. The agent must adhere to the following principles:

1. **Simplicity over Complexity (KISS):** Always opt for the simplest solution. Avoid introducing new libraries unless strictly necessary and justified.

2. **Strict TypeScript Usage:** All new code must be strictly typed. Avoid `any` whenever possible. Define clear interfaces for all data structures, especially those coming from Supabase (`packages/data`).

3. **Separation of Concerns:** 
   - Keep server state logic (React Query hooks) strictly within `packages/data` and `packages/auth`
   - UI components should not contain complex data fetching logic
   - Business logic should be in packages, not in page components

4. **Security First:** Ensure all Supabase interactions use **Row Level Security (RLS)** as defined in `SETUP.md`. Never expose admin secrets on the client side.

5. **Leverage Turborepo:** Ensure all build, test, and lint commands are correctly defined in the root `turbo.json` file to maximize caching and parallelism benefits.

6. **Chakra UI v3.29 Compliance:** Always use the v3.29 component API patterns. Refer to component documentation when implementing new features.

7. **SSR Compatibility:** All client components must be marked with `"use client"`. Use object-based styling syntax for color mode values.

8. **Package Dependencies:** 
   - Use `workspace:*` for internal package dependencies
   - Declare peer dependencies correctly
   - Keep dependencies minimal and up-to-date

### 🌐 Language Constraint

All agent output—including documentation, code (function names, variable names, class names), comments, commit messages, and any narrative explanations—**must be written exclusively in English**. No Spanish or other languages should be used in the final deliverables.
