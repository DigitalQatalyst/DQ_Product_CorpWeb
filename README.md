# DigitalQatalyst — Corporate Website

The official corporate website for **DigitalQatalyst**, built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Supabase
- **Fonts**: DM Sans + Plus Jakarta Sans
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── (admin)/      # Admin routes (route group)
│   ├── api/          # API routes
│   ├── careers/      # Careers page
│   ├── company/      # Company/About page
│   ├── jobs/         # Job listings
│   ├── products/     # Products pages
│   ├── services/     # Services pages
│   ├── terms/        # Terms of service
│   └── privacy-policy/
├── components/
│   ├── layout/       # Header, Footer
│   └── ui/           # shadcn/ui components
├── features/         # Feature-based modules
│   ├── admin/
│   ├── careers/
│   ├── company/
│   ├── landing/
│   ├── legal/
│   ├── products/
│   └── services/
├── data/             # Static data (sectors, products)
├── hooks/            # Custom React hooks
├── lib/              # Utilities (supabase client, utils)
└── types/            # TypeScript types
```

## Getting Started

Install dependencies:

```bash
npm install
```

Set up environment variables — create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Deployment

The project deploys automatically to **Vercel** via GitHub Actions on push to the main branch. See `.github/workflows/vercel-deploy.yml` for the pipeline configuration.
