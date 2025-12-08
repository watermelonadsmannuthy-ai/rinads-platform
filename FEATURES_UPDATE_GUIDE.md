# 📝 How to Update Latest Features

## Quick Update Guide

### Step 1: Edit the Features File
Open: `data/latest-features.ts`

### Step 2: Add a New Feature
Add a new object to the `latestFeatures` array:

```typescript
{
  id: "5", // Unique ID
  title: "Your Feature Name",
  description: "Detailed description of what this feature does and why it's valuable.",
  category: "Category Name", // e.g., "AI & Automation", "Inventory", "Financial Reports"
  date: "2024-12-08", // Format: YYYY-MM-DD (use today's date)
  icon: "Zap", // Icon name from lucide-react (Zap, BarChart, Settings, Package, etc.)
  link: "/modules/feature-slug", // Optional: Link to feature detail page
  badge: "New", // Optional: Badge like "New", "Beta", "Coming Soon"
}
```

### Step 3: Available Icons
You can use any icon from lucide-react. Common ones:
- `Zap` - AI, Lightning, Power
- `BarChart` - Analytics, Reports
- `Settings` - Configuration, Automation
- `Package` - Inventory, Products
- `Users` - Staff, Team
- `TrendingUp` - Growth, Analytics
- `FileText` - Documents, Reports
- `Grid3x3` - Multi-location, Organization
- `Wallet` - Finance, Payments
- `Store` - Retail, Salon
- `Stethoscope` - Clinic, Healthcare
- `ShoppingBag` - Retail, E-commerce
- `GraduationCap` - Education

### Step 4: Save and Deploy
1. Save the file
2. Commit and push:
   ```bash
   git add data/latest-features.ts
   git commit -m "Add new feature: [Feature Name]"
   git push origin main
   ```
3. Vercel will auto-deploy (if connected)

## Example: Adding a New Feature

```typescript
{
  id: "5",
  title: "Real-time Inventory Alerts",
  description: "Get instant notifications when stock levels are low. Set custom reorder points and never run out of inventory again.",
  category: "Inventory",
  date: "2024-12-08",
  icon: "Package",
  link: "/modules/inventory-management",
  badge: "New",
}
```

## Features Display

- **Homepage**: Shows the 4 most recent features (sorted by date)
- **What's New Page** (`/whats-new`): Shows all features
- **Navigation**: "What's New" link added to main nav

## Tips

- **Keep descriptions concise**: 1-2 sentences work best
- **Use current dates**: Features are sorted by date (newest first)
- **Add badges**: Use "New" for recent features, "Beta" for testing features
- **Link to details**: Add links to module pages or feature detail pages
- **Update regularly**: Keep the list fresh with recent updates

## Categories

Common categories to use:
- AI & Automation
- Inventory
- Financial Reports
- Staff Management
- Analytics
- Automation
- Multi-location
- Security
- Integrations





