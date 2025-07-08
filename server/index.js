import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// Database setup
const db = new sqlite3.Database('./database.db');

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      department TEXT,
      position TEXT,
      salary REAL,
      hire_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Reports table
  db.run(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      report_type TEXT NOT NULL,
      generated_by TEXT,
      file_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert sample data
  db.run(`
    INSERT OR IGNORE INTO users (name, email, phone, department, position, salary, hire_date) VALUES
    ('John Doe', 'john.doe@company.com', '+1-555-0101', 'Engineering', 'Senior Developer', 85000, '2022-01-15'),
    ('Jane Smith', 'jane.smith@company.com', '+1-555-0102', 'Marketing', 'Marketing Manager', 75000, '2021-06-20'),
    ('Mike Johnson', 'mike.johnson@company.com', '+1-555-0103', 'Sales', 'Sales Representative', 65000, '2023-03-10'),
    ('Sarah Wilson', 'sarah.wilson@company.com', '+1-555-0104', 'HR', 'HR Specialist', 60000, '2022-08-05'),
    ('David Brown', 'david.brown@company.com', '+1-555-0105', 'Finance', 'Financial Analyst', 70000, '2021-11-12')
  `);
});

// API Routes

// Get all users
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(row);
  });
});

// Create new user
app.post('/api/users', (req, res) => {
  const { name, email, phone, department, position, salary, hire_date } = req.body;
  
  db.run(
    'INSERT INTO users (name, email, phone, department, position, salary, hire_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, email, phone, department, position, salary, hire_date],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'User created successfully' });
    }
  );
});

// Generate PDF report
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { reportType, userIds, title, description } = req.body;
    
    let users = [];
    
    if (userIds && userIds.length > 0) {
      // Get specific users
      const placeholders = userIds.map(() => '?').join(',');
      users = await new Promise((resolve, reject) => {
        db.all(`SELECT * FROM users WHERE id IN (${placeholders})`, userIds, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    } else {
      // Get all users
      users = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM users ORDER BY name', (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    }

    // Generate HTML from template
    const html = await generateHTML(reportType, users, { title, description });
    
    // Generate PDF
    const filename = `report_${uuidv4()}.pdf`;
    const filepath = path.join(__dirname, 'downloads', filename);
    
    // Ensure downloads directory exists
    await fs.mkdir(path.join(__dirname, 'downloads'), { recursive: true });
    
    await generatePDF(html, filepath);
    
    // Save report record to database
    db.run(
      'INSERT INTO reports (title, description, report_type, generated_by, file_path) VALUES (?, ?, ?, ?, ?)',
      [title || `${reportType} Report`, description || '', reportType, 'System', filename]
    );
    
    res.json({
      success: true,
      filename,
      downloadUrl: `/downloads/${filename}`,
      message: 'PDF generated successfully'
    });
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Get all reports
app.get('/api/reports', (req, res) => {
  db.all('SELECT * FROM reports ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// HTML Template Generation
async function generateHTML(reportType, users, options = {}) {
  const templatePath = path.join(__dirname, 'templates', `${reportType}.hbs`);
  
  try {
    const templateContent = await fs.readFile(templatePath, 'utf8');
    const template = handlebars.compile(templateContent);
    
    const data = {
      title: options.title || `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
      description: options.description || '',
      users,
      generatedDate: new Date().toLocaleDateString(),
      generatedTime: new Date().toLocaleTimeString(),
      totalUsers: users.length,
      ...options
    };
    
    return template(data);
  } catch (error) {
    console.error('Error reading template:', error);
    // Fallback to default template
    return generateDefaultTemplate(reportType, users, options);
  }
}

// Default template generator
function generateDefaultTemplate(reportType, users, options = {}) {
  const template = handlebars.compile(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>{{title}}</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }
            .watermark {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 120px;
                color: rgba(0, 0, 0, 0.05);
                z-index: -1;
                font-weight: bold;
                pointer-events: none;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                position: relative;
            }
            .header {
                text-align: center;
                margin-bottom: 40px;
                border-bottom: 3px solid #667eea;
                padding-bottom: 20px;
            }
            .header h1 {
                color: #333;
                margin: 0;
                font-size: 28px;
                font-weight: bold;
            }
            .header p {
                color: #666;
                margin: 10px 0 0 0;
                font-size: 14px;
            }
            .meta-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 30px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 5px;
                border-left: 4px solid #667eea;
            }
            .meta-info div {
                text-align: center;
            }
            .meta-info strong {
                display: block;
                color: #333;
                font-size: 16px;
            }
            .meta-info span {
                color: #666;
                font-size: 12px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
                font-size: 12px;
            }
            th, td {
                padding: 12px 8px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
            th {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                font-weight: bold;
                text-transform: uppercase;
                font-size: 11px;
                letter-spacing: 0.5px;
            }
            tr:nth-child(even) {
                background-color: #f8f9fa;
            }
            tr:hover {
                background-color: #e3f2fd;
            }
            .footer {
                margin-top: 40px;
                text-align: center;
                color: #666;
                font-size: 12px;
                border-top: 1px solid #ddd;
                padding-top: 20px;
            }
            .summary {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            .summary-card {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
            }
            .summary-card h3 {
                margin: 0 0 10px 0;
                font-size: 24px;
            }
            .summary-card p {
                margin: 0;
                opacity: 0.9;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="watermark">CONFIDENTIAL</div>
        <div class="container">
            <div class="header">
                <h1>{{title}}</h1>
                {{#if description}}
                <p>{{description}}</p>
                {{/if}}
            </div>
            
            <div class="meta-info">
                <div>
                    <strong>{{generatedDate}}</strong>
                    <span>Generated Date</span>
                </div>
                <div>
                    <strong>{{generatedTime}}</strong>
                    <span>Generated Time</span>
                </div>
                <div>
                    <strong>{{totalUsers}}</strong>
                    <span>Total Records</span>
                </div>
            </div>

            {{#if users}}
            <div class="summary">
                <div class="summary-card">
                    <h3>{{totalUsers}}</h3>
                    <p>Total Employees</p>
                </div>
                <div class="summary-card">
                    <h3>{{avgSalary}}</h3>
                    <p>Average Salary</p>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Position</th>
                        <th>Salary</th>
                        <th>Hire Date</th>
                    </tr>
                </thead>
                <tbody>
                    {{#each users}}
                    <tr>
                        <td>{{id}}</td>
                        <td>{{name}}</td>
                        <td>{{email}}</td>
                        <td>{{department}}</td>
                        <td>{{position}}</td>
                        <td>${{salary}}</td>
                        <td>{{hire_date}}</td>
                    </tr>
                    {{/each}}
                </tbody>
            </table>
            {{/if}}

            <div class="footer">
                <p>This report was automatically generated by the PDF Generator System</p>
                <p>© 2024 Company Name. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `);

  const avgSalary = users.length > 0 
    ? '$' + Math.round(users.reduce((sum, user) => sum + (user.salary || 0), 0) / users.length).toLocaleString()
    : '$0';

  return template({
    title: options.title || `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
    description: options.description || '',
    users,
    generatedDate: new Date().toLocaleDateString(),
    generatedTime: new Date().toLocaleTimeString(),
    totalUsers: users.length,
    avgSalary
  });
}

// PDF Generation
async function generatePDF(html, outputPath) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });
  } finally {
    await browser.close();
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});