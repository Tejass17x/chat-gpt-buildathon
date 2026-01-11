# Gemini API Setup Guide

This project uses Google's Gemini AI to generate professional HTML, CSS, and JavaScript code from your canvas UI elements.

## Getting Your API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey) or [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new API key for Gemini API
4. Copy the API key

## Setup Instructions

1. **Create a `.env` file** in the root directory of your project (same level as `package.json`)

2. **Add your API key** to the `.env` file:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Restart your development server** if it's running:
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

## Using Gemini API

- When you click "View Code" in the application, it will automatically use Gemini API if enabled
- You can toggle between Gemini AI generation and local generation using the checkbox in the code generator header
- If no API key is set, the app will automatically fall back to local code generation

## Important Notes

- **Never commit your `.env` file** to version control (it's already in `.gitignore`)
- The API key is client-side in this setup (using Vite's `import.meta.env`)
- For production, consider using a backend proxy for API key security
- Gemini API may have usage limits based on your Google Cloud plan

## Troubleshooting

- **"Please set your Gemini API key" error**: Make sure you created a `.env` file with `VITE_GEMINI_API_KEY=your_key`
- **"Gemini API Error"**: Check your internet connection and verify the API key is valid
- **Code generation fails**: The app will automatically fall back to local generation
