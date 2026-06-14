import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: "income" | "expense";
  amount: number;
  paymentMethod: string;
  reference: string;
  status: "completed" | "pending" | "failed";
  notes?: string;
}

const Expense = () => {
  const [selectedTab, setSelectedTab] = useState<"all" | "income" | "expense">(
    "all",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<"week" | "month" | "year" | "all">(
    "all",
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [formData, setFormData] = useState<Partial<Transaction>>({
    type: "expense",
    status: "completed",
  });

  // Sample data - In production, this would come from an API
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "TRX-001",
      date: "2026-01-15",
      description: "Product Sales - Premium T-Shirts",
      category: "Sales Revenue",
      type: "income",
      amount: 245000,
      paymentMethod: "Bank Transfer",
      reference: "INV-2024-001",
      status: "completed",
    },
    {
      id: "TRX-002",
      date: "2026-01-14",
      description: "Supplier Payment - Fabric Materials",
      category: "Inventory",
      type: "expense",
      amount: 85000,
      paymentMethod: "Bank Transfer",
      reference: "PO-2024-015",
      status: "completed",
    },
    {
      id: "TRX-003",
      date: "2026-01-13",
      description: "Marketing Campaign - Instagram Ads",
      category: "Marketing",
      type: "expense",
      amount: 35000,
      paymentMethod: "Credit Card",
      reference: "AD-2024-089",
      status: "completed",
    },
    {
      id: "TRX-004",
      date: "2026-01-12",
      description: "Freelance Design Services",
      category: "Design",
      type: "expense",
      amount: 120000,
      paymentMethod: "Bank Transfer",
      reference: "SRV-2024-023",
      status: "completed",
    },
    {
      id: "TRX-005",
      date: "2026-01-11",
      description: "Monthly Subscription - Shopify",
      category: "Software",
      type: "expense",
      amount: 29900,
      paymentMethod: "Credit Card",
      reference: "SUB-2024-001",
      status: "completed",
    },
    {
      id: "TRX-006",
      date: "2026-06-14",
      description: "Wholesale Order - Retail Partner",
      category: "Wholesale Revenue",
      type: "income",
      amount: 450000,
      paymentMethod: "Bank Transfer",
      reference: "INV-2024-002",
      status: "completed",
    },
    {
      id: "TRX-007",
      date: "2024-01-09",
      description: "Shipping & Logistics",
      category: "Shipping",
      type: "expense",
      amount: 45000,
      paymentMethod: "Bank Transfer",
      reference: "DEL-2024-045",
      status: "completed",
    },
    {
      id: "TRX-008",
      date: "2024-01-08",
      description: "Rent - Office Space",
      category: "Rent",
      type: "expense",
      amount: 250000,
      paymentMethod: "Bank Transfer",
      reference: "RENT-2024-001",
      status: "completed",
    },
    {
      id: "TRX-009",
      date: "2024-01-07",
      description: "Salary Payments - Team",
      category: "Salaries",
      type: "expense",
      amount: 850000,
      paymentMethod: "Bank Transfer",
      reference: "PAY-2024-001",
      status: "completed",
    },
    {
      id: "TRX-010",
      date: "2024-01-06",
      description: "Online Orders - Website",
      category: "E-commerce Revenue",
      type: "income",
      amount: 187500,
      paymentMethod: "Card Payment",
      reference: "ORD-2024-089",
      status: "completed",
    },
    {
      id: "TRX-011",
      date: "2024-01-05",
      description: "Utility Bills",
      category: "Utilities",
      type: "expense",
      amount: 45000,
      paymentMethod: "Bank Transfer",
      reference: "UTIL-2024-001",
      status: "completed",
    },
    {
      id: "TRX-012",
      date: "2024-01-04",
      description: "Refund - Customer Order #ORD-2024-045",
      category: "Refunds",
      type: "expense",
      amount: 12500,
      paymentMethod: "Bank Transfer",
      reference: "REF-2024-001",
      status: "completed",
    },
  ]);

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesTab =
      selectedTab === "all" || transaction.type === selectedTab;
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesDate = true;
    const today = new Date();
    const transactionDate = new Date(transaction.date);

    if (dateRange === "week") {
      const weekAgo = new Date(today.setDate(today.getDate() - 7));
      matchesDate = transactionDate >= weekAgo;
    } else if (dateRange === "month") {
      const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
      matchesDate = transactionDate >= monthAgo;
    } else if (dateRange === "year") {
      const yearAgo = new Date(today.setFullYear(today.getFullYear() - 1));
      matchesDate = transactionDate >= yearAgo;
    }

    return matchesTab && matchesSearch && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "failed":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const handleAddTransaction = () => {
    if (!formData.description || !formData.category || !formData.amount) {
      alert("Please fill in all required fields");
      return;
    }

    const newTransaction: Transaction = {
      id: `TRX-${String(transactions.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      description: formData.description,
      category: formData.category,
      type: formData.type as "income" | "expense",
      amount: formData.amount,
      paymentMethod: formData.paymentMethod || "Bank Transfer",
      reference: formData.reference || `REF-${Date.now()}`,
      status: formData.status as "completed" | "pending" | "failed",
      notes: formData.notes,
    };
    setTransactions([newTransaction, ...transactions]);
    setShowAddModal(false);
    setFormData({ type: "expense", status: "completed" });
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-black">
              Financial Ledger
            </h1>
            <div className="w-12 h-px bg-black/10 mt-2" />
            <p className="text-xs text-black/50 mt-3">
              Track income, expenses, and manage your financial transactions
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm hover:bg-black/90 transition"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-black/10 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gray-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <p className="text-2xl font-light text-black">
              ₦{totalIncome.toLocaleString()}
            </p>
            <p className="text-[10px] uppercase tracking-[0.15em] text-black/40 mt-1">
              Total Income
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white border border-black/10 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gray-50 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <p className="text-2xl font-light text-black">
              ₦{totalExpenses.toLocaleString()}
            </p>
            <p className="text-[10px] uppercase tracking-[0.15em] text-black/40 mt-1">
              Total Expenses
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-black/10 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gray-50 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <p className="text-2xl font-light text-black">
              ₦{netProfit.toLocaleString()}
            </p>
            <p className="text-[10px] uppercase tracking-[0.15em] text-black/40 mt-1">
              Net Profit
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white border border-black/10 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gray-50 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <p className="text-2xl font-light text-black">
              {profitMargin.toFixed(1)}%
            </p>
            <p className="text-[10px] uppercase tracking-[0.15em] text-black/40 mt-1">
              Profit Margin
            </p>
          </motion.div>
        </div>

        {/* Filters Section */}
        <div className="bg-white border border-black/10 p-5">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Tab Buttons */}
            <div className="flex border border-black/10 rounded-sm">
              {(["all", "income", "expense"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setSelectedTab(tab);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 text-[10px] uppercase tracking-[0.15em] transition capitalize ${
                    selectedTab === tab
                      ? "bg-black text-white"
                      : "text-black/60 hover:text-black"
                  }`}
                >
                  {tab === "all" ? "All" : tab}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
              <input
                type="text"
                placeholder="Search by description, reference, or category..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-black/10 text-sm focus:outline-none focus:border-black transition"
              />
            </div>

            {/* Date Range Filter */}
            <div className="flex border border-black/10 rounded-sm">
              {(["week", "month", "year", "all"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setDateRange(range);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 text-[10px] uppercase tracking-[0.15em] transition ${
                    dateRange === range
                      ? "bg-black text-white"
                      : "text-black/60 hover:text-black"
                  }`}
                >
                  {range === "all" ? "All Time" : range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white border border-black/10 overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-black/10">
              <tr>
                <th className="text-left py-4 px-4 text-[10px] uppercase tracking-[0.15em] text-black/50 font-normal">
                  Date
                </th>
                <th className="text-left py-4 px-4 text-[10px] uppercase tracking-[0.15em] text-black/50 font-normal">
                  Description
                </th>
                <th className="text-left py-4 px-4 text-[10px] uppercase tracking-[0.15em] text-black/50 font-normal">
                  Category
                </th>
                <th className="text-left py-4 px-4 text-[10px] uppercase tracking-[0.15em] text-black/50 font-normal">
                  Type
                </th>
                <th className="text-right py-4 px-4 text-[10px] uppercase tracking-[0.15em] text-black/50 font-normal">
                  Amount
                </th>
                <th className="text-left py-4 px-4 text-[10px] uppercase tracking-[0.15em] text-black/50 font-normal">
                  Status
                </th>
                <th className="text-center py-4 px-4 text-[10px] uppercase tracking-[0.15em] text-black/50 font-normal">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <p className="text-sm text-black/40">
                      No transactions found
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-black/5 hover:bg-black/5 transition"
                  >
                    <td className="py-3 px-4 text-sm text-black/70">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm text-black">
                          {transaction.description}
                        </p>
                        <p className="text-[10px] text-black/40 mt-0.5">
                          Ref: {transaction.reference}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-black/70">
                      {transaction.category}
                    </td>
                    <td className="py-3 px-4">
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] uppercase tracking-wider ${
                          transaction.type === "income"
                            ? "text-green-600 bg-green-50"
                            : "text-red-600 bg-red-50"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {transaction.type}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <p
                        className={`text-sm font-medium ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}₦
                        {transaction.amount.toLocaleString()}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 text-[10px] uppercase tracking-wider ${getStatusColor(
                          transaction.status,
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedTransaction(transaction)}
                          className="p-1 hover:bg-black/5 transition"
                        >
                          <Eye className="w-4 h-4 text-black/40" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteTransaction(transaction.id)
                          }
                          className="p-1 hover:bg-black/5 transition"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t border-black/10">
              <p className="text-xs text-black/50">
                Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
                {Math.min(
                  currentPage * rowsPerPage,
                  filteredTransactions.length,
                )}{" "}
                of {filteredTransactions.length} entries
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-black/10 hover:border-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 text-sm ${
                          currentPage === pageNum
                            ? "bg-black text-white"
                            : "text-black/60 hover:bg-black/5"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 border border-black/10 hover:border-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-black/10 sticky top-0 bg-white">
                <h3 className="text-lg font-light">Add Transaction</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 hover:bg-black/5 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-black/50 mb-2">
                    Type *
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, type: "expense" })
                      }
                      className={`flex-1 py-2 text-sm border transition ${
                        formData.type === "expense"
                          ? "border-red-500 bg-red-50 text-red-600"
                          : "border-black/10 text-black/60 hover:border-black"
                      }`}
                    >
                      Expense
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, type: "income" })
                      }
                      className={`flex-1 py-2 text-sm border transition ${
                        formData.type === "income"
                          ? "border-green-500 bg-green-50 text-green-600"
                          : "border-black/10 text-black/60 hover:border-black"
                      }`}
                    >
                      Income
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-black/50 mb-2">
                    Description *
                  </label>
                  <input
                    type="text"
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-black/10 text-sm focus:outline-none focus:border-black"
                    placeholder="Enter description"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-black/50 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-black/10 text-sm focus:outline-none focus:border-black"
                  >
                    <option value="">Select category</option>
                    {formData.type === "income" ? (
                      <>
                        <option>Sales Revenue</option>
                        <option>Wholesale Revenue</option>
                        <option>E-commerce Revenue</option>
                      </>
                    ) : (
                      <>
                        <option>Inventory</option>
                        <option>Marketing</option>
                        <option>Salaries</option>
                        <option>Rent</option>
                        <option>Shipping</option>
                        <option>Software</option>
                        <option>Utilities</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-black/50 mb-2">
                    Amount (₦) *
                  </label>
                  <input
                    type="number"
                    value={formData.amount || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-black/10 text-sm focus:outline-none focus:border-black"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-black/50 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-black/10 text-sm focus:outline-none focus:border-black"
                  >
                    <option value="">Select method</option>
                    <option>Bank Transfer</option>
                    <option>Credit Card</option>
                    <option>Cash</option>
                    <option>Mobile Money</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-black/50 mb-2">
                    Reference
                  </label>
                  <input
                    type="text"
                    value={formData.reference || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, reference: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-black/10 text-sm focus:outline-none focus:border-black"
                    placeholder="Invoice/Order reference"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-black/50 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as
                          | "completed"
                          | "pending"
                          | "failed",
                      })
                    }
                    className="w-full px-3 py-2 border border-black/10 text-sm focus:outline-none focus:border-black"
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-black/50 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-black/10 text-sm focus:outline-none focus:border-black"
                    placeholder="Additional notes..."
                  />
                </div>
              </div>

              <div className="flex gap-3 p-5 border-t border-black/10 sticky bottom-0 bg-white">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 border border-black/10 text-sm hover:border-black transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTransaction}
                  className="flex-1 py-2 bg-black text-white text-sm hover:bg-black/90 transition"
                >
                  Add Transaction
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Transaction Modal */}
      <AnimatePresence>
        {selectedTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md mx-4"
            >
              <div className="flex items-center justify-between p-5 border-b border-black/10">
                <h3 className="text-lg font-light">Transaction Details</h3>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="p-1 hover:bg-black/5 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-black/50">Transaction ID</span>
                  <span className="text-sm font-medium text-black">
                    {selectedTransaction.id}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-black/50">Date</span>
                  <span className="text-sm text-black">
                    {new Date(selectedTransaction.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-black/50">Description</span>
                  <span className="text-sm text-black">
                    {selectedTransaction.description}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-black/50">Category</span>
                  <span className="text-sm text-black">
                    {selectedTransaction.category}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-black/50">Type</span>
                  <span
                    className={`text-sm font-medium ${
                      selectedTransaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedTransaction.type}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-black/50">Amount</span>
                  <span
                    className={`text-lg font-light ${
                      selectedTransaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedTransaction.type === "income" ? "+" : "-"}₦
                    {selectedTransaction.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-black/50">Payment Method</span>
                  <span className="text-sm text-black">
                    {selectedTransaction.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-black/50">Reference</span>
                  <span className="text-sm text-black">
                    {selectedTransaction.reference}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-black/50">Status</span>
                  <span
                    className={`inline-block px-2 py-1 text-[10px] uppercase tracking-wider ${getStatusColor(
                      selectedTransaction.status,
                    )}`}
                  >
                    {selectedTransaction.status}
                  </span>
                </div>
                {selectedTransaction.notes && (
                  <div>
                    <span className="text-xs text-black/50">Notes</span>
                    <p className="text-sm text-black mt-1">
                      {selectedTransaction.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 p-5 border-t border-black/10">
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="flex-1 py-2 border border-black/10 text-sm hover:border-black transition"
                >
                  Close
                </button>
                <button className="flex-1 py-2 bg-black text-white text-sm hover:bg-black/90 transition">
                  Edit Transaction
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Expense;
