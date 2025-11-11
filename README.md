# 24/7 News & AI Assistant Website

This is a full-stack Node.js application that fetches and displays top news headlines from NewsAPI.org and includes an AI chat assistant named "Akin Sokpah" (created by Akin Sokpah), powered by OpenAI's GPT-3.5-turbo.

## Features
- Fetches real news from NewsAPI, updating every hour.
- AI chat interface with GPT-like design.
- Tabbed interface for News and AI Chat.
- Deployable on Render.

## Setup
1. Clone this repo.
2. Run `npm install`.
3. Get API keys:
   - NewsAPI key from [newsapi.org](https://newsapi.org/).
   - OpenAI API key from [openai.com](https://openai.com/).
4. Set environment variables: `NEWS_API_KEY` and `OPENAI_API_KEY`.

## Deployment on Render
1. Push this code to a GitHub repo.
2. Go to [Render.com](https://render.com) and create a new Web Service.
3. Connect your GitHub repo.
4. Set the build command to `npm install`.
5. Set the start command to `npm start`.
6. Add environment variables:
   - `NEWS_API_KEY`: Your NewsAPI key.
   - `OPENAI_API_KEY`: Your OpenAI API key.
7. Deploy!

The app will be live. Note: Render's free tier may sleep after inactivity; upgrade for 24/7 uptime. The AI uses OpenAI credits (monitor usage).
