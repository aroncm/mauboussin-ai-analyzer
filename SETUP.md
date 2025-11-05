# Mauboussin AI Analyzer

A professional AI-powered company analysis tool using Michael Mauboussin's investment frameworks.

## Setup Complete

The application is now fully configured with:
- React + Vite frontend with Tailwind CSS
- Supabase Edge Function for secure API calls
- Beautiful gradient design with responsive layout

## Important: API Key Required

To make the app functional, you need to configure the Anthropic API key:

1. Get your API key from [Anthropic Console](https://console.anthropic.com/)
2. Configure the `ANTHROPIC_API_KEY` secret for the `analyze-company` edge function in your Supabase dashboard
3. Once configured, the app will be able to analyze companies

## Features

- Competitive moat assessment across 5 dimensions
- Expectations investing analysis
- Probabilistic thinking and base rate analysis
- Management quality evaluation
- Export detailed reports

## How It Works

1. User enters a company name
2. Frontend calls the Supabase edge function
3. Edge function securely calls Claude AI via Anthropic API
4. AI analyzes the company using Mauboussin's frameworks
5. Results displayed with interactive UI and export capability
