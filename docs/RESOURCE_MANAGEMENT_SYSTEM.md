# Resource Management System

A comprehensive resource management system for cataloguing project documentation by partners and projects. The system facilitates knowledge sharing through effective search, filtering, and pagination of uploaded resources.

## 🏗️ Architecture Overview

The resource management system is built with a modular architecture consisting of three main components that work together seamlessly:

### Core Components

1. **ResourcesSearchAndFilter** - Advanced search and filtering interface
2. **ResourcesGrid** - Resource display with cards and actions
3. **ResourcesPagination** - Pagination controls and page size management

### Supporting Infrastructure

- **Custom Hooks** - State management with URL synchronization
- **Type System** - Comprehensive TypeScript interfaces
- **API Layer** - Mock API with 250+ realistic resources
- **UI Components** - Reusable Radix UI components

## 📁 File Structure

```
components/resources/
├── ResourcesPage.tsx                    # Main integration component
├── ResourcesSearchAndFilter.tsx         # Search and filter main component
├── ResourcesGrid.tsx                    # Resource grid main component
├── ResourcesPagination.tsx              # Pagination main component
├── ResourcesSearchAndFilter/            # Search and filter subcomponents
│   ├── SearchInput.tsx                  # Search input with suggestions
│   ├── FilterPanel.tsx                  # Advanced filtering interface
│   └── ActiveFilters.tsx                # Active filter display and management
├── ResourcesGrid/                       # Grid subcomponents
│   ├── ResourceCard.tsx                 # Individual resource card
│   ├── GridControls.tsx                 # View controls and sorting
│   └── ResourceModal.tsx                # Detailed resource view modal
└── ResourcesPagination/                 # Pagination subcomponents
    ├── PageControls.tsx                 # Navigation controls
    └── PageSizeSelector.tsx             # Page size selection

hooks/
├── useResourceFilters.ts                # Filter state management
├── usePagination.ts                     # Pagination state management
└── useResourceSearch.ts                 # Search functionality

types/
└── resources.ts                         # Complete type definitions

lib/api/
└── resources.ts                         # Mock API implementation
```

## 🚀 Features

### Search & Discovery
- **Real-time Search** with debounced queries and suggestions
- **Search History** with local storage persistence
- **Smart Suggestions** with resource titles, partners, and projects
- **Quick Search** shortcuts for common queries

### Advanced Filtering
- **Resource Type** filtering (research, reports, presentations, etc.)
- **Partner/Organization** filtering with dynamic loading
- **Project** filtering with partner relationship awareness
- **Date Range** filtering for upload or publication dates
- **Tag-based** filtering with color-coded tags
- **File Format** filtering (PDF, DOC, PPT, etc.)
- **Status** filtering (published, draft, review, archived)
- **Access Level** filtering (public, internal, restricted, confidential)

### Resource Display
- **Responsive Grid** layout with configurable view options
- **Resource Cards** with rich metadata display
- **Thumbnail Preview** for supported file types
- **Action Buttons** (view, download, favorite, share)
- **Rating System** with average ratings display
- **Download Counter** and view statistics

### Pagination & Navigation
- **Page Navigation** with previous/next controls
- **Page Size Selection** (10, 25, 50, 100 items per page)
- **Jump to Page** functionality
- **Result Information** showing current page and total items
- **URL State Management** for bookmarkable pages

### State Management
- **URL Synchronization** - All filters, search, and pagination sync with URL
- **Browser History** - Full back/forward navigation support
- **Persistent State** - Filter and search preferences remembered
- **Real-time Updates** - Instant UI updates with debounced API calls

## 🔧 Technical Implementation

### Technology Stack
- **Next.js 15.5.0** with App Router
- **React 19.1.1** with modern hooks
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **Radix UI** for accessible components
- **Zustand** for global state management

### State Management Pattern

The system uses a combination of URL state and local state for optimal user experience:

```typescript
// URL State (shareable, bookmarkable)
const filters = {
  search: 'health policy',
  type: ['research-findings', 'reports'],
  partnerId: ['1', '2'],
  page: 2,
  pageSize: 25
}

// Local State (UI interactions)
const uiState = {
  showSuggestions: true,
  isFilterPanelOpen: false,
  selectedResource: null
}
```

### API Integration

The system includes a comprehensive mock API that can be easily replaced with real endpoints:

```typescript
// Mock API functions
await fetchResources(filters, pagination)
await searchSuggestions(query)
await getPartners()
await getProjects() 
await getTags()
```

### Type Safety

Comprehensive TypeScript interfaces ensure type safety across the entire system:

```typescript
interface Resource {
  id: string
  title: string
  description: string
  type: ResourceType
  fileFormat: FileFormat
  status: ResourceStatus
  accessLevel: AccessLevel
  partner: Partner
  project: Project
  tags: Tag[]
  // ... 20+ additional properties
}
```

## 📊 Mock Data

The system includes realistic mock data for development and testing:

- **250+ Resources** with varied content and metadata
- **6 Partner Organizations** (UNICEF, WHO, Ghana Health Service, etc.)
- **6 Active Projects** across different domains
- **10 Tag Categories** with color coding
- **8 Resource Types** covering common document types
- **4 Access Levels** from public to confidential

## 🎨 UI/UX Features

### Responsive Design
- **Mobile-first** approach with breakpoint optimizations
- **Flexible Grid** that adapts to screen size
- **Touch-friendly** controls for mobile devices
- **Accessible** components following WCAG guidelines

### Visual Indicators
- **Loading States** with skeleton components
- **Filter Badges** showing active filter count
- **Status Indicators** for resource state
- **Progress Indicators** for multi-step operations

### Interactive Elements
- **Hover Effects** for better user feedback
- **Smooth Animations** using Tailwind animations
- **Modal Dialogs** for detailed resource views
- **Dropdown Menus** for action selection

## 🔄 URL State Management

The system maintains all state in the URL for shareability and bookmarking:

```
/resources?search=health&type=research-findings&partnerId=1,2&page=2&pageSize=25&sortBy=uploadDate&sortOrder=desc
```

This allows users to:
- **Share** filtered views with colleagues
- **Bookmark** specific searches
- **Use browser navigation** (back/forward)
- **Refresh** without losing state

## 🧪 Development & Testing

### Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. **View the Resource System**
   Navigate to a page that includes the `ResourcesPage` component

### Usage Example

```tsx
import { ResourcesPage } from '@/components/resources/ResourcesPage'

export default function ResourcesPageRoute() {
  return <ResourcesPage />
}
```

### Customization

The system is highly customizable through configuration:

```typescript
// Customize pagination defaults
const pagination = usePagination(50) // 50 items per page

// Customize filter options
const customResourceTypes = [
  { value: 'custom-type', label: 'Custom Type' }
]

// Override API endpoints
const apiConfig = {
  baseUrl: '/api/v2',
  timeout: 5000
}
```

## 🚀 Future Enhancements

### Planned Features
- **Real API Integration** with backend services
- **File Upload** functionality with drag-and-drop
- **Advanced Analytics** with usage tracking
- **Collaborative Features** (comments, reviews, ratings)
- **Bulk Operations** (bulk download, bulk tagging)
- **Export Capabilities** (CSV, Excel, PDF reports)

### Performance Optimizations
- **Virtual Scrolling** for large datasets
- **Image Lazy Loading** for thumbnails
- **API Response Caching** with SWR or React Query
- **Search Debouncing** optimization
- **Bundle Size** optimization

### Accessibility Improvements
- **Screen Reader** optimization
- **Keyboard Navigation** enhancements
- **High Contrast** mode support
- **Focus Management** improvements

## 📈 Performance Considerations

The system is designed with performance in mind:

- **Debounced Search** (300ms delay) to reduce API calls
- **Memoized Components** to prevent unnecessary re-renders
- **Efficient Filtering** with optimized algorithms
- **Lazy Loading** for non-critical components
- **Minimal Re-renders** through careful state management

## 🛡️ Security Features

- **Access Level** enforcement with visual indicators
- **Input Sanitization** for search queries
- **XSS Protection** through proper escaping
- **CSRF Protection** readiness for real API integration

## 📱 Browser Compatibility

- **Modern Browsers** (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+)
- **Mobile Browsers** (iOS Safari 14+, Chrome Mobile 88+)
- **Progressive Enhancement** with graceful degradation

## 📝 API Documentation

### Mock API Endpoints

The system simulates the following API endpoints:

```typescript
// Fetch resources with filtering and pagination
GET /api/resources?search=query&type=research&page=1&pageSize=25

// Get search suggestions
GET /api/resources/suggestions?q=health

// Get partners list
GET /api/partners

// Get projects list  
GET /api/projects

// Get tags list
GET /api/tags

// Download resource
GET /api/resources/:id/download

// Get resource thumbnail
GET /api/resources/:id/thumbnail
```

### Response Formats

```typescript
// Resource list response
interface ResourceResponse {
  resources: Resource[]
  pagination: {
    currentPage: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
  filters: ResourceFilters
}

// Search suggestions response
interface SearchSuggestionsResponse {
  suggestions: ResourceSearchSuggestion[]
  query: string
  timestamp: string
}
```

## 🤝 Contributing

When contributing to the resource management system:

1. **Follow TypeScript** strict mode guidelines
2. **Add comprehensive types** for new features
3. **Include tests** for new functionality
4. **Update documentation** for API changes
5. **Maintain consistency** with existing patterns

## 📄 License

This resource management system is built as part of the NCD Navigator project. Please refer to the main project license for usage terms.

---

## Summary

This comprehensive resource management system provides a complete solution for cataloguing and discovering project documentation. With its modular architecture, robust state management, and extensive feature set, it serves as a solid foundation for knowledge sharing in development projects.

The system demonstrates modern React/Next.js patterns, comprehensive TypeScript usage, and thoughtful UX design, making it both functional for users and maintainable for developers.
