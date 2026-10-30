# Haider Ali portfolio + admin: complete build plan

> Put this file in the root of the repo. In Claude Code say:
> **"Read BUILD_PLAN.md fully. Do Step 0 only, then stop and wait."**

---

## Haider ke liye (office mein shuru karne se pehle)

1. Install: **Node.js (LTS)**, **Git**, **VS Code**. Check: `node -v`, `git -v`.
2. Claude Code install karein (tareeqa docs.claude.com par dekh lein) aur login karein.
3. **MongoDB Atlas:** free cluster, Database Access mein user banayein, Network Access mein apni IP (ya "Allow from anywhere") allow karein, aur connection string copy karein.
4. GitHub par khali repo banayein, clone karein, aur `cd` karke us folder mein jayein.
5. Is repo mein ek `design/` folder banayein aur chat se do files download karke rakhein:
   - `haider-scroll-portfolio.html` (public site ka design)
   - `haider-admin-template.html` (admin ka design)
6. Is `BUILD_PLAN.md` ko repo ke root mein rakhein, `claude` chalayein, aur upar wali line paste karein.
7. Har step ke baad: `npm run dev` se khud test karein, phir `git add . && git commit -m "step N" && git push`. Phir Claude se kahein: "Do the next step."
8. Error aaye to poora error text Claude ko paste karein.

---

## 1. Goal and stack

Build a business portfolio for Haider Ali (full-stack and AI developer, Islamabad) with a private admin panel where he edits all content.

- **Next.js (App Router, TypeScript, Tailwind)**, backend inside Next.js route handlers
- **MongoDB Atlas** via Mongoose
- **Vercel** for hosting
- No other services. No NextAuth, no Cloudinary, no Supabase, no Render.
- Visual reference: `design/haider-scroll-portfolio.html` (public site) and `design/haider-admin-template.html` (admin). Match the look, fonts (Unbounded, DM Sans), colors and every scroll effect. Keep `prefers-reduced-motion` support and mobile-first layout.

## 2. Rules for Claude (copy these into CLAUDE.md in Step 0)

- Work one step at a time from Section 7. After each step: say how to test it, run lint and build, then stop.
- All content comes from MongoDB through the API. Nothing hardcoded except the first seed (Section 8).
- Never commit `.env*` files. Never expose secrets to the client. Validate every request body with Zod.
- Admin pages and every write API require a valid session. Return 401 otherwise.
- Ask before adding any new dependency.
- Keep files small and readable. Do not rewrite working code without being asked.

## 3. Data models (Mongoose)

All except Message and Profile have an `order` number (for sorting).

- **Project:** title, category, description, tags[], link, image (base64 JPEG string, optional), status ("draft" | "published")
- **Service:** title, description
- **Internship:** company, role, period, status ("In progress" | "Completed"), description
- **Certificate:** title, issuer, date, link, image (optional)
- **Education:** title, school, period, description
- **Journey:** label, heading, description
- **Message:** name, email, type, text, read, replied, createdAt
- **Profile** (single document): photo, heroTitle, heroIntro, aboutText, contactIntro, footerText, headline, email, phone, github, linkedin, youtube, cvLink, open (boolean, "Taking new projects"), githubUsername (default "ha5743330-ctrl"), projectsLimit (2-6, default 4), githubFill (boolean, default true)

## 4. API routes

- Public GET: `/api/projects` (published DB projects by order, then, if githubFill is on, public GitHub repos from `lib/github.ts` up to projectsLimit, deduped by link; each item has `source`: "db" or "github"), `/api/services`, `/api/internships`, `/api/certificates`, `/api/education`, `/api/journey`, `/api/profile`
- Public POST: `/api/messages` (validated, rate limited per IP)
- Admin only: POST, PUT, DELETE on every collection; PUT `/api/profile`; GET, PUT, DELETE `/api/messages`
- Auth: POST `/api/login`, POST `/api/logout`

## 5. Auth (single admin)

- Env: `ADMIN_PASSWORD`, `SESSION_SECRET`.
- Compare the submitted password with `ADMIN_PASSWORD` using `crypto.timingSafeEqual`.
- On success set an httpOnly, secure, sameSite=lax cookie containing a JWT signed with `SESSION_SECRET` (use `jose`), valid 7 days.
- Middleware protects `/admin/*` and every non-GET admin API. Rate limit login attempts per IP.

## 6. Images

- Admin resizes in the browser (max 1200 px, JPEG quality 0.8) and sends base64.
- Server rejects any image over 400 KB.
- Profile photo drives the scroll-reveal portrait (clip-path reveal plus grayscale to color).
- Project and certificate images are optional. Without an image, projects show the colored mockup card from the design.

## 7. Steps (do one at a time)

**Step 0: Setup.** Create `CLAUDE.md` from Section 2. Create `.env.example` with `MONGODB_URI`, `ADMIN_PASSWORD`, `SESSION_SECRET` (placeholders only). Confirm `.gitignore` excludes `.env*`. Do not scaffold yet.
Test: files exist, `.env.local` is ignored by git.

**Step 1: Scaffold.** Create the Next.js app in this folder (App Router, TypeScript, Tailwind). Add Mongoose, connect using a cached connection helper in `lib/mongodb.ts`, and add `/api/health` that pings the database.
Test: `npm run dev`, open `/api/health`, expect `ok`.

**Step 2: Models, API and seed.** Create the models, all public and admin API routes (admin routes unprotected for now but structured for middleware), and a seed script (`npm run seed`) that loads Section 8.
Test: run seed, open `/api/projects` and `/api/profile`, see the data.

**Step 3: Public site.** Port `design/haider-scroll-portfolio.html` to React components using API data. Keep every effect: preloader-free hero reveal, progress bar, Idea/Design/Code/Live pinned story, front/back split, about word reveal, portrait reveal, timeline, horizontal projects, mission picker, counters, live Islamabad clock, glow, card tilt. The projects section ends with a "Show more on GitHub" button linking to profile.github; the project counter uses the DB published count, not the GitHub items. The numbers section is derived from the database: internship count, certificate count, published project count.
Test: compare with the design on a phone and a laptop.

**Step 4: Login.** Build `/admin/login`, login and logout APIs, the signed cookie and the middleware from Section 5.
Test: `/admin` redirects when logged out; a write API returns 401 without the cookie; wrong password fails.

**Step 5: Admin pages.** Port `design/haider-admin-template.html`. Tabs: Dashboard, Projects, Services, Internships, Certificates, Education, Journey, Site text, Messages, Settings (profile photo, headline, email, links, CV link, "Taking new projects" switch). Include browser-side image resizing and upload.
Test: edit each item type in admin and see it on the public site after refresh.

**Step 6: Contact form.** The public form posts to `/api/messages`. Admin shows the unread count and the inbox (open, mark replied, delete).
Test: send a message, see it in admin.

**Step 7: Deploy.** Push to GitHub, import the repo in Vercel, add env vars `MONGODB_URI`, `ADMIN_PASSWORD`, `SESSION_SECRET`, deploy. Run the seed once against the production database.
Test: public site, login, edit, contact form, all on a phone.

## 8. Seed content (starting data)

**Profile:** heroTitle "Every website has two sides. I build both." heroIntro "I’m Haider, a full-stack developer in Islamabad. I make the part people see, and the part that keeps it running." aboutText "I started in Bara Kahu and now build for businesses. I care about sites that load fast, look sharp and are easy to update. I studied AI, so I know where it helps and where it doesn’t." contactIntro "Tell me what you’re building and where you need help." footerText "© 2026 Haider Ali". email ha5743330@gmail.com, github https://github.com/ha5743330-ctrl, linkedin https://www.linkedin.com/in/haider-ali-545970360, open true.

**Projects:**
1. LMS platform, Web app, "Courses, user roles and progress tracking.", tags React, Node.js, MongoDB, published
2. Noor-ul-Quran, Web app, "Turns Quran verses into shareable videos.", tags JavaScript, link https://github.com/ha5743330-ctrl/Noor-ul-Quran, published
3. Neighborhood carpool, Concept, "Ride sharing between Bara Kahu and Islamabad.", tags MERN, Maps, draft

**Services:**
1. Business websites: "Fast sites with an admin panel so you can edit content yourself."
2. Web apps and dashboards: "Custom tools with login and user roles."
3. AI integration: "Chatbots, search and automation."

**Internships** (roles blank, Haider fills them in admin):
FlyRank AI (8 weeks, remote, unpaid, In progress); Alkhidmat Foundation (8 weeks, remote, volunteer, In progress); Arch Technologies (2 months, remote, unpaid, In progress); Developers Hub Corporation (8 weeks, remote, unpaid, Completed).

**Certificates:** Microsoft Azure AI Fundamentals (AI-900), issuer Microsoft, date July 2, 2026.

**Education:** BS Computer Science (AI), BIMS affiliated with PMAS Arid Agriculture University; Intermediate, Computer Science, Islamabad Career College, Bharakahu. (Years blank.)

**Journey:**
1. Bara Kahu / Computer Science at intermediate level / Where I first learned to code, near Islamabad.
2. BS Computer Science (AI) / BIMS, PMAS Arid Agriculture University / Programming, databases and machine learning.
3. Four internships / Web development and AI / Developers Hub, FlyRank AI, Arch Technologies and Alkhidmat Foundation.
4. July 2026 / Microsoft Azure AI Fundamentals / AI-900 certified.
5. Now / Building products and taking clients / An LMS, a Quran video app and this portfolio.

**Kept in code, not in admin (for now):** the four story stages (Idea, Design, Code, Live) and their colors, the mission picker tabs, the tech marquee list.

**8a. Extra content from the old site (add to the seed):**
- Profile: cvLink `/files/Haider_Ali_CV.pdf`. Headline "Full-stack developer, Islamabad". Photo: resize `legacy/haiderali.jpg` (max 1200 px, JPEG 0.8, under 400 KB) and store as base64.
- Certificate "Microsoft Azure AI Fundamentals (AI-900)": link https://learn.microsoft.com/api/credentials/share/en-us/Haiderali-0774/489B0F237EFEF991?sharingId=2269BFFE1865A52D
- Certificate 2: "Internship completion", issuer Developers Hub Corporation, link `/files/DHC_Certificate.pdf` (date blank).
- `legacy/` is reference only; never import from it at runtime.

## 9. Done means

- Edit anything in `/admin`, refresh the public site, and the change is there.
- A logged-out visitor cannot open `/admin` or call any write API.
- A contact form message appears in the admin inbox.
- `npm run build` passes with no errors, and the site works on a phone.
- No secrets in git history.

## 10. Common problems

- **MongoDB connection fails:** allow your IP in Atlas Network Access, and check the password in `MONGODB_URI` (special characters must be URL-encoded).
- **Env vars undefined:** the file must be `.env.local`; restart `npm run dev` after editing.
- **Works locally, fails on Vercel:** add the same env vars in Vercel Project Settings, then redeploy.
- **Image upload rejected:** the image is over 400 KB; resize more.
- **Scroll effects look wrong on iPhone:** use `100svh`, and test in the real browser, not only the dev tools.

## 11. Note on hosting

Vercel Hobby (free) is for personal, non-commercial use. When the portfolio brings in client income, move to Vercel Pro or another host that allows commercial use.
