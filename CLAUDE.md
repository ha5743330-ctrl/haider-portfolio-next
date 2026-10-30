# Project rules (Haider Ali portfolio + admin)

Full plan: BUILD_PLAN.md. Read it before every step.

- Stack: Next.js App Router, TypeScript, Tailwind. Database: MongoDB Atlas via Mongoose. Hosting: Vercel. No other services (no NextAuth, Cloudinary, Supabase, Render).
- Visual reference: design/haider-scroll-portfolio.html (public site) and design/haider-admin-template.html (admin). Match the look, fonts (Unbounded, DM Sans), colors and every scroll effect. Keep prefers-reduced-motion support and mobile-first layout.
- Work one step at a time from BUILD_PLAN.md Section 7. After each step: say how to test it, run lint and build, then stop.
- All content comes from MongoDB through the API. Nothing hardcoded except the first seed (Section 8 and 8a).
- Never commit .env* files (except .env.example). Never expose secrets to the client. Validate every request body with Zod.
- Admin pages and every write API require a valid session. Return 401 otherwise.
- Ask before adding any new dependency.
- Keep files small and readable. Do not rewrite working code without being asked.
- legacy/ holds the old static site for reference only. Do not ship it. public/files/ holds the CV and certificate PDFs.
