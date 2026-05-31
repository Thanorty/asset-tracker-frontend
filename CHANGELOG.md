# Changelog

All notable changes to the Asset Tracker Frontend are documented here.

## [1.1.0] - 2026-05-31

### Added

- **Sign-up page** (`/signup`)
  - Registration form with name, email, password, and confirm-password fields
  - Client-side validation (password match, minimum length)
  - Posts to `POST /auth/register` API endpoint
  - Redirects to login page with success banner after registration
  - Navigation links between login and sign-up pages
  - `registerUser` API function in `authApi.js`

## [1.0.0] - 2026-05-31

### Added

- **Authentication system**
  - Login page with email/password form, loading state, and error feedback
  - `AuthProvider` context with JWT token persistence in `localStorage`
  - `ProtectedRoute` guard — unauthenticated users are redirected to `/login`
  - Automatic token expiry detection by decoding JWT `exp` claim
  - 401 response interceptor that clears session and redirects to login
  - Logout button in the top bar

- **Notification system**
  - `NotificationProvider` with MUI `Snackbar` + `Alert` for success/error toasts
  - Success feedback after adding or deleting assets and expenses

- **Custom data hooks**
  - `useDashboard` — fetches dashboard summary using current year/month
  - `usePortfolio` — fetches, creates, and deletes assets
  - `useExpenses` — fetches, creates, and deletes expenses
  - All hooks use `useReducer` for clean state management and expose a `retry` function

- **Delete actions**
  - Delete button on every row in Portfolio and Expense tables
  - `deleteAsset` and `deleteExpense` API functions

- **Table enhancements**
  - Column sorting via `TableSortLabel` on all table columns
  - Pagination with configurable rows-per-page (5 / 10 / 25)

- **Responsive layout**
  - Sidebar switches to a temporary (overlay) drawer on mobile breakpoints
  - Hamburger menu icon in the top bar on small screens
  - Date chip hidden on extra-small screens

- **Testing infrastructure**
  - Vitest + `@testing-library/react` + `jsdom` configured
  - `npm run test` and `npm run test:watch` scripts
  - Unit tests for `SummaryCard` (3 tests)
  - Integration test for `ProtectedRoute` auth guard (2 tests)

- **Environment configuration**
  - `.env` file with `VITE_API_URL` for the backend base URL
  - `apiClient.js` reads from `import.meta.env.VITE_API_URL` with hardcoded fallback

- **PropTypes**
  - Added runtime prop validation to all major components:
    `Sidebar`, `Topbar`, `SummaryCard`, `PortfolioTable`, `ExpenseTable`,
    `AllocationPie`, `ExpensePie`, `AddAssetDialog`, `AddExpenseDialog`

- **Code splitting**
  - `React.lazy` + `Suspense` for `LoginPage`, `DashboardPage`, `PortfolioPage`, `ExpensesPage`
  - Build output split from 1 × 702 KB → 11 chunks (largest 408 KB)

### Changed

- **Dashboard page**
  - Uses current date instead of hardcoded `2026, 1`
  - Shows `CircularProgress` while loading and `Alert` + Retry on error

- **Portfolio & Expenses pages**
  - Loading spinner while data is being fetched
  - Error alert with Retry button on fetch failure
  - Save handlers wrapped in `try/catch` with error notifications

- **Top bar**
  - Avatar now displays initials derived from the logged-in user's name or email
  - Tooltip on avatar shows the user's email

- **Add Expense dialog**
  - Date field now has a visible `"Date"` label with `InputLabelProps={{ shrink: true }}`
  - Added `Housing` and `Utilities` to the category list

- **Auth context**
  - `login` and `logout` wrapped in `useCallback` for stable references
  - `isAuthenticated` now checks both token presence and JWT expiry

- **API client**
  - Base URL sourced from `VITE_API_URL` environment variable
  - Added 401 response interceptor for automatic session invalidation

- **Data hooks refactored from `useState` to `useReducer`**
  - Eliminates `setState-in-effect` lint violations
  - Cleaner loading/error/success state transitions

### Removed

- `src/mocks/assetsMock.js`, `expensesMock.js`, `portfolioMock.js` — unused mock data never imported by any module
- `src/utils/expenseUtils.js` — dead utility code with zero references

