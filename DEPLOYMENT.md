# Deployment Guide

## Important: API Key Configuration

### Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   # Windows
   copy .env.example .env
   
   # Mac/Linux
   cp .env.example .env
   ```

2. Edit `.env` and add your API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

3. Get your API key from: https://makersuite.google.com/app/apikey

### GitHub/Git Deployment

**The `.env` file is NOT committed to git for security reasons.**

When someone clones your repository, they need to:
1. Copy `.env.example` to `.env`
2. Add their own API key

### Deployment Platforms (Vercel, Netlify, etc.)

For production deployment, set the environment variable in your platform's dashboard:

1. **Vercel**:
   - Go to Project Settings → Environment Variables
   - Add: `VITE_GEMINI_API_KEY` = `your_api_key_here`
   - Redeploy

2. **Netlify**:
   - Go to Site Settings → Build & Deploy → Environment
   - Add: `VITE_GEMINI_API_KEY` = `your_api_key_here`
   - Redeploy

3. **GitHub Actions/CI/CD**:
   - Go to Repository Settings → Secrets
   - Add: `VITE_GEMINI_API_KEY` = `your_api_key_here`
   - Use in workflow: `${{ secrets.VITE_GEMINI_API_KEY }}`

### Security Notes

- ✅ `.env` is in `.gitignore` - will NOT be committed
- ✅ `.env.example` is committed - shows the format without real keys
- ⚠️ Never commit real API keys to git
- ⚠️ Use environment variables in production platforms
- ⚠️ Each developer needs their own API key

### Troubleshooting

If you see "Invalid API key" error:
1. Check that `.env` file exists in the root directory
2. Verify the API key format: `VITE_GEMINI_API_KEY=AIza...`
3. Restart your dev server after creating/editing `.env`
4. For production, verify environment variable is set correctly
