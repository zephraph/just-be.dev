# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Justin's personal website (just-be.dev) built with Astro 5, TypeScript, and Tailwind CSS. It features a blog/note-taking system, interactive games (including Hangul Hero for learning Korean), and is deployed on Cloudflare Pages.

## Commands

### Development
```bash
pnpm dev          # Start development server (port 4321)
pnpm start        # Alias for pnpm dev
```

### Testing
```bash
pnpm test         # Run tests with Vitest
pnpm test <file>  # Run specific test file
```

### Building & Deployment
```bash
pnpm build        # Run TypeScript checks and build for production
pnpm preview      # Preview production build locally
pnpm logs         # View Cloudflare deployment logs
pnpm logs:preview # View preview environment logs
```

## Architecture

### Tech Stack
- **Framework**: Astro 5 (SSR mode)
- **Language**: TypeScript with path aliases
- **Styling**: Tailwind CSS + Typography plugin
- **Deployment**: Cloudflare Pages/Workers
- **Storage**: Cloudflare R2 buckets
- **Package Manager**: PNPM with workspace setup

### Project Structure
- `/notes/` - Markdown content files with ULID filenames
  - `/notes/assets/` - Images and PDFs
  - `/notes/logs/` - Log entries
  - `/notes/people/` - People-related notes
- `/packages/` - Monorepo packages
  - `astro-cf-sentry` - Sentry integration for Cloudflare
  - `astro-md` - Custom markdown renderer
  - `astro-r2-loader` - R2 storage integration
  - `my-remark` - Custom Remark plugin
  - `remark-obsidian` - Obsidian-style markdown support
- `/src/pages/` - Astro routes
  - `/api/` - API endpoints
  - `/games/` - Interactive games (p5.js)
- `/public/` - Static assets (fonts, sounds)

### Key Features
1. **Obsidian-style Markdown**: Internal links `[[note]]` and embeds `![[image]]`
2. **Cloudflare Integration**: KV namespaces for mappings/highlights, R2 for assets
3. **Error Tracking**: Sentry integration for production monitoring
4. **Live Reload**: Notes hot-reload in development mode

### TypeScript Path Aliases
- `~/` → `./src/`
- `@components/` → `src/components/`
- `@layouts/` → `src/layouts/`
- `@just-be/` → `packages/`

### Environment Configuration
- Node.js 20.16.0 (enforced)
- Cloudflare Workers with Node.js ALS compatibility flag
- R2 buckets: `just-be-dev` and `just-be-dev-assets`
- KV namespaces: `KV_MAPPINGS` and `KV_HIGHLIGHT`

### Testing
Tests use Vitest and are located in package directories. Run all tests with `pnpm test` or specific tests by path.