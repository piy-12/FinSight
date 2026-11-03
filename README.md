# 💰 FinSight – Smart Expense Tracker

**FinSight** is an AI-powered smart expense tracking application designed to simplify personal finance management. It allows users to manage their daily expenses, automatically extract transaction details from receipts using OCR, and receive intelligent financial insights through LLM-powered analysis.

The application combines traditional expense management with AI capabilities to help users understand their spending patterns, monitor expenses, and make better financial decisions.

## 🚀 Key Features

### 1. Expense Management (CRUD Operations)

* Create, read, update, and delete expenses.
* Maintain a structured record of daily transactions.
* Organize expenses by categories.
* Track spending history and monitor financial activities.
* Manage individual expense details.

### 2. 📸 AI-Powered Receipt Scanning (OCR)

* Automatically extract information from uploaded receipts.
* Implemented OCR to read receipt details and identify relevant transaction information.
* Extracted information is used to pre-fill the expense creation form.
* Reduces manual data entry and simplifies expense tracking.
* Users can review and edit extracted information before saving.

### 3. 🤖 LLM-Powered Financial Insights

* Integrated Large Language Models (LLMs) to evaluate monthly spending patterns.
* Analyze expenses accumulated throughout the month.
* Generate intelligent financial summaries and spending insights.
* Identify major spending categories and potential areas of overspending.
* Provide personalized suggestions to improve financial management.
* Help users understand their financial habits through AI-generated recommendations.

### 4. 📊 Expense Analytics

* Monitor monthly expenditure.
* Understand spending distribution across different categories.
* Review transaction history.
* Use AI-generated evaluations to gain a better understanding of financial behavior.

## 🛠️ Tech Stack

| Category       | Technologies                        |
| -------------- | ----------------------------------- |
| Frontend       | React Native                        |
| Backend        | Node.js, Express.js                 |
| Database       | PostgreSQL                          |
| ORM            | Prisma                              |
| AI Integration | Large Language Models (LLMs)        |
| OCR            | Optical Character Recognition (OCR) |

## 🏗️ Application Workflow

**Receipt Scanning Workflow**

1. User uploads or scans a receipt.
2. OCR processes the receipt image.
3. Relevant transaction information is extracted.
4. Extracted information automatically populates the expense creation form.
5. User reviews the information and saves the expense.
6. Expense details are stored in PostgreSQL.

**Monthly AI Analysis Workflow**

1. The application collects expenses recorded throughout the month.
2. Expense data is organized and processed.
3. Structured financial information is provided to the LLM.
4. The LLM evaluates monthly spending patterns.
5. AI generates financial summaries, observations, and suggestions.
6. Users receive actionable recommendations to improve their spending habits.

## 📁 Project Structure

```text
FinSight/
│
├── frontend/          # React Native application
│
├── backend/           # Node.js and Express.js backend
│   ├── controllers/   # Request handling and business logic
│   ├── routes/        # API routes
│   ├── services/      # OCR and LLM integrations
│   ├── middleware/    # Authentication and validation
│   └── prisma/        # Database schema and migrations
│
└── README.md
```

*Note: Adjust the folder structure according to your actual implementation.*

## 🎯 Project Objectives

* Simplify everyday expense tracking.
* Minimize manual data entry through OCR automation.
* Leverage LLMs for intelligent financial analysis.
* Help users identify unnecessary spending.
* Transform raw transaction records into meaningful financial insights.

## 🔮 Future Enhancements

* Monthly and weekly budget management.
* Expense forecasting using machine learning.
* Recurring expense detection.
* Smart spending alerts.
* Advanced financial dashboards.
* Exportable monthly financial reports.

---

**FinSight – Track Smarter. Spend Better.**
