# Product Requirements Document (PRD)

# Setu Routines Monitoring Dashboard

---

## **1. Product Overview**

### **1.1 Product Name**

Setu DataFlow Operations Dashboard

### **1.2 Product Description**

A real-time monitoring dashboard for tracking and managing Setu ETL routines, providing comprehensive visibility into routine performance, status, and operational metrics.

### **1.3 Target Users**

- Data Engineers
- Operations Teams
- System Administrators
- Business Stakeholders monitoring data pipelines

---

## **2. Core Requirements**

### **2.1 Operations Table (Primary Focus)**

#### **2.1.1 Table Structure**

The main operations table will display the following columns:

| Column              | Data Type            | Description                                                  | Interactive           |
| ------------------- | -------------------- | ------------------------------------------------------------ | --------------------- |
| **Routine**         | String + Description | Routine name with brief description below                    | Clickable for details |
| **Routine Type**    | Enum Badge           | Integration, App Extension, Orchestration, Communication     | Filterable            |
| **Sender**          | String               | Source system/service                                        | -                     |
| **Receiver**        | String               | Destination system/service                                   | -                     |
| **Last Episode**    | DateTime + Status    | Timestamp with status badge (Success/Failed/Running/Warning) | Sortable              |
| **Last Run**        | DateTime             | Last execution timestamp                                     | Sortable              |
| **Failed Episodes** | Number Badge         | Count of failed episodes with red indicator                  | Sortable              |
| **Modified By**     | String               | User who last modified the routine                           | -                     |
| **Actions**         | Icon Buttons         | Delete (🗑️) and Download (⬇️) actions                        | Interactive           |

#### **2.1.2 Table Features**

**Search & Filter:**

- Global search bar with placeholder "Search routines by name or description..."
- Type filter dropdown with options:
  - All Types (default)
  - Integration
  - App Extension
  - Orchestration
  - Communication

**Sorting:**

- Sortable columns: Last Episode, Last Run, Failed Episodes
- Default sort: Last Run (descending)

**Visual Indicators:**

- Status badges with color coding:
  - Success: Green
  - Failed: Red
  - Running: Blue
  - Warning: Orange
- Failed episode counts with red circular badges
- Routine type badges with distinct colors

**Row Actions:**

- Delete routine (with confirmation modal)
- Download routine configuration/logs

---

## **3. Technical Specifications**

### **3.1 Frontend Architecture**

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **TypeScript**: Full type safety
- **State Management**: React hooks (useState, useEffect)
- **Data Fetching**: Native fetch API or SWR (to be decided)

### **3.2 Component Structure**

```
src/
├── components/
│   ├── ui/
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Table.tsx
│   │   └── SearchInput.tsx
│   ├── routines/
│   │   ├── RoutinesTable.tsx
│   │   ├── RoutineRow.tsx
│   │   ├── StatusBadge.tsx
│   │   └── TypeBadge.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Sidebar.tsx
├── types/
│   └── routine.ts
├── lib/
│   ├── utils.ts
│   └── api.ts
└── app/
    ├── operations/
    │   └── page.tsx
    └── layout.tsx
```

### **3.3 Data Models**

```typescript
interface Routine {
  id: string;
  name: string;
  description: string;
  type: "Integration" | "App Extension" | "Orchestration" | "Communication";
  sender: string;
  receiver: string;
  lastEpisode: {
    timestamp: string;
    status: "Success" | "Failed" | "Running" | "Warning";
  };
  lastRun: string;
  failedEpisodes: number;
  modifiedBy: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## **4. User Stories**

### **4.1 Primary User Stories**

**As a Data Engineer, I want to:**

- View all active routines in a single table
- Search for specific routines by name or description
- Filter routines by type to focus on specific categories
- See the current status of each routine at a glance
- Identify failed routines quickly through visual indicators
- Sort routines by last run time to see recent activity
- Access routine details by clicking on routine names

**As an Operations Team Member, I want to:**

- Monitor routine health through status indicators
- See failed episode counts to prioritize troubleshooting
- Know who last modified each routine for accountability
- Download routine configurations for analysis
- Delete obsolete routines (with proper permissions)

**As a System Administrator, I want to:**

- Have a clean, organized view of all data pipeline operations
- Quickly identify problematic routines through failed episode badges
- Track routine modification history through "Modified By" information

---

## **5. Functional Requirements**

### **5.1 Core Functionality**

**Table Display:**

- ✅ Display routines in a structured table format
- ✅ Show all required columns as per design
- ✅ Implement responsive design for different screen sizes
- ✅ Handle empty states gracefully

**Search & Filter:**

- ✅ Global search across routine names and descriptions
- ✅ Real-time search (debounced)
- ✅ Type-based filtering
- ✅ Clear search/filter functionality

**Sorting:**

- ✅ Sort by Last Episode timestamp
- ✅ Sort by Last Run timestamp
- ✅ Sort by Failed Episodes count
- ✅ Visual indicators for sort direction

**Actions:**

- ✅ Delete routine with confirmation modal
- ✅ Download routine data/configuration
- ✅ Proper error handling for actions

### **5.2 Visual Requirements**

**Status Indicators:**

- Success: Green badge with checkmark
- Failed: Red badge with error icon
- Running: Blue badge with loading indicator
- Warning: Orange badge with warning icon

**Type Badges:**

- Integration: Blue background
- App Extension: Green background
- Orchestration: Purple background
- Communication: Orange background

**Failed Episodes:**

- Red circular badge with white text
- Show count (e.g., "2", "5")
- Hide badge if count is 0

---

## **6. Non-Functional Requirements**

### **6.1 Performance**

- Table should load within 2 seconds
- Search results should appear within 500ms
- Smooth scrolling for large datasets
- Pagination for tables with >100 rows

### **6.2 Accessibility**

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

### **6.3 Browser Support**

- Chrome 100+
- Firefox 100+
- Safari 14+
- Edge 100+

---

## **7. Future Enhancements (Out of Scope for V1)**

### **7.1 Metrics Dashboard**

- Total Routines counter
- Active Routines counter
- Failed Episodes counter
- Episodes Today counter

### **7.2 Advanced Features**

- Real-time updates via WebSocket
- Routine detail pages
- Historical performance charts
- Bulk operations
- Export functionality (CSV, PDF)
- Advanced filtering (date ranges, status combinations)

---

## **8. Success Metrics**

### **8.1 User Adoption**

- 100% of operations team using the dashboard daily
- Reduced time to identify failed routines by 60%

### **8.2 Performance Metrics**

- Page load time < 2 seconds
- Search response time < 500ms
- 99.9% uptime

### **8.3 User Satisfaction**

- User satisfaction score > 4.5/5
- Reduction in manual routine monitoring by 80%

---

## **9. Implementation Phases**

### **Phase 1: Core Table (Current Focus)**

- Basic table structure
- Static data display
- Search functionality
- Type filtering
- Basic sorting

### **Phase 2: Interactions**

- Delete functionality
- Download functionality
- Status updates
- Error handling

### **Phase 3: Polish & Optimization**

- Performance optimization
- Accessibility improvements
- Mobile responsiveness
- Loading states

---

## **10. Mockup Reference**

Based on the provided design mockup, the table should replicate the exact layout and styling shown in the Setu DataFlow Operations interface, including:

- Clean, modern table design with proper spacing
- Consistent badge styling for status and type indicators
- Proper icon usage for actions
- Color-coded visual hierarchy
- Professional typography and layout

---

**Document Version**: 1.0  
**Last Updated**: August 21, 2025  
**Next Review**: Phase 1 completion
