This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### First, Configure .env

DATABASE_URL=mysql://user:password@localhost:3306/auth_better

- Database connection (required)
- Format: mysql://user:password@host:port/database

NEXT_PUBLIC_APP_URL=http://localhost:3000

- App URL for auth callbacks (optional - defaults to same origin)
- Use in production: https://yourdomain.com

BETTER_AUTH_SECRET=your-32-character-or-longer-secret

- Auth secret for session signing (required in production)
- Generate with: openssl rand -base64 32
- generate secret on auth better (https://www.better-auth.com/docs/installation)

### Second, Generate and Run Migrations:

npx drizzle-kit generate
npx drizzle-kit migrate

### Third, Run the Development Server:

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

Navigate to see setup guide from scratch (http://localhost:3000/docs)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
