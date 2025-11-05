# Mauboussin AI Analyzer Setup

## Required Configuration

To use this application, you need to configure an Anthropic API key as a secret for the edge function.

### Setting up the Anthropic API Key

1. Get your API key from [Anthropic Console](https://console.anthropic.com/)
2. The edge function `analyze-company` needs the `ANTHROPIC_API_KEY` environment variable

The edge function has been deployed and will work once the API key is configured.

## How It Works

The application uses:
- **React** with **Vite** for the frontend
- **Supabase Edge Function** to securely call the Anthropic API
- **Claude AI** to analyze companies using Michael Mauboussin's investment frameworks

The edge function handles the API calls to Anthropic, keeping your API key secure on the server side.
