# 🚀 Template v2

A modern, production-ready monorepo template built with Next.js, Supabase, and Turborepo.

## ✨ Features

- 🎯 **Next.js 16** with App Router
- 🔐 **Supabase Auth** (Email, OAuth, Password Recovery)
- 🗄️ **Supabase Database** with Row Level Security (RLS)
- ⚡ **Supabase Edge Functions** (Deno runtime)
- 🎨 **Chakra UI v3** for beautiful, accessible components
- 🌍 **Internationalization** (i18n) with English & Spanish
- 📦 **Turborepo** for fast, cached builds
- 🔧 **TypeScript** strict mode throughout
- 🧪 **React Query** for server state management
- 💾 **Zustand** for client state management

## 🚦 Quick Start

### Prerequisites

- **Node.js** >=18.0.0 (LTS recommended)
- **pnpm** >=8.0.0 ([install pnpm](https://pnpm.io/installation))
- **Docker** (required for Supabase local development)
- **Supabase account** (free tier available)

### Installation

```bash
# Clone the repository
git clone [REPO_URL]
cd templatev2

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.local  # Or create manually
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run Development Server

```bash
# Start Supabase and Next.js together
pnpm dev

# Or run separately
pnpm dev:web        # Only Next.js
pnpm dev:supabase   # Only Supabase
```

**Available URLs:**
- 🌐 Next.js app: `http://localhost:3000`
- 🔗 Supabase API: `http://127.0.0.1:54321`
- 🎨 Supabase Studio: `http://127.0.0.1:54323`
- 📧 Inbucket (emails): `http://127.0.0.1:54324`

## 📁 Project Structure

```
templatev2/
├── apps/
│   └── web/              # Next.js application
├── packages/
│   ├── ui/              # Shared UI components
│   ├── auth/            # Authentication logic
│   ├── data/            # Data fetching hooks
│   ├── config/          # Config & Supabase client
│   └── i18n/            # Internationalization
├── supabase/
│   ├── config.toml      # Supabase configuration
│   └── functions/       # Edge Functions
└── docs/                # Documentation
```

## 🛠️ Available Scripts

```bash
# Development
pnpm dev                 # Start Supabase + Next.js
pnpm dev:web            # Start only Next.js
pnpm dev:supabase       # Start only Supabase

# Build
pnpm build              # Build all packages and apps

# Code Quality
pnpm lint               # Lint all packages
pnpm lint:fix           # Fix linting issues
pnpm format             # Format code with Prettier
pnpm type-check         # Type check all packages
```

## 📚 Documentation

- **[SETUP.md](docs/SETUP.md)** - Complete setup and configuration guide
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Architecture overview
- **[GUIDELINES.md](docs/GUIDELINES.md)** - Development guidelines
- **[MONOREPO_LIBRARIES.md](docs/MONOREPO_LIBRARIES.md)** - Shared packages documentation

## 🚀 Deployment

### Vercel (Recommended for Next.js)

See [SETUP.md](docs/SETUP.md#91-vercel-deployment-configuration) for detailed deployment instructions.

### Supabase Edge Functions

Deploy Edge Functions using GitHub Actions:

1. Configure GitHub Secrets:
   - `SUPABASE_ACCESS_TOKEN`
   - `SUPABASE_PROJECT_REF`

2. Push to `main` branch - functions auto-deploy on changes to `supabase/functions/**`

See [SETUP.md](docs/SETUP.md#92-supabase-edge-functions-deployment) for complete CI/CD setup.

## 🧪 Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js | 16.0.3 |
| UI Library | React | 19.2.0 |
| Components | Chakra UI | ^3.29.0 |
| Database | Supabase (PostgreSQL) | ^2.47.10 |
| Auth | Supabase Auth | - |
| State (Server) | React Query | ^5.62.14 |
| State (Client) | Zustand | ^5.0.8 |
| i18n | react-i18next | ^14.1.3 |
| Monorepo | Turborepo | ^2.0.0 |
| Package Manager | pnpm | ^10.20.0 |
| Language | TypeScript | ^5.0.0 |

## 📝 Next Steps

1. ✅ Configure Supabase project (see [SETUP.md](docs/SETUP.md#3-supabase-configuration))
2. ✅ Create database tables and RLS policies
3. ✅ Test authentication flows
4. ✅ Customize theme in `packages/ui/src/theme.ts`
5. ✅ Add translations in `packages/i18n/src/locales/`

## 🤝 Contributing

This is a template repository. Feel free to fork and customize for your needs!

## 📄 License

[Your License Here]

---

Built with ❤️ using Next.js, Supabase, and Turborepo

