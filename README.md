## RINADS BusinessOS

RINADS BusinessOS is an all-in-one business operating system that powers salons, clinics, retail stores, financial services, and education institutions. Each vertical comes pre-configured with industry-specific workflows, terminology, and compliance features. Built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

### Scripts

- **Install**: `npm install`
- **Dev server**: `npm run dev` (default at `http://localhost:3000`)
- **Build**: `npm run build`
- **Start (production)**: `npm start`

### Project Structure

- `app/`
  - `layout.tsx`: Root layout with BusinessOS branding
  - `page.tsx`: **BusinessOS Homepage** - Modules grid, vertical solutions, and hero section
  - `verticals/`: Vertical solution pages
    - `page.tsx`: Overview of all verticals (SalonOS, ClinicOS, RetailOS, FinanceOS, EduOS)
    - `[slug]/page.tsx`: Individual vertical detail pages
  - `modules/`: Module pages
    - `page.tsx`: Listing of all available modules
    - `[slug]/page.tsx`: Individual module detail pages
  - `features/page.tsx`: Features overview page
  - `pricing/page.tsx`: Pricing plans and tiers
  - `book-demo/page.tsx`: Demo booking form
  - `help/page.tsx`: Help center with articles and tutorials
  - `marketing-archive/page.tsx`: Archived marketing site (legacy)
  - `resources/page.tsx`: Resources/blog page
  - `case-studies/[slug]/page.tsx`: Dynamic case study detail pages
- `components/`
  - `businessos/`: **BusinessOS Components**
    - `BusinessOSNav.tsx`: Main navigation for BusinessOS
    - `Homepage.tsx`: Homepage with modules grid and verticals
    - `VerticalSolutions.tsx`: Vertical solutions overview
    - `VerticalPage.tsx`: Individual vertical page template
    - `ModulesListing.tsx`: Modules listing page
    - `ModuleDetail.tsx`: Individual module detail page
    - `FeaturesOverview.tsx`: Features overview page
    - `Pricing.tsx`: Pricing tables and plans
    - `BookDemo.tsx`: Demo booking form
    - `HelpCenter.tsx`: Help center interface
  - `RevealOnScroll.tsx`: Reusable scroll reveal component
  - `Navbar.tsx`, `Footer.tsx`, etc.: Legacy marketing site components
- `app/globals.css`: Tailwind directives, section spacing utility, and animations
- `tailwind.config.ts`: Tailwind setup with custom color palette
- `lib/gemini.ts`: Gemini AI API helper (optional, for future AI features)

### BusinessOS Features

The platform includes:

- **5 Vertical Solutions**: SalonOS, ClinicOS, RetailOS, FinanceOS, EduOS
- **8 Core Modules**: Inventory, Staff, Financial Reports, AI Assistant, Automation, Multi-location, Analytics, Documentation
- **Pricing Plans**: Starter, Professional, Enterprise tiers
- **Help Center**: Comprehensive documentation and tutorials
- **Demo Booking**: Integrated demo scheduling system

### Vertical Solutions

Each vertical is pre-configured with:
- Industry-specific workflows
- Vertical-appropriate terminology
- Compliance features
- Custom modules and features

### Modules

All modules adapt to your selected vertical, providing:
- Vertical-specific features
- Industry-appropriate workflows
- Customizable settings
- Integration capabilities


