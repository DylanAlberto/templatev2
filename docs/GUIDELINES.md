The agent must prioritize a robust and testable codebase:

Unit Testing Focus: Use Jest (or Vitest) for unit testing key logic.

Focus tests on packages/auth, packages/data (mocking Supabase/API calls), and complex helper functions in packages/config.

UI components (packages/ui) should be tested for accessibility and rendering using Testing Library.

End-to-End (E2E) Testing: Implement basic E2E flows (using Cypress or Playwright) for the core features:

Sign Up -> Sign In -> View Dashboard.

Password Recovery Flow.

Code Consistency: Adhere to existing ESLint and Prettier rules. Ensure Turborepo runs lint and build efficiently using the turbo.json settings.

Refactoring for Readability: When adding a feature, dedicate time to refactor surrounding code if it improves clarity and reduces complexity. Code must be self-documenting.


---

## 3. `MONOREPO_LIBRARIES.md` (Actualizado para Turborepo)

```markdown
# 📚 Shared Libraries (`packages/`)

The shared packages in the monorepo are designed to be independent and reusable modules, ensuring consistency and separation of concerns. **We use the `packages/` directory, which is common in Turborepo structures.**

| Directory | Purpose | Key Dependencies | Integration Points |
| :--- | :--- | :--- | :--- |
| **`packages/auth`** | Handles authentication and authorization logic. Provides hooks to access the user state. | `@supabase/supabase-js`, `react-query` | The `AuthProvider` wraps the application in `apps/web`. Contains `useUserQuery()`. |
| **`packages/data`** | Server state management logic for application data (distinct from Auth). | `react-query`, `@supabase/supabase-js` | Contains data fetching hooks like `useDashboardData()` or `useCreateTaskMutation()`. |
| **`packages/ui`** | Base React components built on top of Chakra UI and Tailwind utilities. | `react`, `@chakra-ui/react`, `tailwindcss` | Includes structural components like `Layout`, `Header`, `Button`, and the theming files. |
| **`packages/i18n`** | Internationalization configuration. Provides the provider and loads translation files. | `react-i18next`, `i18next` | The `I18nProvider` wraps the application in `apps/web`. Translation JSON files reside here. |
| **`packages/config`** | Storage for environment variables, constants, and Zustand stores. | `zustand` | Contains the Supabase client configuration (`supabaseClient.ts`) and the Zustand store (e.g., `useThemeStore`). |

## 💡 React Query vs. Zustand

* **Server State (React Query):** Used in **`packages/auth`** and **`packages/data`** for all database-related operations (user data, dashboard tasks, etc.). *Manages asynchronous state, caching, and re-fetching.*
* **Client State (Zustand):** Used in **`packages/config`** for purely UI-related state (e.g., if the sidebar is open, current theme, temporary notifications). *Manages synchronous, lightweight state.*

---

## 🤖 Agent Guidelines: Code Structure & Efficiency

The agent should focus on efficiency and scalability within the monorepo context:

1.  **Atomic Commits:** All code changes must be broken down into small, atomic commits with clear messages following the Conventional Commits specification (e.g., `feat: add Google OAuth`, `fix: correct RLS policy`).
2.  **Turborepo Dependencies:** Ensure that internal package dependencies (e.g., `apps/web` depending on `packages/ui`) are correctly declared in the respective `package.json` files and managed by **Turborepo** to optimize the build graph.
3.  **Performance Optimization:** When fetching data, always use React Query's selectors and `staleTime` configuration to minimize unnecessary data fetching and component re-renders. Use `memo` and `useCallback`/`useMemo` in `packages/ui` judiciously to prevent performance bottlenecks.
4.  **Reusability Focus:** Every time new functionality is created in `apps/web`, assess if the core logic or UI component can be extracted into a relevant `packages/` package for future use. Avoid code duplication at all costs.