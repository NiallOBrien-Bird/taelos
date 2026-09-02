<div align="center">
  <img src="public/favicon.svg" alt="TÆLOS app icon" width="96" height="96" />

  <h1>TÆLOS</h1>

  <p><strong>A calm, private task manager for making progress visible—one next step at a time.</strong></p>
</div>

## About TÆLOS

TÆLOS is a personal task manager designed to make planning feel clear rather
than demanding. It combines straightforward task capture with flexible
deadlines, visible progress, and a focused timeline so that large commitments
can be approached in smaller, useful steps.

The application is access-controlled, stores each account's data separately,
and is designed to work comfortably across desktop and mobile devices.

## Features

- **Fast task capture** — create tasks quickly, then add structure only when it
  is useful.
- **Natural-language deadlines** — use phrases such as `tomorrow at 9am` or
  choose an exact date and time.
- **Subtasks and progress tracking** — break work into smaller steps or record
  progress in minutes, pages, words, sessions, and other practical units.
- **Categories** — organize and filter tasks with customizable labels and
  icons.
- **Timeline** — see dated work in context, with overdue and upcoming tasks
  clearly separated.
- **Shelf** — move inactive tasks out of the way without deleting them, then
  restore them when they become relevant again.
- **Work activity** — review recent momentum through an activity heatmap and
  summary.
- **A day that fits your schedule** — choose when your working day ends so
  late-night tasks remain attached to the day they belong to.
- **Keyboard-friendly workflow** — navigate, edit, complete, and undo without
  leaving the keyboard.
- **Responsive, installable experience** — use TÆLOS as a web app on desktop
  or mobile, with light and dark themes.
- **Private cloud sync** — task data is stored per user in Supabase and guarded
  by row-level security.

## Technology

TÆLOS is built with:

- [Next.js](https://nextjs.org/) and [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/) for authentication and data storage
- [Tailwind CSS](https://tailwindcss.com/)

## Local development

### Requirements

- Node.js 22.13 or newer
- npm
- A Supabase project

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and provide the public values from your
   Supabase project:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
   ```

3. Apply the migration in `supabase/migrations` to the Supabase project.

4. Configure any sign-in providers you intend to use in Supabase.

5. Start the development server:

   ```bash
   npm run dev
   ```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command          | Purpose                            |
| ---------------- | ---------------------------------- |
| `npm run dev`    | Start the local development server |
| `npm run build`  | Create a production build          |
| `npm run start`  | Run the production build locally   |
| `npm run lint`   | Check the codebase with Oxlint     |
| `npm run format` | Format the codebase with Oxfmt     |

## Privacy and data

TÆLOS requires an authenticated account. Task collections are stored in
Supabase and protected with row-level security so each user can access only
their own data. The service worker deliberately avoids caching private task
content for offline use.

## Project status

TÆLOS is under active development as a private personal application. Features
and interfaces may continue to evolve as the workflow is refined.
