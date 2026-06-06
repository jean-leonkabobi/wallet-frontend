export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
}

export interface Category {
  id: number
  name: string
  description: string
}

export interface Revenue {
  id: number
  description: string
  amount: number
  revenueDate: string
  notes: string
}

export interface RevenueDTO {
  description: string
  amount: number
  revenueDate: string
  notes: string
}

export interface Expense {
  id: number
  description: string
  amount: number
  expenseDate: string
  categoryId: number
  notes: string
}

export interface ExpenseDTO {
  description: string
  amount: number
  expenseDate: string
  categoryId: number
  notes: string
}

export interface Budget {
  id: number
  amount: number
  month: number
  year: number
  categoryId: number | null
  alertThreshold: number
  isActive: boolean
}

export interface BudgetDTO {
  amount: number
  month: number
  year: number
  categoryId?: number
  alertThreshold?: number
  isActive?: boolean
}

export interface BudgetStatus {
  budgetId: number
  budgetAmount: number
  spentAmount: number
  remainingAmount: number
  percentageUsed: number
  status: 'OK' | 'WARNING' | 'CRITICAL' | 'EXCEEDED'
}

export interface BudgetAlert {
  budgetId: number
  alertType: 'WARNING' | 'CRITICAL' | 'EXCEEDED'
  message: string
  budgetAmount: number
  spentAmount: number
  remainingAmount: number
  percentageUsed: number
  categoryName: string
  alertDate: string
}

export interface DashboardData {
  currentBalance: number
  totalRevenuesMonth: number
  totalExpensesMonth: number
  savingsRate: number
  expensesByCategory: CategoryExpense[]
  monthlyEvolution: MonthlyEvolution[]
}

export interface CategoryExpense {
  categoryName: string
  totalAmount: number
  percentage: number
}

export interface MonthlyEvolution {
  month: number
  monthName: string
  totalExpenses: number
  totalRevenues: number
}

export interface TransactionSearch {
  type?: 'REVENUE' | 'EXPENSE'
  keyword?: string
  categoryId?: number
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
  sortBy?: 'date' | 'amount' | 'description'
  sortDirection?: 'asc' | 'desc'
}

export interface Transaction {
  id: number
  type: 'REVENUE' | 'EXPENSE'
  description: string
  amount: number
  date: string
  categoryName: string | null
  notes: string
}

export interface ExportRequest {
  startDate: string
  endDate: string
  format: 'PDF' | 'CSV'
  categoryId?: number
  type?: 'REVENUE' | 'EXPENSE' | 'ALL'
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  type: string
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
}