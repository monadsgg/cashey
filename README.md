# Cashey

Cashey is a **full-stack personal finance web application** that helps track income, expenses, budgets, and investment contributions in one platform.

## Why I Built It

I’ve been tracking our finances in spreadsheets for years, but I wanted a tool that could automate entries, provide real-time analytics, and help answer questions like:

- _How much did we save this month?_
- _Can we afford a steak for dinner?_
- _How much more can we contribute to our TFSA, FHSA, or RRSP?_

Cashey combines my passion for personal finance with my skills in full-stack development, turning raw data into actionable insights.

## Tech Stack

- **Frontend**: React, TypeScript, MUI (Material UI), React Query, Zod (form & data validation)
- **Backend**: Node.js, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **HTTP Client**: Axios

## Key Features

### 🚧 Version 1 - Core Features

- **Transaction Management**

  - ✅ Create, edit, and delete transactions
  - ✅ Paginated transaction list (10 per page)
  - ✅ Import transactions from CSV
  - ✅ Table settings to hide rarely used columns (e.g., payee, tags)
  - ✅ Search feature and filter by field (e.g., payee, category, tag, amount)
  - ✅ Refund handling

- **Transfer Funds Management**

  - ✅ Transfer funds between wallets

- **Data Import**

  - ✅ CSV transaction import

- **Accounts Management**

  - ✅ Manage personal savings and investment accounts
    - ✅ Create, edit, and delete accounts
  - ✅ Track savings and contributions to TFSA, FHSA, and RRSP
  - ✅ Account monthly transactions list

- **Budget Management**

  - Set monthly budgets per category
  - Compare actual spending vs. planned budget
  - Copy budget between months

- **Categories / Tags / Payees**

  - Built-in global categories plus custom categories
  - Create tags and payees directly from the transaction form
  - Use categories, tags, and payees for filtering and analysis

- **Dashboard**

  - Spending by category chart and financial overview

### 🚀 Version 2 - Recurring Transactions, Data Export and Unit Testing

- **Recurring Transactions**

  - Schedule recurring expenses and savings (e.g., rent, guilt-free funds)
  - Customize frequency (monthly, bi-monthly, yearly)
  - Automatically generate transactions based on recurrence rules
  - Manage and pause recurring items when needed

- **Data Export**

  - Export transactions, and account summaries to CSV or Excel
  - Filter and export specific date ranges or categories
  - Include column preferences from table settings in export

- **Unit Testing**
  - Add unit testing for key components

### 📊 Version 3 - Advanced Analytics

- **Analytics Dashboard**

  - Charts for spending trends and income distribution
  - Track savings growth over time
  - Monthly and yearly financial summaries

- **Category and Tag Insights**

  - Visualize top spending categories and payees
  - Tag-based analysis for better tracking of lifestyle expenses

## Cashey File structure

```
cashey/
├── client/                          # Frontend (React, TypeScript)
│   └── src/
│       ├── index.tsx
│       ├── App.tsx
│       ├── assets/                  # Static assets (icons, images, svgs)
│       │   ├── charts-illustration.svg
│       │   └── ...
│       ├── components/              # Reusable UI components
│       │   ├── FormDialog.tsx
│       │   ├── CSVFileUploader.tsx
│       │   └── ...
│       ├── constants/
│       │   ├── index.ts
│       ├── hooks/
│       │   ├── transactions/
│       │   │   ├── useTransactions.ts
│       │   │   └── ...
│       │   ├── budgets/
│       │   │   └── ...
│       │   └── ...
│       ├── pages/
│       │   ├── transactions/
│       │   │   ├── TransactionPage.tsx
│       │   │   └── ...
│       │   └── ...
│       ├── services/
│       │   ├── api.ts
│       │   └── ...
│       ├── styles/
│       │   ├── Theme.tsx
│       ├── utils/
│       │   ├── date.ts
│       │   ├── currency.ts
│       │   └── ...
│
├── server/                          # Backend (Node/Express, TypeScript + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── ...
│   └── src/
│       ├── index.ts                 # App entrypoint
│       ├── routes/
│       │   ├── transactions.ts
│       │   └── ...
│       ├── controllers/
│       │   ├── transaction.controller.ts
│       │   └── ...
│       ├── services/
│       │   ├── transaction.service.ts
│       │   └── ...
│       ├── middleware/
│       │   ├── auth.middleware.ts
│       │   └── ...
│       ├── utils/
│       │   ├── db.ts
│       │   └── ...
│
├── LICENSE
└── README.md
```
