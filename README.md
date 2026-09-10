# Manthan TP - Portfolio & Interactive Tech Hub

A modern, high-performance portfolio and blog platform built with React, TypeScript, Vite, and Supabase.

## ✨ Features

- **Dynamic & Responsive UI**: Glassmorphic aesthetic, animated skill radar, dark/light theme, timeline views.
- **Offline & Backend Fallback**: Built-in static fallback data — if Supabase backend is unreachable, the site automatically serves cached and pre-bundled data without breaking.
- **Admin Dashboard**: Secure management for projects, blog posts, skills, certificates, messages, and settings.
- **Interactive Tech Playground**: Live interactive components, code demos, and visitor engagement features.
- **Supabase Keep-Alive Cron**: Automated GitHub Action preventing free-tier database inactivity sleep.

## 🚀 Supabase Keep-Alive (Prevent Inactivity Shutdown)

Supabase free-tier projects pause after 7 days without database/API activity. This repository includes an automated GitHub Action:

- **Workflow File**: [`.github/workflows/keep-supabase-alive.yml`](.github/workflows/keep-supabase-alive.yml)
- **Schedule**: Automatically runs every 3 days at 06:00 UTC via curl request to PostgREST.
- **Manual Trigger**: Can also be run manually from the **Actions** tab on GitHub (`workflow_dispatch`).

### Optional GitHub Secrets
If you want to configure secrets in your GitHub repository:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anon/publishable key

*(Fallback values are already configured in the workflow if secrets are not set).*

### Alternative: Free External Cron (e.g. UptimeRobot / Cron-Job.org)
You can also point a free monitoring service like [UptimeRobot](https://uptimerobot.com/) or [cron-job.org](https://cron-job.org/) to:
```
https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/rest/v1/
```
with headers:
- `apikey`: `<YOUR_ANON_KEY>`
- `Authorization`: `Bearer <YOUR_ANON_KEY>`

## 🛠️ Development & Deployment

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
npm run build
```

