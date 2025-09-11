# Career Portal Application

A Next.js application for managing job applications and assignments.

## Pages

### Main Pages
- `/` - Home page 
- `/login` - Authentication page for admin users
- `/admin` - Admin dashboard
- `/view-applications` - Admin page to view and manage job applications
- `/admin/post-management` - Page for managing job postings
- `/admin/job/edit/[id]` - Edit specific job posting
- `/jobs/[id]` - View specific job details
- `/assignment/admin` - Admin page for managing assignments
- `/assignment/submit` - Page for candidates to submit assignments

### API Endpoints

#### Applications
- `GET /api/applications` - Fetch all job applications
- `DELETE /api/applications/[id]` - Delete specific application
- `DELETE /api/applications/bulk-delete` - Delete multiple applications
- `GET /api/check-applications` - Check application status

#### Jobs
- `GET /api/jobs` - Fetch all job postings
- `GET /api/jobs/[id]` - Get specific job details
- `DELETE /api/jobs/[id]` - Delete specific job
- `GET /api/jobs/[id]/views` - Get job posting view counts
- `GET /api/open-position` - Get open positions

#### Assignments
- `GET /api/assignments` - Fetch all assignments
- `GET /api/assignments/[id]` - Get specific assignment
- `DELETE /api/assignments/[id]` - Delete specific assignment
- `DELETE /api/assignments/bulk-delete` - Delete multiple assignments
- `POST /api/assignment-submit` - Submit assignment
- `GET /api/check-submission` - Check assignment submission status

## Key Features

### View Applications Page
- Authentication protected admin page
- View all job applications in a table format
- Sort applications by submission date
- View candidate resumes in-browser
- Delete individual applications
- Bulk delete multiple applications
- View candidate portfolios
- Track application submission time

### Resume Viewer Component
- In-browser PDF and document viewer
- Download resume functionality
- Error handling for failed loads
- Support for different file formats

### Authentication
- Email-based admin authentication
- Protected routes for admin users
- Firebase authentication integration

## Tech Stack
- Next.js 13+ (App Router)
- TypeScript
- Firebase Authentication
- MongoDB
- Tailwind CSS
- React Hot Toast

## Security
- Admin-only access to sensitive routes
- Authorized email whitelist
- Secure API endpoints
- Protected file access

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Firebase account

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/careerdezainahub.git

# Install dependencies
cd careerdezainahub
npm install

# Set up environment variables
cp .env.example .env.local
```

### Development
```bash
# Run the development server
npm run dev
```

### Production
```bash
# Build for production
npm run build

# Start production server
npm start
```

Contact the repository owner for access and deployment details.# dezainhub-career
