# Setu DataFlow Operations Dashboard - Implementation Plan

## **Project Overview**

Building a complete dashboard for monitoring Setu ETL routines with metrics, search, filtering, and detailed operations table.

## **Tech Stack**

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React (included with shadcn/ui)
- **TypeScript**: Full type safety
- **Date Handling**: date-fns
- **State Management**: React hooks (useState, useEffect, useCallback, useMemo)

## **Next.js Best Practices**

- App Router for file-based routing
- Server Components by default, Client Components when needed
- Proper component composition and reusability
- TypeScript-first development
- Performance optimization with React.memo and useMemo
- Accessibility-first approach

---

## **Phase 1: Project Foundation & Setup**

### **Step 1.1: shadcn/ui Setup**

```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Install required shadcn/ui components
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add badge
npx shadcn@latest add card
npx shadcn@latest add select
npx shadcn@latest add table
npx shadcn@latest add dropdown-menu

# Install additional dependencies
npm install date-fns clsx
```

### **Step 1.2: Project Structure (Next.js App Router)**

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── dashboard/       # Dashboard-specific components
│   ├── table/           # Table-related components
│   └── layout/          # Layout components
├── lib/
│   ├── utils.ts         # shadcn/ui utils + custom utilities
│   ├── constants.ts     # App constants
│   └── mock-data.ts     # Mock data
├── types/
│   └── index.ts         # TypeScript interfaces
└── hooks/               # Custom React hooks
    └── useRoutines.ts
```

### **Step 1.3: TypeScript Configuration**

Ensure proper TypeScript setup with Next.js:

- Strict mode enabled

### **Step 1.4: Utility Functions & Constants**

Setup utility functions and constants:

- Date formatting utilities
- Status and type color mappings
- Search and filter logic
- Component variant utilities (extending shadcn/ui utils)

---

## **Phase 2: shadcn/ui Components Setup**

### **Step 2.1: Core shadcn/ui Components**

**Use pre-built shadcn/ui components:**

1. **Button** - Action buttons with variants
2. **Input** - Search input field with icons
3. **Badge** - Status and type indicators (customize variants)
4. **Card** - Metric cards and containers
5. **Select** - Filter dropdown
6. **Table** - Main data table structure

### **Step 2.2: Custom Component Extensions**

**Extend shadcn/ui components for specific needs:**

```typescript
// Custom Badge variants for status and types
const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      status: {
        success: "bg-green-100 text-green-800",
        failed: "bg-red-100 text-red-800",
        running: "bg-blue-100 text-blue-800",
        warning: "bg-yellow-100 text-yellow-800",
      },
      type: {
        integration: "bg-blue-50 text-blue-700",
        "app-extension": "bg-green-50 text-green-700",
        orchestration: "bg-purple-50 text-purple-700",
        communication: "bg-orange-50 text-orange-700",
      },
    },
  }
);
```

### **Step 2.3: Icon Integration**

**Using Lucide React (included with shadcn/ui):**

- Search, Filter, ChevronDown (UI)
- RotateCcw, Play, AlertTriangle, Calendar (Metrics)
- Trash2, Download (Actions)
- Check, X, Clock, AlertCircle (Status)

### **Step 2.4: Tailwind Configuration**

**Extend tailwind.config.js for custom colors:**

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Status colors
        success: "#10B981",
        failed: "#EF4444",
        running: "#3B82F6",
        warning: "#F59E0B",
        // Type colors
        integration: "#3B82F6",
        "app-extension": "#10B981",
        orchestration: "#8B5CF6",
        communication: "#F59E0B",
      },
    },
  },
};
```

---

## **Phase 3: Layout Structure (Next.js App Router)**

### **Step 3.1: Root Layout Enhancement**

**File:** `src/app/layout.tsx`
**Next.js Best Practices:**

- Metadata configuration
- Font optimization
- Global CSS imports
- Provider setup (if needed)

### **Step 3.2: Main Dashboard Layout**

**Features:**

- Flex layout with sidebar + main content
- Client Component for interactivity
- Responsive design with mobile considerations

### **Step 3.3: Sidebar Navigation**

**File:** `src/components/layout/Sidebar.tsx`
**Features:**

- "DataFlow Ops" branding
- Navigation menu (Operations active)
- Clean minimal design
- Mobile responsive behavior

### **Step 3.4: Main Content Area**

**File:** `src/app/page.tsx` (Server Component)
**Next.js App Router approach:**

- Server Component by default
- Data fetching at page level
- Pass data to client components as needed

---

## **Phase 4: Dashboard Metrics Section**

### **Step 4.1: Metrics Container (Server Component)**

**File:** `src/components/dashboard/MetricsSection.tsx`
**Features:**

- Server Component for data fetching
- Grid layout using shadcn/ui Card components
- Responsive design (4-col → 2-col → 1-col)

### **Step 4.2: Metric Card (Client Component)**

**File:** `src/components/dashboard/MetricCard.tsx`
**Using shadcn/ui Card:**

```typescript
interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  trend?: { value: number; isPositive: boolean };
}
```

### **Step 4.3: TypeScript Interfaces**

**File:** `src/types/index.ts`

````typescript
**Data structure:**
```typescript
interface DashboardMetrics {
  totalRoutines: number;
  activeRoutines: number;
  failedEpisodes: number;
  episodesToday: number;
}

interface Routine {
  id: string;
  name: string;
  description: string;
  type: 'Integration' | 'App Extension' | 'Orchestration' | 'Communication';
  sender: string;
  receiver: string;
  lastEpisode: {
    timestamp: string;
    status: 'Success' | 'Failed' | 'Running' | 'Warning';
  };
  lastRun: string;
  failedEpisodes: number;
  modifiedBy: string;
  createdBy: string;
}
````

---

## **Phase 5: Search & Filter Section (Client Components)**

### **Step 5.1: Search Bar Component**

**File:** `src/components/dashboard/SearchBar.tsx`
**Using shadcn/ui Input:**

- Search icon from Lucide React
- Debounced input with useCallback
- Client Component for interactivity

### **Step 5.2: Type Filter Component**

**File:** `src/components/dashboard/TypeFilter.tsx`
**Using shadcn/ui Select:**

- Dropdown with proper styling
- Filter state management
- TypeScript enum for filter options

### **Step 5.3: Custom Hooks for State Management**

**File:** `src/hooks/useRoutines.ts`
**Next.js Best Practices:**

```typescript
export function useRoutines() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const filteredRoutines = useMemo(() => {
    // Filter and sort logic
  }, [routines, searchQuery, selectedType, sortConfig]);

  return {
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    sortConfig,
    setSortConfig,
    filteredRoutines,
  };
}
```

---

## **Phase 6: Data Table Implementation (shadcn/ui Table)**

### **Step 6.1: Table Structure**

**File:** `src/components/table/RoutinesTable.tsx`
**Using shadcn/ui Table components:**

```typescript
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
```

### **Step 6.2: Table Implementation Strategy**

**Client vs Server Components:**

````

### **Step 4.4: Metrics Integration**

- Connect metrics cards to data
- Add loading states
- Implement number formatting
- Add subtle animations

---

## **Phase 5: Search & Filter Section**

### **Step 5.1: Search Bar Component**

**File:** `src/components/dashboard/SearchBar.tsx`
**Features:**

- Search icon on the left
- Placeholder text: "Search routines by name or description..."
- Real-time search with debouncing (300ms)
- Clear search functionality

### **Step 5.2: Type Filter Component**

**File:** `src/components/dashboard/TypeFilter.tsx`
**Features:**

- Dropdown with "All Types" default
- Filter options: Integration, App Extension, Orchestration, Communication
- Filter icon and chevron
- Proper dropdown styling

### **Step 5.3: Search & Filter Logic**

**File:** `src/lib/filters.ts`
**Functions:**

- `filterBySearch(routines, query)`
- `filterByType(routines, type)`
- `combineFilters(routines, query, type)`

### **Step 5.4: Search & Filter Container**

**File:** `src/components/dashboard/SearchAndFilter.tsx`
**Layout:**

- Search bar on the left (flex-grow)
- Type filter on the right
- Proper spacing and alignment

---

## **Phase 6: Data Table Implementation**

### **Step 6.1: Table Structure Setup**

**File:** `src/components/table/RoutinesTable.tsx`
**Components:**

- Table wrapper with proper styling
- Responsive design considerations
- Overflow handling for mobile

### **Step 6.2: Table Header**

**File:** `src/components/table/TableHeader.tsx`
**Columns:**

- Routine | Routine Type | Sender | Receiver | Last Episode | Last Run | Failed Episodes | Modified By | Actions
  **Features:**
- Sortable columns (Last Episode, Last Run, Failed Episodes)
- Sort indicators (arrows)
- Proper column widths

### **Step 6.3: Table Row Component**

**File:** `src/components/table/TableRow.tsx`
**Features:**

- Routine name + description layout
- Status and type badges
- Failed episode count badges
- Action buttons
- Hover effects

### **Step 6.4: Status Badge Component**

**File:** `src/components/table/StatusBadge.tsx`
**Variants:**

- Success: Green with checkmark
- Failed: Red with X
- Running: Blue with clock
- Warning: Orange with alert

### **Step 6.5: Type Badge Component**

**File:** `src/components/table/TypeBadge.tsx`
**Variants:**

- Integration: Blue background
- App Extension: Green background
- Orchestration: Purple background
- Communication: Orange background

### **Step 6.6: Action Buttons**

**File:** `src/components/table/ActionButtons.tsx`
**Buttons:**

- Delete button with trash icon
- Download button with download icon
- Proper spacing and hover effects

---

## **Phase 7: Data Management & State**

### **Step 7.1: Mock Data Creation**

**File:** `src/data/routines.ts`
**Content:**

- Comprehensive mock data matching the screenshot
- All 5 routines with proper data
- Realistic timestamps and user names

### **Step 7.2: State Management Setup**

**File:** `src/hooks/useRoutines.ts`
**State:**

```typescript
const [routines, setRoutines] = useState<Routine[]>([]);
const [filteredRoutines, setFilteredRoutines] = useState<Routine[]>([]);
const [searchQuery, setSearchQuery] = useState("");
const [selectedType, setSelectedType] = useState("All Types");
const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
````

### **Step 7.3: Sorting Logic**

**File:** `src/lib/sorting.ts`
**Functions:**

- `sortByDate(routines, key, direction)`
- `sortByNumber(routines, key, direction)`
- `applySorting(routines, config)`

### **Step 7.4: Data Integration**

**Connect all components:**

- Pass data down through props
- Implement event handlers
- Update filtered results

---

## **Phase 8: Interactive Features**

### **Step 8.1: Search Functionality**

**Implementation:**

- Debounced search input
- Search across routine name and description
- Real-time results update
- Clear search option

### **Step 8.2: Filter Functionality**

**Implementation:**

- Type-based filtering
- Dropdown interaction
- Combined search + filter
- Filter state management

### **Step 8.3: Sorting Functionality**

**Implementation:**

- Column header click handlers
- Sort direction toggling
- Visual sort indicators
- Multiple column sorting support

### **Step 8.4: Action Handlers**

**Implementation:**

- Delete confirmation modal
- Download functionality
- Error handling
- Success feedback

---

## **Phase 9: Polish & Optimization**

### **Step 9.1: Performance Optimization**

**Optimizations:**

- React.memo for table rows
- useMemo for filtered data
- useCallback for event handlers
- Debounced search input

### **Step 9.2: Responsive Design**

**Breakpoints:**

- Mobile: Stack metrics cards, horizontal scroll table
- Tablet: 2-column metrics, responsive table
- Desktop: Full 4-column layout

### **Step 9.3: Accessibility**

**Features:**

- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

### **Step 9.4: Error Handling & Loading States**

**States:**

- Loading skeletons for metrics and table
- Empty state for no results
- Error states for failed operations
- Success feedback for actions

---

## **Phase 10: Testing & Quality Assurance**

### **Step 10.1: Unit Testing**

**Test coverage:**

- Utility functions
- Component rendering
- Event handlers
- Data filtering and sorting

### **Step 10.2: Integration Testing**

**Test scenarios:**

- Search and filter combinations
- Sorting functionality
- Action button interactions
- Responsive design

### **Step 10.3: Manual Testing**

**Checklist:**

- Cross-browser compatibility
- Mobile responsiveness
- Accessibility features
- Performance on large datasets

---

## **Implementation Timeline**

## **Implementation Timeline**

### **Week 1: Foundation & Setup**

- **Phase 1**: shadcn/ui setup and project structure
- **Phase 2**: Component system setup with shadcn/ui
- **Phase 3**: Next.js App Router layout structure

### **Week 2: Core Dashboard Features**

- **Phase 4**: Dashboard metrics with Server Components
- **Phase 5**: Search & filter with Client Components
- **Phase 6**: Data table using shadcn/ui Table

### **Week 3: Functionality & Polish**

- **Phase 7**: State management with custom hooks
- **Phase 8**: Interactive features and actions
- **Phase 9**: Performance optimization and responsive design

### **Week 4: Testing & Deployment**

- **Phase 10**: Testing & QA
- **Next.js optimization** (build, bundle analysis)
- **Deployment preparation**

---

## **Success Criteria**

### **Functional Requirements:**

- ✅ Exact visual match to provided screenshot
- ✅ All search and filter functionality working
- ✅ Sorting on specified columns
- ✅ Action buttons with proper handlers
- ✅ Responsive design for all screen sizes

### **Technical Requirements (Next.js Best Practices):**

- ✅ Next.js 15 App Router implementation
- ✅ shadcn/ui component system
- ✅ TypeScript with proper type safety
- ✅ Server/Client Component optimization
- ✅ Performance optimized (React.memo, useMemo, useCallback)
- ✅ Accessibility compliant (WCAG 2.1 AA)
- ✅ Clean, maintainable code structure

### **User Experience Requirements:**

- ✅ Smooth interactions with shadcn/ui animations
- ✅ Intuitive navigation and controls
- ✅ Clear visual hierarchy and feedback
- ✅ Fast search and filter responses
- ✅ Professional, polished appearance

---

## **Next Steps**

1. **Initialize shadcn/ui** in the existing Next.js project
2. **Set up component structure** following App Router patterns
3. **Begin Phase 1** implementation with proper TypeScript setup

**Ready to start implementation!** 🚀
