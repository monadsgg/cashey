## Cashey

Cashey is a **full-stack personal finance web application** that helps track income, expenses, budgets, and investment contributions in one platform.

### Why I Built It

---

I’ve been tracking our finances in spreadsheets for years, but I wanted a tool that could automate entries, provide real-time analytics, and help answer questions like:

- _How much did we save this month?_
- _Can we afford a steak for dinner?_
- _How much more can we contribute to our TFSA, FHSA, or RRSP?_

Cashey combines my passion for personal finance with my skills in full-stack development, turning raw data into actionable insights.

### Tech Stack

---

- **Frontend**: React, TypeScript, MUI (Material UI), React Query
- **Backend**: Node.js, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **HTTP Client**: Axios

### Key Features

---

- **Transactions**

  - Create, edit, and delete transactions
  - Transfer funds between wallets
  - Paginated transaction list (10 per page)
  - Import transactions from CSV
  - Table settings to hide rarely used columns (e.g., payee, tags)

- **Accounts**

  - Manage personal savings and investment accounts
  - Track contributions to TFSA, FHSA, and RRSP

- **Budgets**

  - Set monthly budgets per category
  - Compare actual spending vs. planned budget

- **Categories / Tags / Payees**
  - Built-in global categories plus custom categories
  - Create tags and payees directly from the transaction form
  - Use categories, tags, and payees for filtering and analysis

### Cashey File structure

---

```
cashey/
├── client/                          # Frontend (React, TypeScript)
│   ├── package.json
│   ├── tsconfig.json
│   ├── public/
│   │   └── ...
│   └── src/
│       ├── index.tsx
│       ├── App.tsx
│       ├── assets/                  # Static assets (icons, images, svgs)
│       │   ├── charts-illustration.svg
│       │   └── ...
│       ├── components/              # Reusable UI components
│       │   ├── FormDialog.tsx
│       │   ├── TextInputField.tsx
│       │   ├── CSVFileUploader.tsx
│       │   └── ...
│       ├── constants/
│       │   ├── index.ts
│       ├── hooks/
│       │   ├── transactions/
│       │   │   ├── useTransactions.ts
│       │   │   ├── useAddTransaction.ts
│       │   │   └── ...
│       │   ├── budgets/
│       │   │   └── ...
│       │   └── ...
│       ├── pages/
│       │   ├── transactions/
│       │   │   ├── TransactionPage.tsx
│       │   │   ├── TransactionTable.tsx
│       │   │   ├── TransactionForm.tsx
│       │   │   └── ...
│       │   └── ...
│       ├── services/
│       │   ├── api.ts
│       │   ├── transactions.ts
│       │   └── ...
│       ├── styles/
│       │   ├── Theme.tsx
│       ├── utils/
│       │   ├── date.ts
│       │   ├── currency.ts
│       │   └── ...
│
├── server/                          # Backend (Node/Express, TypeScript + Prisma)
│   ├── package.json
│   ├── tsconfig.json
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
