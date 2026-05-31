# API Reference — Asset Tracker Frontend

> **Base URL:** Configured via `VITE_API_URL` environment variable  
> **Default:** `https://asset-tracker-backend-production.up.railway.app/api`

All endpoints (except Auth) require the header:

```
Authorization: Bearer <jwt_token>
```

The frontend automatically attaches this header via an Axios request interceptor.  
A **401 response** on any endpoint triggers automatic logout and redirect to `/login`.

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Dashboard](#2-dashboard)
3. [Assets](#3-assets)
4. [Expenses](#4-expenses)

---

## 1. Authentication

### 1.1 Register

| | |
|---|---|
| **Endpoint** | `POST /auth/register` |
| **Auth** | None |
| **Source** | `src/api/authApi.js → registerUser()` |
| **Used by** | `SignUpPage.jsx` |

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Expected Response** (`200 OK`):

```json
{
  "message": "User registered successfully"
}
```

> The frontend does not auto-login after registration. It redirects to `/login` with a success banner.

---

### 1.2 Login

| | |
|---|---|
| **Endpoint** | `POST /auth/login` |
| **Auth** | None |
| **Source** | `src/api/authApi.js → loginUser()` |
| **Used by** | `LoginPage.jsx` via `AuthContext.login()` |

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Expected Response** (`200 OK`):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

> The frontend accepts either `token` or `accessToken` as the JWT field name.  
> The `user` object is optional — if present, it is stored in `localStorage` and used for avatar initials.  
> The JWT `exp` claim is decoded client-side to detect token expiry.

**Error Response** (`401`):

```json
{
  "message": "Invalid email or password"
}
```

---

## 2. Dashboard

### 2.1 Get Dashboard Summary

| | |
|---|---|
| **Endpoint** | `GET /dashboard/summary?year={year}&month={month}` |
| **Auth** | Required |
| **Source** | `src/api/dashboardApi.js → fetchDashboardSummary()` |
| **Used by** | `DashboardPage.jsx` via `useDashboard()` |

**Query Parameters:**

| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `year` | number | `2026` | Calendar year |
| `month` | number | `5` | Month (1–12) |

**Expected Response** (`200 OK`):

```json
{
  "totalPortfolioValue": 23540,
  "monthlyExpenses": 97.50,
  "assetAllocation": {
    "Crypto": 12000,
    "Stocks": 8500,
    "Gold": 3040
  },
  "expenseByCategory": {
    "Food": 40.50,
    "Transport": 12.00,
    "Subscriptions": 45.00
  }
}
```

---

## 3. Assets

### 3.1 List All Assets

| | |
|---|---|
| **Endpoint** | `GET /assets` |
| **Auth** | Required |
| **Source** | `src/api/assetApi.js → fetchAssets()` |
| **Used by** | `PortfolioPage.jsx` via `usePortfolio()` |

**Expected Response** (`200 OK`):

```json
[
  {
    "id": 1,
    "name": "Bitcoin",
    "type": "CRYPTO",
    "quantity": 0.45,
    "currentValue": 12000
  },
  {
    "id": 2,
    "name": "Apple",
    "type": "STOCK",
    "quantity": 10,
    "currentValue": 8500
  }
]
```

---

### 3.2 Create Asset

| | |
|---|---|
| **Endpoint** | `POST /assets` |
| **Auth** | Required |
| **Source** | `src/api/assetApi.js → createAsset()` |
| **Used by** | `PortfolioPage.jsx` via `AddAssetDialog` |

**Request Body:**

```json
{
  "name": "Gold Bar",
  "type": "GOLD",
  "quantity": 2,
  "currentValue": 3040
}
```

**Asset Types used by the frontend:** `CRYPTO`, `STOCK`, `GOLD`

**Expected Response** (`201 Created`):

```json
{
  "id": 3,
  "name": "Gold Bar",
  "type": "GOLD",
  "quantity": 2,
  "currentValue": 3040
}
```

---

### 3.3 Delete Asset

| | |
|---|---|
| **Endpoint** | `DELETE /assets/{id}` |
| **Auth** | Required |
| **Source** | `src/api/assetApi.js → deleteAsset()` |
| **Used by** | `PortfolioPage.jsx` via table delete button |

**Path Parameters:**

| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `id` | number | `3` | Asset ID to delete |

**Expected Response** (`200 OK` or `204 No Content`)

---

## 4. Expenses

### 4.1 List All Expenses

| | |
|---|---|
| **Endpoint** | `GET /expenses` |
| **Auth** | Required |
| **Source** | `src/api/expenseApi.js → fetchExpenses()` |
| **Used by** | `ExpensesPage.jsx` via `useExpenses()` |

**Expected Response** (`200 OK`):

```json
[
  {
    "id": 1,
    "date": "2026-05-10",
    "category": "Food",
    "description": "Lunch",
    "amount": 18.50
  },
  {
    "id": 2,
    "date": "2026-05-11",
    "category": "Transport",
    "description": "Grab ride",
    "amount": 12.00
  }
]
```

---

### 4.2 Create Expense

| | |
|---|---|
| **Endpoint** | `POST /expenses` |
| **Auth** | Required |
| **Source** | `src/api/expenseApi.js → createExpense()` |
| **Used by** | `ExpensesPage.jsx` via `AddExpenseDialog` |

**Request Body:**

```json
{
  "date": "2026-05-15",
  "category": "Subscriptions",
  "description": "Netflix",
  "amount": 45.00
}
```

**Categories used by the frontend:** `Food`, `Transport`, `Subscriptions`, `Housing`, `Utilities`

**Expected Response** (`201 Created`):

```json
{
  "id": 5,
  "date": "2026-05-15",
  "category": "Subscriptions",
  "description": "Netflix",
  "amount": 45.00
}
```

---

### 4.3 Delete Expense

| | |
|---|---|
| **Endpoint** | `DELETE /expenses/{id}` |
| **Auth** | Required |
| **Source** | `src/api/expenseApi.js → deleteExpense()` |
| **Used by** | `ExpensesPage.jsx` via table delete button |

**Path Parameters:**

| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `id` | number | `5` | Expense ID to delete |

**Expected Response** (`200 OK` or `204 No Content`)

---

## Error Handling

All endpoints may return errors in this format:

```json
{
  "message": "Human-readable error description"
}
```

The frontend displays `response.data.message` in error alerts/snackbars. If the field is missing, a generic fallback message is shown.

| HTTP Status | Frontend Behavior |
|-------------|-------------------|
| `401` | Clears token, redirects to `/login` |
| `4xx` / `5xx` | Shows error message in alert or snackbar |

