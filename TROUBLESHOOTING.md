# Gemini API Troubleshooting Guide

## Common Errors and Solutions

### Error: "GoogleGenerativeAI Error: Error"

This is a generic error. Check the browser console (F12) for more details. Common causes:

1. **Invalid API Key**
   - Solution: Verify your API key in `.env` file
   - Make sure it starts with `AIza...`
   - Restart your dev server after changing `.env`

2. **API Not Enabled**
   - Solution: Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable "Generative Language API" for your project
   - Wait a few minutes for activation

3. **Model Not Available**
   - Solution: The code automatically falls back to local generation
   - Check if your API key has access to Gemini models
   - Try using a different Google account

4. **Network/CORS Issues**
   - Solution: Check your internet connection
   - Disable browser extensions that might block API calls
   - Try in incognito mode

5. **API Quota Exceeded**
   - Solution: Check your Google Cloud quota limits
   - Wait a few minutes and try again
   - Consider upgrading your plan

## Quick Fixes

1. **Restart Dev Server**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Verify .env File**
   ```bash
   # Check if .env exists and has correct format
   cat .env
   # Should show: VITE_GEMINI_API_KEY=AIza...
   ```

3. **Check API Key Format**
   - Should be: `VITE_GEMINI_API_KEY=AIzaSy...`
   - No quotes around the key
   - No spaces around the `=`

4. **Clear Browser Cache**
   - Press Ctrl+Shift+Delete
   - Clear cache and cookies
   - Reload the page

5. **Use Local Generation**
   - Uncheck "Use Gemini AI" checkbox in code generator
   - App will use local code generation instead

## Getting a New API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key
5. Add to `.env` file: `VITE_GEMINI_API_KEY=your_new_key_here`
6. Restart dev server

## Enable Gemini API in Google Cloud

1. Go to: https://console.cloud.google.com/
2. Create or select a project
3. Search for "Generative Language API"
4. Click "Enable"
5. Wait for activation (may take a few minutes)

## Still Having Issues?

1. Check browser console (F12) for detailed error messages
2. Verify API key is valid by testing it in another project
3. Check Google Cloud Console for quota/usage limits
4. Try using local generation as a workaround
5. Make sure you're using the latest version of `@google/generative-ai` package
