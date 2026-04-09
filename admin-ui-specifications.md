# Admin UI Specifications Document

## Overview

The Admin UI is a comprehensive administrative interface for DigitalQatalyst's content and recruitment management system. It provides role-based access control, content management capabilities, recruitment tools, and system administration features.

## Architecture

### Technology Stack
- **Frontend**: React with TypeScript
- **Routing**: React Router
- **UI Components**: Custom components with Lucide React icons
- **Backend**: Supabase (PostgreSQL database with Row Level Security)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage for media files

### Directory Structure
```
src/admin-ui/
├── components/          # Reusable UI components
├── pages/              # Page components
├── services/           # Service layer for data operations
├── utils/              # Utility functions and configurations
├── hooks/              # Custom React hooks
├── sql/                # Database setup and migration scripts
└── examples/           # Example files and templates
```

## Core Features

### 1. Authentication & Authorization

#### Role-Based Access Control (RBAC)
- **Super Admin**: Full system access
- **Admin**: Administrative privileges
- **HR Admin**: HR and recruitment access
- **HR Viewer**: Read-only HR access
- **Editor**: Content management access
- **Viewer**: Limited read access

#### Navigation Structure
The navigation is dynamically filtered based on user roles:

**Overview Section**
- Dashboard (All users)
- Analytics (HR+ roles)

**Recruitment Section** (HR+ roles)
- Job Applications / CV Screening
- Job Postings
- Interviews

**System Section** (Role-based)
- Notifications (Editor+)
- User Management (Admin+)
- Settings (Admin+)

### 2. Dashboard

#### Executive Overview
- Real-time statistics and KPIs
- Role-based widget visibility
- Quick access to recent activities

#### Key Metrics
- Total Applications
- Pending Reviews
- Upcoming Interviews
- Open Positions
- Active Users
- Content Views
- Published Posts

#### Recent Activity Widgets
- Recent Applications (HR roles)
- Upcoming Interviews (HR Admin+)
- Active Job Postings (HR Admin+)
- Recent Users (Admin only)
- Quick Insights summary

### 3. Content Management System

#### Blog/Content Creation
**Content Types Supported:**
- Blog Posts
- Articles
- Research Papers
- Whitepapers
- Case Studies
- Expert Interviews
- Podcasts
- Prediction Analysis

**Advanced Features:**
- Rich Text Editor with HTML output
- Author selection and management
- Category assignment
- Tag system
- Featured content flagging
- SEO metadata (title, description, canonical URL)
- Publication scheduling
- Read time calculation
- Hero image upload

#### Digital Marketplace Classification
**Filter Configuration:**
- **Digital Perspectives**: D1-D6 framework (E4.0, DCO, DBP, DT2.0, etc.)
- **Digital Streams**: Front-End, Core, Enablers
- **Digital Domains**: Stream-specific domains (Channels, Experience, Services, etc.)
- **Digital Sectors**: Cross-sector and industry-specific classifications
- **Content Types**: Articles, Blogs, Whitepapers, etc.
- **Formats**: Quick Reads, In-Depth Reports, Interactive Tools
- **Popularity Tags**: Latest, Trending, Most Downloaded, Editor's Pick

#### Author Management
- Author profiles with avatars
- Social media integration (LinkedIn, Twitter, Website)
- Bio and contact information
- Author-content relationships
- Avatar upload and storage

#### Category Management
- Hierarchical category structure
- Category descriptions
- Content categorization

### 4. Recruitment Management

#### Job Application Processing
**Application Tracking:**
- Multi-status workflow (Pending, Reviewing, Shortlisted, Interviewed, Accepted, Rejected)
- CV screening with AI-powered analysis
- Application filtering and search
- Status updates with internal notes
- Rejection reason tracking

**CV Screening Features:**
- Skills matching (required and preferred)
- Experience level validation
- Education requirements checking
- AI-powered scoring and recommendations
- Screening result storage and retrieval

#### Job Posting Management
- Job creation and editing
- Status management (Open, Closed, Draft)
- Application tracking per posting
- Location and job type classification
- Publication and expiration management

#### Interview Scheduling
- Interview calendar management
- Multiple interview types support
- Candidate-interviewer matching
- Status tracking (Scheduled, Completed, Cancelled)
- Interview history and notes

### 5. Media Management

#### Media Library
- Multi-format support (Images, Videos, Documents)
- Storage organization with buckets
- Thumbnail generation
- Media metadata management
- Search and filtering capabilities

#### Upload Features
- Drag-and-drop interface
- File type validation
- Size limitations
- Progress tracking
- Error handling

### 6. User Management

#### Administrative Functions
- User creation and management
- Role assignment and modification
- Activity status tracking
- User profile management
- Permission management

### 7. System Administration

#### Settings Management
- System configuration
- Feature toggles
- Integration settings
- Security configurations

#### Notification System
- Real-time notifications
- Notification history
- User preference management
- Email notification settings

## Database Schema

### Core Tables

#### Authors
```sql
- id (UUID, Primary Key)
- name (Text)
- title (Text)
- avatar (Text, URL)
- bio (Text)
- linkedIn (Text, URL)
- twitter (Text, URL)
- website (Text, URL)
- email (Text)
- created_at (Timestamp)
- updated_at (Timestamp)
```

#### Media Items
```sql
- id (UUID, Primary Key)
- slug (Text)
- title (Text)
- summary (Text)
- status (Enum: Draft, InReview, Scheduled, Published, Archived)
- visibility (Enum: Public, Private, Unlisted)
- language (Text)
- seo_title (Text)
- seo_description (Text)
- canonical_url (Text)
- published_at (Timestamp)
- created_at (Timestamp)
- updated_at (Timestamp)
- thumbnail_url (Text, URL)
- tags (JSON)
- category (Text)
- featured (Boolean)
- hero_image (Text, URL)
- read_time (Integer)
- highlights (Text)
```

#### Articles (extends Media Items)
```sql
- id (UUID, Primary Key, Foreign Key to media_items)
- body_html (Text)
- body_json (JSON)
- byline (Text)
- source (Text)
```

#### Videos (extends Media Items)
```sql
- id (UUID, Primary Key, Foreign Key to media_items)
- video_url (Text, URL)
- platform (Text)
- duration_sec (Integer)
- transcript_url (Text, URL)
```

#### Podcasts (extends Media Items)
```sql
- id (UUID, Primary Key, Foreign Key to media_items)
- audio_url (Text, URL)
- is_video_episode (Boolean)
- episode_no (Integer)
- duration_sec (Integer)
- transcript_url (Text, URL)
```

### Views and Functions

#### Database Views
- `v_blogs_all`: Comprehensive blog content view
- `v_media_with_authors`: Media items with author information
- Various filtered and joined views for different content types

#### RPC Functions
- `create_media_item`: Media creation with validation
- `update_media_item`: Media updates with permission checks
- File cleanup and storage management functions

## Security Features

### Row Level Security (RLS)
- Table-level access control
- Role-based policy enforcement
- Development vs production policy configurations
- Authentication-based access validation

### Storage Security
- Bucket-based file organization
- Public vs private file access
- Signed URL generation for secure access
- File upload validation and sanitization

## UI/UX Specifications

### Design System
- **Color Scheme**: Professional blue/gray palette
- **Typography**: Clean, modern sans-serif fonts
- **Icons**: Lucide React icon library
- **Layout**: Responsive grid-based design
- **Components**: Consistent design patterns

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Collapsible sidebar navigation
- Adaptive grid layouts
- Touch-friendly interfaces

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast support

## Performance Considerations

### Optimization Strategies
- Lazy loading for large datasets
- Image optimization and CDN usage
- Efficient database queries with proper indexing
- Component memoization where appropriate
- Debounced search and filtering

### Caching
- Browser caching for static assets
- API response caching
- Database query result caching
- Image thumbnail caching

## Integration Points

### External Services
- **Supabase**: Backend-as-a-Service
- **Storage**: File upload and management
- **Authentication**: User management and security
- **AI Services**: CV screening and content analysis

### API Architecture
- RESTful API design
- Consistent error handling
- Request/response validation
- Rate limiting considerations

## Development Workflow

### Database Setup
1. Run schema creation scripts
2. Configure RLS policies
3. Set up storage buckets
4. Create necessary views and functions
5. Test authentication flows

### Development Mode Features
- Debug panels for troubleshooting
- Permissive RLS policies for testing
- Enhanced error logging
- Development-specific UI components

### Production Deployment
- Secure RLS policies
- Environment-specific configurations
- Performance monitoring
- Error tracking and reporting

## Future Enhancements

### Planned Features
- Advanced analytics dashboard
- Workflow automation
- Integration with external HR systems
- Enhanced content recommendation engine
- Multi-language support
- Advanced user permissions

### Scalability Considerations
- Horizontal scaling capabilities
- Database optimization strategies
- CDN integration for global performance
- Load balancing considerations

## Maintenance and Support

### Monitoring
- Application performance monitoring
- Database performance metrics
- User activity tracking
- Error rate monitoring

### Backup and Recovery
- Automated database backups
- File storage redundancy
- Disaster recovery procedures
- Data export capabilities

---

*This specification document covers the current state of the Admin UI system as of the analysis date. Features and implementations may evolve based on business requirements and technical considerations.*
