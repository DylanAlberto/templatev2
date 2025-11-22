# Serverless Functions

This directory contains Supabase Edge Functions that run on Deno runtime.

## Structure

```
apps/serverless/
└── functions/
    └── hello-world/
        ├── index.ts
        └── deno.json
```

## Development

The functions are configured in `supabase/config.toml` at the monorepo root. To serve functions locally:

```bash
# Start Supabase local development environment
pnpm exec supabase start

# Or serve functions only
pnpm exec supabase functions serve
```

## Deployment

### Local Deployment

Functions are deployed using the Supabase CLI:

```bash
# Deploy a specific function
pnpm exec supabase functions deploy hello-world

# Deploy all functions
pnpm exec supabase functions deploy
```

### CI/CD Deployment with GitHub Actions

For automated deployment via CI/CD workflows, you need to configure a Supabase Access Token as a GitHub Secret.

#### Step 1: Generate Supabase Access Token

1. **Navigate to Supabase Dashboard**
   - Go to [supabase.com](https://supabase.com)
   - Sign in to your account

2. **Access Account Settings**
   - Click on your profile icon in the top-right corner
   - Select **Account Settings** (or **Settings** → **Account**)

3. **Generate Access Token**
   - Navigate to **Access Tokens** section (or **API Tokens** / **Personal Access Tokens**)
   - Click **Generate New Token** or **Create New Token**
   - Enter a descriptive name for the token (e.g., "GitHub Actions Deployment")
   - Select the appropriate scope/permissions (typically `all` or `functions:write` and `functions:read`)
   - Click **Generate Token** or **Create**

4. **Copy the Token**
   - **Important**: Copy the token immediately and store it securely
   - The token will only be shown once and cannot be retrieved later
   - If you lose the token, you'll need to generate a new one

#### Step 2: Configure GitHub Secrets

You need to configure **two** GitHub Secrets for the CI/CD workflow:

##### Secret 1: SUPABASE_ACCESS_TOKEN

1. **Navigate to GitHub Repository**
   - Go to your repository on GitHub
   - Click on **Settings** tab

2. **Access Secrets Configuration**
   - In the left sidebar, navigate to **Secrets and variables** → **Actions**
   - Click **New repository secret**

3. **Add the Access Token Secret**
   - **Name**: Enter `SUPABASE_ACCESS_TOKEN` (exact name, case-sensitive)
   - **Secret**: Paste the Supabase Access Token you generated in Step 1
   - Click **Add secret**

##### Secret 2: SUPABASE_PROJECT_REF

1. **Find Your Project Reference ID**
   - Go to your Supabase Dashboard → **Settings** → **General**
   - Locate the **Reference ID** field (it's a short alphanumeric string)
   - Copy the Reference ID

2. **Add the Project Reference Secret**
   - Still in GitHub → **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - **Name**: Enter `SUPABASE_PROJECT_REF` (exact name, case-sensitive)
   - **Secret**: Paste your Project Reference ID
   - Click **Add secret**

4. **Verify Both Secrets**
   - Confirm that both `SUPABASE_ACCESS_TOKEN` and `SUPABASE_PROJECT_REF` appear in the list
   - Both secrets are now available to all GitHub Actions workflows in your repository

#### Step 3: CI/CD Workflow

The project includes a pre-configured GitHub Actions workflow at `.github/workflows/deploy-functions.yml` that will automatically:

- ✅ Trigger on every push to the `main` branch (when serverless functions or config change)
- ✅ Install Supabase CLI via pnpm dependencies
- ✅ Login to Supabase using the `SUPABASE_ACCESS_TOKEN` secret
- ✅ Deploy all Edge Functions using the `SUPABASE_PROJECT_REF` secret

No additional configuration is needed once both secrets are set up. The workflow is ready to use!

**Note**: The Supabase CLI automatically uses the `SUPABASE_ACCESS_TOKEN` environment variable when it's set in the workflow.

#### Security Best Practices

- ✅ Never commit the access token to your repository
- ✅ Use GitHub Secrets for all sensitive tokens
- ✅ Rotate tokens periodically for security
- ✅ Use the minimum required permissions for the token
- ✅ Revoke tokens that are no longer needed
- ✅ Monitor token usage in Supabase dashboard

#### Troubleshooting

**Issue: "Access token not provided" error during deployment**
- **Solution**: Verify that `SUPABASE_ACCESS_TOKEN` is correctly set in GitHub Secrets
- Ensure the secret name is exactly `SUPABASE_ACCESS_TOKEN` (case-sensitive)
- Check that the workflow YAML file references the secret correctly

**Issue: "Invalid token" or "Unauthorized" error**
- **Solution**: 
  - Verify the token was copied correctly (no extra spaces or line breaks)
  - Check that the token hasn't expired or been revoked
  - Generate a new token if necessary

**Issue: Token has insufficient permissions**
- **Solution**: 
  - Regenerate the token with the correct permissions (functions:read, functions:write)
  - Update the token in GitHub Secrets with the new value

## Adding New Functions

1. Create a new function using the Supabase CLI:
   ```bash
   pnpm exec supabase functions new my-function
   ```

2. Move the generated function from `supabase/functions/my-function` to `apps/serverless/functions/my-function`

3. Update `supabase/config.toml` to reference the new location:
   ```toml
   [functions.my-function]
   enabled = true
   verify_jwt = true
   import_map = "../apps/serverless/functions/my-function/deno.json"
   entrypoint = "../apps/serverless/functions/my-function/index.ts"
   ```

