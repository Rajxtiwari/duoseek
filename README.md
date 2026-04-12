This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [Inter](https://fonts.google.com/specimen/Inter) for body text and [Rajdhani](https://fonts.google.com/specimen/Rajdhani) for headings, loaded via Google Fonts in `globals.css`.

## Supabase Auth Setup

This app supports:

- Authentication overlay (no dedicated login page UX)
- Email/password login and signup
- Google OAuth login
- Discord OAuth login
- Ghost-mode public routes (`/`, `/lobby`, `/shuffle`, `/how-it-works`)
- Protected profile settings route (`/profile/settings`) with auth overlay redirect

Create a `.env.local` file in the project root with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

In Supabase dashboard:

1. Enable Email provider in Authentication > Providers and use Email/Password.
2. Disable magic link if you only want standard email/password.
3. Enable Google provider.
4. Enable Discord provider and add your Discord client ID/secret.
5. Create a private bucket named `secure_vault_ids` for government ID uploads.
6. Add storage policies so only authenticated users can upload/read their own files.
7. Set your redirect URL to:

```text
http://localhost:3000/auth/callback
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
