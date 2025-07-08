# PDF Generator Application

A full-stack application that generates PDF reports from database records using customizable HTML templates with watermarks and professional styling.

## Features

- **Database Integration**: SQLite database with user management
- **API Interface**: RESTful API for data access and PDF generation
- **Template System**: Handlebars templates for customizable PDF layouts
- **Watermark Support**: Automatic watermark application to generated PDFs
- **Professional Styling**: Beautiful, responsive HTML templates
- **User Management**: Add, view, and manage user records
- **Report History**: Track all generated reports
- **Download System**: Direct PDF download functionality

## Technology Stack

### Backend
- **Node.js** with Express.js
- **SQLite3** for database
- **Puppeteer** for PDF generation
- **Handlebars** for templating
- **CORS** for cross-origin requests

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Lucide React** for icons
- **Vite** for development

## Installation & Setup

1. **Install dependencies**:
```bash
npm run setup
```

2. **Start the application**:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend development server on `http://localhost:3000`

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user

### Reports
- `GET /api/reports` - Get all generated reports
- `POST /api/generate-pdf` - Generate new PDF report

### Downloads
- `GET /downloads/:filename` - Download generated PDF files

## PDF Generation

The application supports multiple report types:

### 1. Employee Report
- Comprehensive employee directory
- Department analysis
- Salary statistics
- Professional layout with company branding

### 2. Summary Report
- Executive summary format
- Key metrics and analytics
- Department distribution
- Salary range analysis

## Template System

Templates are stored in `server/templates/` and use Handlebars syntax:

- `employee.hbs` - Detailed employee report template
- `summary.hbs` - Executive summary template

### Template Features
- **Watermarks**: Automatic "CONFIDENTIAL" or custom watermarks
- **Professional Styling**: Gradient backgrounds, modern typography
- **Responsive Design**: Optimized for PDF generation
- **Data Visualization**: Charts and statistics
- **Company Branding**: Customizable headers and footers

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  department TEXT,
  position TEXT,
  salary REAL,
  hire_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Reports Table
```sql
CREATE TABLE reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  report_type TEXT NOT NULL,
  generated_by TEXT,
  file_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Usage

1. **Manage Users**: Add, view, and organize user records
2. **Generate Reports**: Select report type, customize title/description
3. **User Selection**: Choose specific users or include all
4. **Download PDFs**: Automatically download generated reports
5. **Report History**: View and re-download previous reports

## Customization

### Adding New Templates
1. Create new `.hbs` file in `server/templates/`
2. Add template option to frontend
3. Update API to handle new report type

### Styling Modifications
- Edit template CSS in `.hbs` files
- Modify Tailwind classes in React components
- Update gradient colors and branding

### Database Extensions
- Add new fields to user schema
- Create additional tables as needed
- Update API endpoints accordingly

## Production Deployment

1. **Build the application**:
```bash
npm run build
```

2. **Start production server**:
```bash
npm start
```

3. **Environment Variables**:
```bash
NODE_ENV=production
PORT=3001
```

## Security Considerations

- Input validation on all API endpoints
- SQL injection prevention with parameterized queries
- File access restrictions for downloads
- CORS configuration for production

## Performance Optimization

- PDF generation is asynchronous
- Database indexing on frequently queried fields
- Static file serving for downloads
- Puppeteer optimization for faster PDF generation

## Troubleshooting

### Common Issues
1. **Puppeteer Installation**: Ensure Chrome/Chromium is available
2. **File Permissions**: Check write permissions for downloads directory
3. **Port Conflicts**: Modify ports in configuration if needed
4. **Database Locks**: Ensure proper connection handling

### Debug Mode
Set `NODE_ENV=development` for detailed error logging.

## License

This project is licensed under the MIT License.