## RINADS – Marketing Site

RINADS is a creative performance marketing studio for brands that care about both story and scale. This site is a marketing and case-study hub for the studio, built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**, inspired by the structure and UX of a premium digital agency site.

### Scripts

- **Install**: `npm install`
- **Dev server**: `npm run dev` (default at `http://localhost:3000`)
- **Build**: `npm run build`
- **Start (production)**: `npm start`

### Project Structure

- `app/`
  - `layout.tsx`: Root layout (minimal wrapper for Platform homepage).
  - `page.tsx`: **Platform interface** - Multi-tab interface with Agency, Academy, Connect, Studio, Community, and Contact sections (now the homepage).
  - `marketing-archive/page.tsx`: Archived marketing site (Hero, Services, Portfolio, etc.) - accessible at `/marketing-archive`.
  - `resources/page.tsx`: Resources/blog page with playbook-style articles.
  - `case-studies/[slug]/page.tsx`: Dynamic case study detail pages.
- `components/`
  - `Navbar.tsx`: Sticky navigation mirroring the reference site's top bar structure (logo + section links + primary CTA).
  - `platform/`: **NEW** - Platform-specific components:
    - `PlatformNav.tsx`: Top navigation for platform interface
    - `MobileBottomNav.tsx`: Mobile bottom navigation bar
    - `HeroAgency.tsx`: Agency homepage with services grid
    - `AcademySection.tsx`: Academy courses and AI syllabus generator
    - `ConnectSection.tsx`: Influencer marketplace with live search
    - `StudioSection.tsx`: AI-powered content creation tools
    - `CommunitySection.tsx`: Community hub
    - `ContactSection.tsx`: Contact form
    - `LoginSection.tsx`: Login interface
  - `useOnScreen.ts`: Intersection Observer hook for scroll animations
  - `RevealOnScroll.tsx`: Reusable scroll reveal component
  - `Hero.tsx`: Large hero with headline, subheadline, dual CTAs, highlight pills, and a stat-focused visual card (conceptually similar to the reference hero area with metrics).
  - `Services.tsx`: Three service cards with bullets, echoing the reference “services/offerings” grid.
  - `Portfolio.tsx`: One featured case + supporting list of case studies, similar in layout role to the reference “work/case studies” section.
  - `About.tsx`: Narrative about the team and differentiators, inspired by the reference “about/company” storytelling block.
  - `Process.tsx`: Four-step process/timeline similar in function to the reference’s “how we work/process” section.
  - `Testimonials.tsx`: Grid of testimonial cards like the reference “clients/testimonials” area.
  - `Contact.tsx`: Two-column contact section with explanatory copy + contact form, matching the reference’s “contact/let’s talk” pattern.
  - `Footer.tsx`: Footer with short agency description and quick links, matching the conceptual role of the reference footer.
- `app/globals.css`: Tailwind directives, section spacing utility, and animations (fade-up, float).
- `tailwind.config.ts`: Tailwind setup with a custom color palette and typography choices.
- `lib/gemini.ts`: Gemini AI API helper for AI-powered features (requires `NEXT_PUBLIC_GEMINI_API_KEY` env var).

### Platform Features

The homepage (Platform interface) includes:

- **Agency**: Services showcase with animated hero and service cards
- **Academy**: Course listings with AI-powered custom syllabus generator
- **Connect**: Influencer marketplace with live search (Gemini-powered)
- **Studio**: AI content creation tools (video scripts, ad copy, strategy audits)
- **Community**: Links to Discord and LinkedIn communities
- **Contact**: Contact form with email integration

**Note**: To use AI features (Academy syllabus generator, Connect live search, Studio tools), add your Gemini API key to `.env.local`:

```
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

Get your key from: https://makersuite.google.com/app/apikey

### How this maps to the reference site (conceptually)

- **Navigation & layout**: Sticky top nav with logo, section links, and primary CTA; vertically stacked sections that follow the same narrative flow (hero → services → work → about → process → testimonials → contact → footer).
- **Hero**: Large, center-of-attention hero with strong headline, subheadline, dual CTAs, and supporting metrics/visuals, taking structural inspiration from the reference but with fully original copy and styling.
- **Services & Work**: Card-based services grid and a case-study-focused work section reflecting the same information architecture (what we do, then proof it works).
- **About & Process**: Dedicated storytelling + process sections that give context on the team and “how we work,” akin to the reference site’s middle sections.
- **Social proof & Contact**: Testimonials and a form-driven contact section near the bottom, mirroring the reference site’s use of social proof and a clear path to start a conversation.

All copy, code, and visual details here are original; the reference site was used only for **structure, flow, and UX inspiration**.


