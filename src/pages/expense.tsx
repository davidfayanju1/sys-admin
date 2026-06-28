import { useState, useMemo } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  TrendingDown,
  Plus,
  Search,
  Eye,
  Trash2,
  CheckCircle,
  X,
  ChevronDown,
  Download,
  Receipt,
  Clock,
  Wallet,
  Tag,
} from "lucide-react";
import RowActionMenu from "../components/UI/RowActionMenu";
import { motion, AnimatePresence } from "framer-motion";
import DataTableComponent, {
  type TableColumn,
} from "react-data-table-component";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  useExpenses,
  useExpenseSummary,
  useCreateExpense,
  useDeleteExpense,
  useUpdateExpenseStatus,
  type Expense,
  type CreateExpensePayload,
} from "../hooks/useExpenses";
import { TableSkeleton } from "../components/skeleton-loaders/OrderDetailsModalSkeleton";

const DataTable = (DataTableComponent as any).default || DataTableComponent;

const CATEGORIES = [
  "rent",
  "utilities",
  "salaries",
  "marketing",
  "inventory",
  "transport",
  "equipment",
  "maintenance",
  "other",
] as const;

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "card", label: "Card" },
  { value: "mobile_money", label: "Mobile Money" },
  { value: "cheque", label: "Cheque" },
] as const;

const formatLabel = (s: string) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const fmt = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

const StatusBadge = ({ status }: { status: Expense["status"] }) => {
  const map = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 text-[9px] uppercase tracking-wide font-medium ${map[status] ?? "bg-gray-100 text-gray-500"}`}
    >
      {status}
    </span>
  );
};

const CategoryBadge = ({ category }: { category: string }) => (
  <span className="inline-flex px-2 py-0.5 text-[9px] uppercase tracking-wide font-medium bg-black/5 text-black/50">
    {formatLabel(category)}
  </span>
);

const customStyles = {
  table: { style: { backgroundColor: "transparent" } },
  headRow: {
    style: {
      backgroundColor: "rgba(0,0,0,0.03)",
      borderBottom: "1px solid rgba(0,0,0,0.06)",
      minHeight: "42px",
    },
  },
  headCells: {
    style: {
      fontSize: "9px",
      fontWeight: "300",
      letterSpacing: "0.1em",
      textTransform: "uppercase" as const,
      color: "rgba(0,0,0,0.5)",
      paddingLeft: "16px",
      paddingRight: "16px",
    },
  },
  rows: {
    style: {
      minHeight: "52px",
      borderBottom: "1px solid rgba(0,0,0,0.04)",
      "&:hover": { backgroundColor: "rgba(0,0,0,0.02)" },
      transition: "background-color 0.15s ease",
    },
  },
  cells: { style: { paddingLeft: "16px", paddingRight: "16px" } },
  pagination: {
    style: {
      fontSize: "11px",
      fontWeight: "300",
      color: "rgba(0,0,0,0.5)",
      borderTop: "1px solid rgba(0,0,0,0.06)",
      minHeight: "48px",
    },
    pageButtonsStyle: {
      borderRadius: "0px",
      height: "32px",
      width: "32px",
      padding: "4px",
      cursor: "pointer",
      transition: "0.2s",
      fill: "rgba(0,0,0,0.4)",
      "&:hover:not(:disabled)": {
        backgroundColor: "rgba(0,0,0,0.04)",
        fill: "rgba(0,0,0,0.8)",
      },
      "&:disabled": { cursor: "default", fill: "rgba(0,0,0,0.15)" },
    },
  },
  noData: {
    style: {
      padding: "32px",
      color: "rgba(0,0,0,0.4)",
      fontSize: "12px",
      fontWeight: "300",
    },
  },
};

const EMPTY_FORM: CreateExpensePayload = {
  title: "",
  category: "rent",
  amount: 0,
  date: new Date().toISOString().split("T")[0],
  paymentMethod: "cash",
  vendor: "",
  notes: "",
  status: "pending",
};

const inputCls =
  "w-full px-3 py-2.5 border border-black/10 focus:outline-none focus:border-black text-sm font-light transition bg-white";

const DrawerRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start justify-between gap-4">
    <span className="text-[10px] uppercase tracking-widest text-black/30 shrink-0 pt-0.5">
      {label}
    </span>
    <span className="text-xs text-black/70 font-light text-right">{value}</span>
  </div>
);

const ExpensePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [form, setForm] = useState<CreateExpensePayload>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof CreateExpensePayload, string>>
  >({});

  const { data: expensesResponse, isLoading } = useExpenses(
    currentPage,
    rowsPerPage,
    searchTerm,
    statusFilter,
    categoryFilter,
  );
  const { data: summaryResponse, isLoading: summaryLoading } =
    useExpenseSummary();

  const createExpense = useCreateExpense();
  const deleteExpense = useDeleteExpense();
  const updateStatus = useUpdateExpenseStatus();

  const expenses = expensesResponse?.data ?? [];
  const meta = expensesResponse?.meta ?? { total: 0 };
  const summary = summaryResponse?.data ?? {
    total: 0,
    totalAmount: 0,
    pending: 0,
    paid: 0,
    byCategory: {},
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const setField = (field: keyof CreateExpensePayload, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = (): boolean => {
    const e: typeof formErrors = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.category) e.category = "Required";
    if (!form.amount || form.amount <= 0) e.amount = "Must be greater than 0";
    if (!form.date) e.date = "Required";
    if (!form.paymentMethod) e.paymentMethod = "Required";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAddExpense = () => {
    if (!validateForm()) return;
    const payload: CreateExpensePayload = {
      ...form,
      vendor: form.vendor?.trim() || undefined,
      notes: form.notes?.trim() || undefined,
    };
    createExpense.mutate(payload, {
      onSuccess: () => {
        setShowAddModal(false);
        setForm(EMPTY_FORM);
        setFormErrors({});
      },
    });
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteExpense.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const handleMarkPaid = (expense: Expense) => {
    updateStatus.mutate({ id: expense.id, status: "paid" });
  };

  const handleExport = () => {
    if (!expenses.length) return;
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(16);
    doc.text("Expenses Report", 14, 15);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Generated: ${new Date().toLocaleString()}  |  Total: ${fmt(summary.totalAmount)}  |  Pending: ${summary.pending}  |  Paid: ${summary.paid}`,
      14,
      22,
    );
    doc.setTextColor(0, 0, 0);
    autoTable(doc, {
      head: [
        [
          "Title",
          "Category",
          "Date",
          "Vendor",
          "Amount",
          "Payment Method",
          "Status",
          "Notes",
        ],
      ],
      body: expenses.map((e) => [
        e.title,
        formatLabel(e.category),
        new Date(e.date).toLocaleDateString("en-GB"),
        e.vendor || "—",
        fmt(e.amount),
        formatLabel(e.paymentMethod),
        e.status.toUpperCase(),
        e.notes || "—",
      ]),
      startY: 28,
      styles: {
        fontSize: 8,
        cellPadding: 3,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontSize: 8,
      },
      alternateRowStyles: { fillColor: [248, 248, 248] },
      margin: { left: 14, right: 14 },
    });
    doc.save(`expenses_${Date.now()}.pdf`);
  };

  const columns: TableColumn<Expense>[] = useMemo(
    () => [
      {
        name: "S/N",
        width: "60px",
        center: true,
        cell: (_row, idx) => (
          <span className="text-xs text-black/40 font-light">
            {(currentPage - 1) * rowsPerPage + idx + 1}
          </span>
        ),
      },
      {
        name: "Title",
        selector: (row) => row.title,
        sortable: true,
        minWidth: "200px",
        cell: (row) => (
          <div>
            <p className="text-xs text-black/80 font-light">{row.title}</p>
            {row.vendor && (
              <p className="text-[10px] text-black/40 font-light">
                {row.vendor}
              </p>
            )}
          </div>
        ),
      },
      {
        name: "Category",
        selector: (row) => row.category,
        sortable: true,
        width: "130px",
        cell: (row) => <CategoryBadge category={row.category} />,
      },
      {
        name: "Date",
        selector: (row) => row.date,
        sortable: true,
        width: "110px",
        cell: (row) => (
          <span className="text-xs text-black/50 font-light">
            {new Date(row.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        ),
      },
      {
        name: "Amount",
        selector: (row) => row.amount,
        sortable: true,
        width: "130px",
        cell: (row) => (
          <span className="text-sm text-black/80 font-light">
            {fmt(row.amount)}
          </span>
        ),
      },
      {
        name: "Payment",
        selector: (row) => row.paymentMethod,
        width: "130px",
        cell: (row) => (
          <span className="text-xs text-black/50 font-light">
            {formatLabel(row.paymentMethod)}
          </span>
        ),
      },
      {
        name: "Status",
        selector: (row) => row.status,
        sortable: true,
        width: "100px",
        cell: (row) => <StatusBadge status={row.status} />,
      },
      {
        name: "Actions",
        center: true,
        width: "70px",
        cell: (row) => (
          <RowActionMenu
            actions={[
              {
                icon: Eye,
                label: "View Details",
                onClick: () => setSelectedExpense(row),
              },
              {
                icon: CheckCircle,
                label: "Mark as Paid",
                onClick: () => handleMarkPaid(row),
                hidden: row.status === "paid",
              },
              {
                icon: Trash2,
                label: "Delete",
                onClick: () => setDeleteTarget(row),
                destructive: true,
              },
            ]}
          />
        ),
      },
    ],
    [currentPage, rowsPerPage],
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-black">
              Expenses
            </h1>
            <div className="w-12 h-px bg-black/10 mt-2" />
            <p className="text-xs text-black/50 mt-3">
              Track and manage all business expenditures
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 border border-black/10 text-sm hover:border-black transition"
            >
              <Download className="w-4 h-4" />
              <span className="font-light">Export</span>
            </button>
            <button
              onClick={() => {
                setForm(EMPTY_FORM);
                setFormErrors({});
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm hover:bg-black/80 transition"
            >
              <Plus className="w-4 h-4" />
              <span className="font-light">Add Expense</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: TrendingDown,
              label: "Total Spent",
              value: fmt(summary.totalAmount),
              loading: summaryLoading,
            },
            {
              icon: Wallet,
              label: "Total Expenses",
              value: summary.total,
              loading: summaryLoading,
            },
            {
              icon: Clock,
              label: "Pending",
              value: summary.pending,
              loading: summaryLoading,
            },
            {
              icon: CheckCircle,
              label: "Paid",
              value: summary.paid,
              loading: summaryLoading,
            },
          ].map(({ icon: Icon, label, value, loading }) => (
            <div key={label} className="bg-white border border-black/10 p-5">
              {loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-3 bg-black/5 rounded w-20" />
                  <div className="h-6 bg-black/5 rounded w-16" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-3.5 h-3.5 text-black/30" />
                    <p className="text-[10px] uppercase tracking-widest text-black/40">
                      {label}
                    </p>
                  </div>
                  <p className="text-2xl font-light text-black">{value}</p>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 bg-white border border-black/10 p-4">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
            <input
              type="text"
              placeholder="Search by title, vendor…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-black/10 focus:outline-none focus:border-black text-sm font-light transition"
            />
            <button type="submit" className="hidden" />
          </form>

          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none pl-3 pr-7 py-2 border border-black/10 focus:outline-none focus:border-black text-xs font-light text-black/70 bg-white cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="rejected">Rejected</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-black/40 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none pl-3 pr-7 py-2 border border-black/10 focus:outline-none focus:border-black text-xs font-light text-black/70 bg-white cursor-pointer"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {formatLabel(c)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-black/40 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-black/10">
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <DataTable
              columns={columns}
              data={expenses}
              customStyles={customStyles}
              pagination
              paginationServer
              paginationTotalRows={meta.total}
              onChangePage={(page: number) => setCurrentPage(page)}
              onChangeRowsPerPage={(n: number, p: number) => {
                setRowsPerPage(n);
                setCurrentPage(p);
              }}
              paginationPerPage={rowsPerPage}
              paginationRowsPerPageOptions={[10, 20, 50]}
              highlightOnHover
              responsive
              persistTableHead
              noDataComponent={
                <div className="py-12 text-center">
                  <Receipt className="w-8 h-8 text-black/15 mx-auto mb-3" />
                  <p className="text-xs text-black/40 tracking-wide">
                    No expenses recorded yet.
                  </p>
                </div>
              }
            />
          )}
        </div>
      </div>

      {/* ── Detail Drawer ── */}
      <AnimatePresence>
        {selectedExpense && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setSelectedExpense(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-black/10 z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-black/10 shrink-0">
                <div>
                  <h2 className="text-sm font-light tracking-tight text-black">
                    Expense Details
                  </h2>
                  <p className="text-[10px] text-black/40 mt-0.5 uppercase tracking-widest">
                    {new Date(selectedExpense.date).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedExpense(null)}
                  className="p-1.5 hover:bg-black/5 transition text-black/50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedExpense.status} />
                  <CategoryBadge category={selectedExpense.category} />
                </div>

                <section>
                  <p className="text-[9px] uppercase tracking-widest text-black/30 mb-3">
                    Expense
                  </p>
                  <div className="space-y-3">
                    <DrawerRow label="Title" value={selectedExpense.title} />
                    <DrawerRow
                      label="Amount"
                      value={
                        <span className="text-base font-light text-black">
                          {fmt(selectedExpense.amount)}
                        </span>
                      }
                    />
                    <DrawerRow
                      label="Date"
                      value={new Date(selectedExpense.date).toLocaleDateString(
                        "en-GB",
                        { day: "2-digit", month: "long", year: "numeric" },
                      )}
                    />
                  </div>
                </section>

                <div className="w-full h-px bg-black/5" />

                <section>
                  <p className="text-[9px] uppercase tracking-widest text-black/30 mb-3">
                    Payment
                  </p>
                  <div className="space-y-3">
                    <DrawerRow
                      label="Method"
                      value={formatLabel(selectedExpense.paymentMethod)}
                    />
                    {selectedExpense.vendor && (
                      <DrawerRow
                        label="Vendor"
                        value={selectedExpense.vendor}
                      />
                    )}
                    {selectedExpense.createdBy && (
                      <DrawerRow
                        label="Recorded By"
                        value={selectedExpense.createdBy}
                      />
                    )}
                    {selectedExpense.receiptUrl && (
                      <DrawerRow
                        label="Receipt"
                        value={
                          <a
                            href={selectedExpense.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black underline underline-offset-2"
                          >
                            View Receipt
                          </a>
                        }
                      />
                    )}
                  </div>
                </section>

                {selectedExpense.notes && (
                  <>
                    <div className="w-full h-px bg-black/5" />
                    <section>
                      <p className="text-[9px] uppercase tracking-widest text-black/30 mb-3">
                        Notes
                      </p>
                      <p className="text-xs text-black/60 font-light leading-relaxed">
                        {selectedExpense.notes}
                      </p>
                    </section>
                  </>
                )}
              </div>

              {selectedExpense.status !== "paid" && (
                <div className="px-6 py-4 border-t border-black/10 shrink-0">
                  <button
                    onClick={() => {
                      handleMarkPaid(selectedExpense);
                      setSelectedExpense(null);
                    }}
                    disabled={updateStatus.isPending}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-black text-white text-sm hover:bg-black/80 transition disabled:opacity-40"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Mark as Paid
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Add Expense Modal ── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18 }}
              className="relative bg-white w-full max-w-lg mx-4 flex flex-col max-h-[92vh]"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-black/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black flex items-center justify-center">
                    <Tag className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-light tracking-wide text-black">
                      Record Expense
                    </h3>
                    <p className="text-[10px] text-black/40 mt-0.5">
                      New business expenditure
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 hover:bg-black/5 transition text-black/40"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-1.5">
                    Title *
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    placeholder="e.g. Monthly rent payment"
                    className={`${inputCls} ${formErrors.title ? "border-red-400" : ""}`}
                  />
                  {formErrors.title && (
                    <p className="text-[9px] text-red-500 mt-1">
                      {formErrors.title}
                    </p>
                  )}
                </div>

                {/* Category + Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-1.5">
                      Category *
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setField("category", e.target.value)}
                      className={`${inputCls} capitalize ${formErrors.category ? "border-red-400" : ""}`}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {formatLabel(c)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-1.5">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) => setField("status", e.target.value)}
                      className={inputCls}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                </div>

                {/* Amount + Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-1.5">
                      Amount (₦) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.amount || ""}
                      onChange={(e) =>
                        setField("amount", Number(e.target.value))
                      }
                      onWheel={(e) => e.currentTarget.blur()}
                      placeholder="0"
                      className={`${inputCls} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${formErrors.amount ? "border-red-400" : ""}`}
                    />
                    {formErrors.amount && (
                      <p className="text-[9px] text-red-500 mt-1">
                        {formErrors.amount}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-1.5">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setField("date", e.target.value)}
                      className={`${inputCls} ${formErrors.date ? "border-red-400" : ""}`}
                    />
                    {formErrors.date && (
                      <p className="text-[9px] text-red-500 mt-1">
                        {formErrors.date}
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Method + Vendor */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-1.5">
                      Payment Method *
                    </label>
                    <select
                      value={form.paymentMethod}
                      onChange={(e) =>
                        setField("paymentMethod", e.target.value)
                      }
                      className={`${inputCls} ${formErrors.paymentMethod ? "border-red-400" : ""}`}
                    >
                      {PAYMENT_METHODS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-1.5">
                      Vendor
                    </label>
                    <input
                      value={form.vendor}
                      onChange={(e) => setField("vendor", e.target.value)}
                      placeholder="e.g. Lagos Properties Ltd"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-1.5">
                    Notes
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setField("notes", e.target.value)}
                    rows={3}
                    placeholder="Any additional context…"
                    className={`${inputCls} resize-none`}
                  />
                </div>
              </div>

              <div className="flex gap-3 px-6 py-4 border-t border-black/10 shrink-0">
                <button
                  onClick={() => setShowAddModal(false)}
                  disabled={createExpense.isPending}
                  className="flex-1 py-2.5 border border-black/10 text-sm text-black/60 hover:border-black transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddExpense}
                  disabled={createExpense.isPending}
                  className="flex-1 py-2.5 bg-black text-white text-sm hover:bg-black/80 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {createExpense.isPending ? "Saving…" : "Record Expense"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation ── */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setDeleteTarget(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="relative bg-white w-full max-w-sm mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 py-4 border-b border-black/10 flex items-center justify-between">
                <h3 className="text-sm font-light text-black">
                  Delete Expense
                </h3>
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="p-1 hover:bg-black/5 transition text-black/40"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="px-5 py-5 space-y-4">
                <p className="text-xs text-black/60 leading-relaxed">
                  This will permanently delete{" "}
                  <span className="font-medium text-black">
                    {deleteTarget.title}
                  </span>
                  . This cannot be undone.
                </p>
                <div className="p-3 bg-black/2 border border-black/5">
                  <p className="text-xs text-black/70 font-light">
                    {deleteTarget.title}
                  </p>
                  <p className="text-[10px] text-black/40 mt-0.5">
                    {fmt(deleteTarget.amount)} ·{" "}
                    {formatLabel(deleteTarget.category)}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 px-5 py-4 border-t border-black/10">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleteExpense.isPending}
                  className="flex-1 py-2.5 border border-black/10 text-sm text-black/60 hover:border-black transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteExpense.isPending}
                  className="flex-1 py-2.5 bg-red-600 text-white text-sm hover:bg-red-700 transition disabled:opacity-50"
                >
                  {deleteExpense.isPending ? "Deleting…" : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default ExpensePage;
