# Pipeline Board - Complete Feature Set

## Overview

The Pipeline Board is a comprehensive CRM tool integrated into RINADS BusinessOS, featuring drag-and-drop opportunity management, advanced filtering, analytics, and multi-pipeline support.

## Features

### 1. Data Persistence ✅

**Location:** `lib/pipeline-data.ts`

- **localStorage-based storage** for client-side persistence
- **API-ready structure** - easy to swap for backend API calls
- **CRUD operations:**
  - `createOpportunity()` - Add new opportunities
  - `updateOpportunity()` - Update existing opportunities
  - `deleteOpportunity()` - Remove opportunities
  - `loadPipelineData()` - Load all data
  - `savePipelineData()` - Save all data

**To connect to a backend:**
Simply replace the localStorage calls in `lib/pipeline-data.ts` with API fetch calls.

### 2. Advanced Filters ✅

**Features:**
- **Owner Filter** - Filter by opportunity owner
- **Amount Range** - Min and max amount filters
- **Date Range** - Filter by closing date (start/end)
- **Search** - Text search across title, company, and client
- **Combined Filters** - All filters work together

**Usage:**
Click the "Filters" button in the header to open the filter panel.

### 3. Opportunity Detail View ✅

**Features:**
- **Click any card** to view/edit full details
- **Complete form** with all fields:
  - Opportunity Name (required)
  - Owner (required)
  - Company Name
  - Client Name
  - Amount (₹)
  - Closing Date
  - Stage (required)
  - Probability (%)
  - Description
- **Edit Mode** - Update existing opportunities
- **Delete** - Remove opportunities with confirmation
- **Create Mode** - Add new opportunities

### 4. Multiple Pipelines ✅

**Default Pipelines:**
1. **Software Consulting**
   - Qualification → Gather Requirements → Proposal → Implementation → Training → Payment Received → Cancelled
2. **Sales Pipeline**
   - Lead → Qualified → Proposal → Won

**Pipeline Selector:**
- Dropdown in header to switch between pipelines
- Each pipeline has its own stages and opportunities
- Easy to add more pipelines (edit `lib/pipeline-data.ts`)

**To Add a New Pipeline:**
```typescript
{
  id: "your-pipeline-id",
  name: "Your Pipeline Name",
  stages: [
    { id: "stage-1", title: "Stage 1", color: "bg-blue-600", order: 1 },
    // ... more stages
  ],
  createdAt: new Date().toISOString(),
}
```

### 5. Analytics Dashboard ✅

**Metrics:**
- **Total Value** - Sum of all opportunity amounts
- **Average Deal Size** - Total value / opportunity count
- **Weighted Value** - Value adjusted by probability
- **Total Opportunities** - Count of all opportunities

**Stage Breakdown:**
- Count and value for each stage
- Visual color coding matching stage headers
- Quick overview of pipeline health

**Access:**
Click the "Analytics" button in the header.

## Usage

### Adding an Opportunity

1. Click "Add Opportunity" button
2. Fill in the form (required fields: Name, Owner, Stage)
3. Click "Create Opportunity"

### Editing an Opportunity

1. Click on any opportunity card
2. Modify fields in the modal
3. Click "Update Opportunity"

### Moving Opportunities

1. **Drag and drop** any card to a different stage
2. The opportunity automatically updates

### Filtering

1. Click "Filters" button
2. Set your filter criteria
3. Results update in real-time
4. Click "Clear Filters" to reset

### Viewing Analytics

1. Click "Analytics" button
2. View metrics and stage breakdown
3. Click outside to close

## Data Structure

### Opportunity
```typescript
{
  id: string;
  title: string;
  company?: string;
  client?: string;
  amount: number;
  owner: string;
  closingDate?: string;
  stage: string;
  pipelineId: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  probability?: number;
  tags?: string[];
}
```

### Pipeline
```typescript
{
  id: string;
  name: string;
  stages: Stage[];
  createdAt: string;
}
```

### Stage
```typescript
{
  id: string;
  title: string;
  color: string; // Tailwind color class
  order: number;
}
```

## Customization

### Adding Custom Stages

Edit the pipeline in `lib/pipeline-data.ts`:
```typescript
stages: [
  { id: "new-stage", title: "New Stage", color: "bg-purple-600", order: 1 },
]
```

### Changing Colors

Use Tailwind color classes:
- `bg-blue-600`, `bg-purple-600`, `bg-green-600`, etc.
- Or custom colors: `bg-[#your-color]`

### Connecting to Backend

Replace functions in `lib/pipeline-data.ts`:

```typescript
export async function loadPipelineData() {
  const response = await fetch('/api/pipeline');
  return response.json();
}

export async function createOpportunity(opportunity) {
  const response = await fetch('/api/opportunities', {
    method: 'POST',
    body: JSON.stringify(opportunity),
  });
  return response.json();
}
```

## Future Enhancements

Potential additions:
- [ ] Export to CSV/Excel
- [ ] Email notifications on stage changes
- [ ] Activity timeline per opportunity
- [ ] Team collaboration features
- [ ] Custom fields per pipeline
- [ ] Pipeline templates
- [ ] Advanced reporting
- [ ] Integration with calendar
- [ ] Mobile app sync

## Access

**URL:** `/pipeline`

**Navigation:** Available in BusinessOSNav as "Pipeline"

---

Built with Next.js 14, TypeScript, and Tailwind CSS.



