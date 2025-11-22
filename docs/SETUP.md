# 🚀 Project Initial Setup Guide

This document details the steps required to get the basic template up and running.

## 1. Prerequisites

* **Node.js**: LTS version (>=18.0.0 recommended)
* **pnpm**: Version >=8.0.0 (^10.20.0 recommended for this project)
  ```bash
  npm install -g pnpm
  # or
  brew install pnpm  # macOS
  ```
* An active **Supabase** account (free tier available)
* An active **Vercel** account (optional, for deployment)

## 2. Local Environment Configuration

1. **Clone the Repository:**
   ```bash
   git clone [REPO_URL]
   cd templatev2
   ```

2. **Install Dependencies:**
   ```bash
   pnpm install
   ```
   This will install all dependencies for the root workspace and all packages/apps.

3. **Create `.env.local` File:**
   In the monorepo root directory (`/Users/dylansoto/Documents/templatev2/`), create a `.env.local` file:
   ```env
   # --- Supabase Configuration ---
   NEXT_PUBLIC_SUPABASE_URL=[YOUR_SUPABASE_PROJECT_URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_SUPABASE_ANON_KEY]

   # --- Next.js Configuration ---
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
   *(Retrieve keys from the Supabase Dashboard -> Settings -> API).*

## 3. Supabase Configuration

### 3.1. Create Project
1. Create a new project in the Supabase dashboard at [supabase.com](https://supabase.com)
2. Wait for the project to be fully provisioned

### 3.2. Enable OAuth (Google)
1. In the Supabase Dashboard, navigate to **Authentication** -> **Settings** -> **Providers**
2. Enable **Google**
3. Configure Google Cloud credentials:
   - Create a project in [Google Cloud Console](https://console.cloud.google.com)
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs: `https://[YOUR_SUPABASE_PROJECT_REF].supabase.co/auth/v1/callback`
   - Paste the `Client ID` and `Client Secret` into Supabase

### 3.3. Configure Auth Redirects
1. In Supabase Dashboard, go to **Authentication** -> **URL Configuration**
2. Add the following to "Site URL":
   - `http://localhost:3000`
   - `[YOUR_PRODUCTION_DOMAIN]` (e.g., `https://my-template.vercel.app`)
3. Add the following to "Redirect URLs":
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/reset-password`
   - `[YOUR_PRODUCTION_DOMAIN]/auth/callback`
   - `[YOUR_PRODUCTION_DOMAIN]/reset-password`

### 3.4. Create Database Table
Execute the following SQL in the Supabase SQL Editor:

```sql
-- Create the dashboard_tasks table
CREATE TABLE public.dashboard_tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL,
    title character varying NOT NULL,
    completed boolean DEFAULT false NOT NULL
);

-- Enable RLS (Row Level Security) - essential for security
ALTER TABLE public.dashboard_tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own tasks
CREATE POLICY "Users can view their own tasks"
  ON public.dashboard_tasks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own tasks
CREATE POLICY "Users can insert their own tasks"
  ON public.dashboard_tasks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own tasks
CREATE POLICY "Users can update their own tasks"
  ON public.dashboard_tasks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own tasks
CREATE POLICY "Users can delete their own tasks"
  ON public.dashboard_tasks
  FOR DELETE
  USING (auth.uid() = user_id);
```

## 4. Running the Project

### 4.1. Development Mode
```bash
# Run all apps in development mode
pnpm dev

# Or run a specific app
pnpm dev --filter=web
```

The Next.js app will be available at `http://localhost:3000`

### 4.2. Build for Production
```bash
# Build all packages and apps
pnpm build

# Build a specific app
pnpm build --filter=web
```

### 4.3. Type Checking
```bash
# Type check all packages
pnpm type-check

# Type check a specific package
pnpm type-check --filter=@templatev2/ui
```

### 4.4. Linting
```bash
# Lint all packages
pnpm lint

# Fix linting issues
pnpm lint:fix

# Lint a specific package
pnpm lint --filter=@templatev2/auth
```

### 4.5. Formatting
```bash
# Format all code
pnpm format

# Check formatting
pnpm format:check
```

## 5. Project Structure Overview

```
templatev2/
├── apps/
│   └── web/                    # Next.js application
│       ├── src/
│       │   └── app/            # App Router pages
│       │       ├── page.tsx    # Home/Dashboard
│       │       ├── sign-in/
│       │       ├── sign-up/
│       │       ├── forgot-password/
│       │       ├── reset-password/
│       │       ├── auth/callback/
│       │       └── dashboard/
│       └── package.json
├── packages/
│   ├── ui/                     # Shared UI components
│   ├── auth/                   # Authentication logic
│   ├── data/                   # Data fetching hooks
│   ├── config/                 # Config & stores
│   └── i18n/                   # Internationalization
├── docs/                       # Documentation
├── package.json                # Root package.json
├── turbo.json                  # Turborepo configuration
├── pnpm-workspace.yaml         # pnpm workspace config
└── tsconfig.base.json          # Base TypeScript config
```

## 6. Technology Versions

This template uses the following key technology versions:

- **Next.js**: 16.0.3 (App Router)
- **React**: 19.2.0
- **Chakra UI**: ^3.29.0
- **TypeScript**: ^5.0.0
- **Turborepo**: ^2.0.0
- **pnpm**: ^10.20.0
- **Supabase**: ^2.47.10
- **React Query**: ^5.62.14

## 7. Troubleshooting

### Issue: `pnpm install` fails
**Solution**: Ensure you're using pnpm >=8.0.0. Check with `pnpm --version`

### Issue: TypeScript errors in packages
**Solution**: Run `pnpm install` from the root to ensure all workspace dependencies are linked correctly

### Issue: Supabase connection errors
**Solution**: 
1. Verify `.env.local` file exists in the root directory
2. Check that environment variables are correctly named (must start with `NEXT_PUBLIC_`)
3. Verify Supabase project is active and credentials are correct

### Issue: Build fails with Turborepo cache
**Solution**: Clear Turborepo cache:
```bash
pnpm turbo clean
pnpm install
pnpm build
```

### Issue: Chakra UI components not rendering
**Solution**: Ensure all client components have `"use client"` directive. Check that `ChakraProvider` is wrapping the app in `apps/web/src/app/providers.tsx`

## 8. Next Steps

After setup is complete:
1. Test authentication flow: Sign up → Email verification → Sign in
2. Test OAuth: Sign in with Google
3. Test password recovery: Forgot password → Reset password
4. Test dashboard: Create, update, and view tasks
5. Customize theme colors in `packages/ui/src/theme.ts`
6. Add more translation keys in `packages/i18n/src/locales/`

## 9. Deployment

### 9.1. Vercel Deployment Configuration

This project is configured for deployment on Vercel with Turborepo support. The configuration file `apps/web/vercel.json` is already set up with the necessary build commands.

#### Required Environment Variables

The following environment variables **must** be configured in the Vercel dashboard before deployment:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key | `eyJhbGc...` | ✅ Yes |
| `NEXT_PUBLIC_APP_URL` | Your production application URL | `https://my-app.vercel.app` | ✅ Yes |

**Note**: All environment variables must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser.

#### Deployment Steps

1. **Push your code to GitHub/GitLab**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Import project in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your repository
   - Vercel should auto-detect the Next.js app in `apps/web`

3. **Configure Project Settings in Vercel**
   - Go to **Settings** → **General**
   - **Root Directory**: Set to `apps/web` (important for monorepo)
   - **Framework Preset**: Next.js (auto-detected)
   - The following are configured in `apps/web/vercel.json`:
     - **Build Command**: `cd ../.. && pnpm build --filter=web`
     - **Output Directory**: `.next`
     - **Install Command**: `pnpm install`
   - **Node.js Version**: 18.x or higher (recommended: 20.x LTS)
   - **Package Manager**: pnpm (auto-detected from `packageManager` field)

4. **Add Environment Variables**
   - In the Vercel project dashboard, go to **Settings** → **Environment Variables**
   - Add each of the required environment variables listed above
   - **Important**: Add them for all environments (Production, Preview, Development)
   - Copy the values from your local `.env.local` file (for Supabase values)
   - For `NEXT_PUBLIC_APP_URL`, use your Vercel deployment URL (e.g., `https://your-project.vercel.app`)

5. **Update Supabase Redirect URLs**
   - Go to your Supabase Dashboard → **Authentication** → **URL Configuration**
   - Add your production domain to **Site URL**: `https://your-project.vercel.app`
   - Add to **Redirect URLs**:
     - `https://your-project.vercel.app/auth/callback`
     - `https://your-project.vercel.app/reset-password`
   - If using Google OAuth, update the Google Cloud Console redirect URIs as well

6. **Deploy!**
   - Click "Deploy" in Vercel
   - The build process will:
     1. Install dependencies using `pnpm install`
     2. Build all packages and the web app using Turborepo
     3. Deploy the Next.js application

#### Vercel Configuration File

The project includes `apps/web/vercel.json` with the following configuration:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "cd ../.. && pnpm build --filter=web",
  "devCommand": "cd ../.. && pnpm dev --filter=web",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

**Important**: The `rootDirectory` must be configured in Vercel's project settings (Settings → General → Root Directory) as `apps/web`, not in the `vercel.json` file. This ensures Vercel correctly identifies the monorepo structure.

This configuration ensures:
- Turborepo builds are executed correctly from the monorepo root
- Only the `web` app is built (using `--filter=web`)
- Dependencies are installed using pnpm
- The correct output directory is used

#### Troubleshooting Deployment

**Issue: Build fails with "Cannot find module" errors**
- **Solution**: Ensure `rootDirectory` is set to `apps/web` in Vercel settings
- Verify that all workspace packages are properly linked

**Issue: Environment variables not accessible**
- **Solution**: 
  - Verify variables are prefixed with `NEXT_PUBLIC_`
  - Ensure variables are added for all environments (Production, Preview, Development)
  - Redeploy after adding environment variables

**Issue: Supabase authentication redirect fails**
- **Solution**: 
  - Verify `NEXT_PUBLIC_APP_URL` matches your Vercel deployment URL
  - Check Supabase redirect URLs include your production domain
  - Ensure callback URLs are correctly configured

**Issue: Build times out**
- **Solution**: 
  - Enable Vercel's remote cache for Turborepo (optional but recommended)
  - Consider upgrading Vercel plan for longer build times if needed

### 9.2. Post-Deployment Checklist

After successful deployment:

- [ ] Verify the application loads at your production URL
- [ ] Test authentication flows (sign in, sign up)
- [ ] Test OAuth (Google) if configured
- [ ] Test password recovery flow
- [ ] Verify dashboard functionality
- [ ] Check browser console for any errors
- [ ] Verify all environment variables are correctly set
- [ ] Test on mobile devices if applicable
