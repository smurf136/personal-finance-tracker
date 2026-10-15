# Project: Personal Finance Tracker

You are a senior full-stack engineer and UI/UX designer.

Build a complete, production-quality personal income and expense tracking web application from scratch.

The application is intended for **a single personal user**, not a commercial SaaS product.

Focus on simplicity, reliability, maintainability, and excellent mobile usability.

Do not overengineer the application.

## 1. Technology Stack

### Frontend
- Next.js with App Router
- TypeScript (strict mode)
- Ant Design v6
- @ant-design/icons
- @ant-design/charts
- CSS Modules for additional styling
- Ant Design ConfigProvider for theming
- Ant Design Next.js registry integration when compatible

### Backend
- Next.js Server Actions and Route Handlers
- Prisma ORM
- SQLite database
- Zod for server-side validation

### Deployment
- Docker
- Docker Compose
- Persistent SQLite storage

Use compatible stable package versions. Verify compatibility before installation.

Do not use Tailwind CSS, shadcn/ui, Mantine, MUI, Firebase, Supabase, or unnecessary external services.

## 2. Core Principles

1. Single-user application.
2. No registration or multi-user management.
3. Mobile-first responsive design.
4. Minimal steps to record transactions.
5. All financial data must persist reliably.
6. No unnecessary dependencies.
7. No complex accounting features.
8. Keep the application easy to understand and maintain.
9. Prefer Ant Design components over custom implementations.
10. All UI text must be in Thai.

## 3. Main Features

### 3.1 Dashboard

Create a clean financial overview with:

- Total income for the selected month
- Total expenses for the selected month
- Net balance (income minus expenses)
- Recent transactions
- Expense distribution by category
- Monthly income vs. expense comparison
- Month and year selector

Use Ant Design Card, Statistic, DatePicker, Flex, and Charts.

All displayed values must be calculated from actual database records.

Do not hardcode financial statistics.

Default to the current month.

The monthly net balance represents income minus expenses within the selected month, not the user's actual bank account balance.

### 3.2 Transaction Management

Support full CRUD operations:

- Create transactions
- View transactions
- Edit transactions
- Delete transactions with confirmation
- Filter transactions by type, category, and date range
- Sort by transaction date
- Search by transaction note

Each transaction must contain:

- id
- type: INCOME or EXPENSE
- amountSatang: integer
- categoryId
- date
- note (optional)
- createdAt
- updatedAt

Rules:
- Amount must be greater than zero.
- Store money as integer satang.
- Display money in Thai Baht.
- Default date to today.
- Notes are optional.
- Validate all input on the server.
- Prevent invalid transaction types or category combinations.
- Use database transactions where appropriate.

### 3.3 Quick Add Transaction

This is the most important interaction in the application.

Provide a prominent floating "+" button.

On mobile:
- Open an Ant Design Drawer from the bottom.
- Automatically focus the amount field when practical.
- Display a large numeric amount input.
- Switch between income and expense using Segmented.
- Show relevant categories.
- Default to today's date.
- Remember the last selected category locally.
- Provide an optional note field.
- Display a clear Save button.

On desktop:
- Use a compact Modal or Drawer.

After saving:
- Close the form.
- Display a success notification.
- Refresh dashboard and transaction history.
- Preserve the selected month where appropriate.

Minimize the number of interactions needed to save a transaction.

### 3.4 Categories

Provide default categories.

Expense categories:
- อาหารและเครื่องดื่ม
- เดินทาง
- ช้อปปิ้ง
- บิลและสาธารณูปโภค
- ความบันเทิง
- ท่องเที่ยว
- สุขภาพ
- อื่น ๆ

Income categories:
- เงินเดือน
- งานเสริม
- การลงทุน
- อื่น ๆ

Allow users to:
- Add categories
- Rename categories
- Change category icons
- Archive categories

Do not permanently delete categories that are referenced by existing transactions.

Archived categories must remain visible in historical records but must not appear as choices for new transactions.

### 3.5 Transaction History

Desktop:
- Use Ant Design Table.
- Support pagination, sorting, and filters.

Mobile:
- Use Ant Design List or Card.
- Group transactions by date.
- Display category icon, category name, note, and amount.
- Use green for income and red for expenses.
- Allow editing and deleting transactions.
- Show daily totals when useful.

Ensure the mobile layout never requires horizontal scrolling to read essential transaction information.

### 3.6 Charts and Statistics

Use @ant-design/charts.

Include:
1. Donut chart showing expenses by category.
2. Column chart comparing monthly income and expenses over the last six months.

Requirements:
- Charts must use actual transaction data.
- Support empty states.
- Format tooltips in THB.
- Use responsive dimensions.
- Keep labels readable on mobile.
- Avoid unnecessary animations.

### 3.7 Data Export and Backup

Implement:
- Export transactions to CSV.
- Import transactions from CSV.
- Full database backup.
- Restore from backup.

CSV requirements:
- UTF-8 BOM for compatibility with Excel.
- Thai text support.
- Proper date and currency handling.
- Validate imported records.
- Detect duplicate imports using stable identifiers.
- Display import results, including skipped and invalid rows.
- Prevent spreadsheet formula injection in exported text fields.

Backup requirements:
- Use a portable, versioned backup format containing transactions and categories.
- Validate backup format and version before restoring.
- Require explicit confirmation before replacing existing data.
- Restore atomically to avoid partially imported data.
- Never silently overwrite existing data.

## 4. UI / UX Design

### Design Style
Modern, minimal, calm personal finance dashboard.

Use:
- Soft neutral backgrounds
- White or dark cards depending on theme
- Rounded corners
- Clear typography
- Consistent spacing
- Subtle borders
- Minimal shadows
- Simple category icons
- Green for income
- Red for expenses

Avoid overly colorful enterprise dashboard styling.

### Theme
Implement:
- Light mode
- Dark mode
- System theme preference

Use Ant Design ConfigProvider and theme tokens.

Persist the selected theme locally.

### Navigation

Desktop:
- Ant Design Layout with Sider or Header navigation.

Mobile:
- Fixed bottom navigation with:
  1. ภาพรวม
  2. รายการ
  3. หมวดหมู่
  4. ตั้งค่า

Provide a floating Add Transaction button that remains easy to access.

### Localization
- Thai language throughout the interface.
- Currency: THB (฿).
- Use Intl.NumberFormat for monetary display.
- Use Asia/Bangkok as the application timezone.
- Use consistent Thai-friendly date formatting.
- Ensure transaction dates do not shift due to UTC conversion.
- Use Ant Design Thai locale where supported.

### Responsive Design
Support:
- iPhone Safari
- Mobile Chrome
- Tablets
- Desktop browsers

Respect iOS safe areas.

Ensure fixed navigation does not cover page content.

## 5. Database Design

Use Prisma with SQLite.

Create appropriate models for:

### Transaction
- id
- type
- amountSatang
- categoryId
- date
- note
- createdAt
- updatedAt

### Category
- id
- name
- type
- icon
- isArchived
- createdAt
- updatedAt

Use stable identifiers and relational integrity.

Add indexes for common transaction queries:
- date
- type
- categoryId

Create migrations and seed default categories.

Do not insert fake financial transactions into the production database.

Development seed data may be provided separately.

## 6. Security

The application is single-user, but financial records are private.

For local development:
- Run on localhost by default.
- No account registration is needed.

For remote access:
- Recommend private access through Tailscale or an equivalent private network.
- Do not expose an unauthenticated application directly to the public internet.
- Document how to restrict access to authorized devices.
- Ensure write endpoints are not publicly accessible without protection.

Additional requirements:
- Validate all server inputs.
- Avoid exposing database files publicly.
- Protect against injection attacks.
- Do not expose sensitive data in logs.
- Keep secrets in environment variables.
- Never commit environment secrets or database files to Git.

Do not implement an unnecessary full authentication system.

## 7. Application Pages

Create the following routes:

### /
Dashboard
- Financial summary
- Charts
- Recent transactions

### /transactions
Transaction history
- Filters
- Search
- Add/edit/delete

### /categories
Category management
- Add
- Rename
- Change icon
- Archive

### /settings
Application settings
- Theme selection
- CSV import/export
- Backup/restore
- Data management

## 8. Project Structure

Use a clean, maintainable structure.

Suggested organization:

- app/
- components/
- features/
- lib/
- prisma/
- public/
- styles/
- tests/

Separate:
- UI components
- Database access
- Business logic
- Validation schemas
- Formatting utilities

Avoid excessive abstraction, generic repositories, or unnecessary architectural layers.

## 9. Docker and Persistence

Provide:
- Dockerfile
- docker-compose.yml
- .env.example
- README.md

Requirements:
- Use persistent volumes for SQLite.
- Database must survive container restarts and recreation.
- Run database migrations during deployment in a safe, documented way.
- Do not reset or reseed financial data on every startup.
- Document backup and restore procedures.
- Ensure SQLite storage is suitable for the selected deployment environment.

The app should also run locally without Docker.

## 10. Quality Requirements

Implement:
- Loading states
- Empty states
- Error states
- Form validation feedback
- Delete confirmations
- Accessible labels
- Keyboard navigation
- Mobile touch-friendly controls

Include tests for:
- Income and expense calculations
- Monthly filtering
- Currency conversion
- Transaction validation
- Category validation
- Transaction CRUD
- CSV import validation
- Backup restore integrity

Avoid unnecessary testing frameworks or excessive test coverage.
