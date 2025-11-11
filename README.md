# Arctic Homeowner Portal (Starter)

A ready-to-deploy Next.js portal that connects to Supabase for magic‑link auth, per‑homeowner access, timeline, photos, documents (signed URLs), messages, and an admin panel.

## Quick Start (Local)

```bash
npm install
cp .env.example .env.local
# paste your Supabase URL and anon key into .env.local
npm run dev
# open http://localhost:3000/portal
```

Then, in Supabase:
- Authentication → Email → enable **Magic Link**
- Authentication → URL configuration → add `http://localhost:3000`
- Storage → create **Private** buckets: `project-docs`, `project-photos`

Log in once via magic link, then in SQL editor run:
```sql
update public.users set role='admin' where email='you@arcticroofing.org';
```
Refresh the portal → **Open Admin** appears.

## Deploy (Vercel)
- Import this folder as a new project
- Add env vars in Vercel project settings:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Deploy → visit `/portal`

## Notes
- Tailwind is not required; styles are basic. You can add Tailwind later if you want the exact look as in design.
