import { useState, useMemo } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  MessageSquare,
  ThumbsUp,
  Minus,
  ThumbsDown,
  Mail,
  Inbox,
  Search,
  Download,
  Eye,
  X,
  ChevronDown,
} from "lucide-react";
import RowActionMenu from "../components/UI/RowActionMenu";
import DataTableComponent, {
  type TableColumn,
} from "react-data-table-component";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  useFeedback,
  useFeedbackSummary,
  type FeedbackItem,
} from "../hooks/useFeedback";
import StatCard from "../components/UI/StatCard";
import { TableSkeleton } from "../components/skeleton-loaders/OrderDetailsModalSkeleton";
import { AnimatePresence, motion } from "framer-motion";

const DataTable = (DataTableComponent as any).default || DataTableComponent;

const SentimentBadge = ({ sentiment }: { sentiment?: string }) => {
  const map: Record<string, { icon: any; label: string; cls: string }> = {
    positive: {
      icon: ThumbsUp,
      label: "Positive",
      cls: "bg-green-100 text-green-700",
    },
    neutral: {
      icon: Minus,
      label: "Neutral",
      cls: "bg-yellow-100 text-yellow-700",
    },
    negative: {
      icon: ThumbsDown,
      label: "Negative",
      cls: "bg-red-100 text-red-700",
    },
  };

  const cfg = map[sentiment?.toLowerCase() ?? ""] ?? {
    icon: Minus,
    label: "Unknown",
    cls: "bg-gray-100 text-gray-500",
  };
  const { icon: Icon, label, cls } = cfg;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-[9px] uppercase tracking-wide font-medium ${cls}`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

const customStyles = {
  table: { style: { backgroundColor: "transparent", borderRadius: "0px" } },
  headRow: {
    style: {
      backgroundColor: "rgba(0,0,0,0.03)",
      borderBottom: "1px solid rgba(0,0,0,0.06)",
      minHeight: "42px",
      borderRadius: "0px",
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
      minHeight: "56px",
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

const Feedback = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selected, setSelected] = useState<FeedbackItem | null>(null);

  const { data: feedbackResponse, isLoading } = useFeedback(
    currentPage,
    rowsPerPage,
    searchTerm,
    sentimentFilter,
  );
  const items = feedbackResponse?.data?.items ?? [];
  const meta = feedbackResponse?.meta ?? { total: 0 };

  const { data: summaryResponse, isLoading: summaryLoading } =
    useFeedbackSummary();
  const summary = summaryResponse?.data ?? {
    total: 0,
    testimonials: 0,
    contact: 0,
    inquiries: 0,
    pending: 0,
    positive: 0,
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const columns: TableColumn<FeedbackItem>[] = useMemo(
    () => [
      {
        name: "S/N",
        width: "60px",
        center: true,
        cell: (_row: FeedbackItem, rowIndex: number) => (
          <span className="text-xs text-black/40 font-light">
            {(currentPage - 1) * rowsPerPage + rowIndex + 1}
          </span>
        ),
      },
      {
        name: "From",
        selector: (row) => row.name ?? "Anonymous",
        sortable: true,
        cell: (row) => (
          <div>
            <p className="text-xs text-black/80 font-light">
              {row.name || (
                <span className="italic text-black/30">Anonymous</span>
              )}
            </p>
            {row.email && (
              <p className="text-[10px] text-black/40 font-light">
                {row.email}
              </p>
            )}
          </div>
        ),
        width: "240px",
      },
      {
        name: "Feedback",
        selector: (row) => row.message,
        cell: (row) => (
          <p className="text-xs text-black/60 font-light line-clamp-2 max-w-sm">
            {row.message}
          </p>
        ),
        minWidth: "420px",
      },
      {
        name: "Date",
        selector: (row) => row.createdAt,
        sortable: true,
        cell: (row) => (
          <span className="text-xs text-black/40 font-light">
            {new Date(row.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        ),
        width: "120px",
      },
      {
        name: "Actions",
        center: true,
        width: "100px",
        cell: (row) => (
          <RowActionMenu
            actions={[
              {
                icon: Eye,
                label: "Read Feedback",
                onClick: () => setSelected(row),
              },
            ]}
          />
        ),
      },
    ],
    [currentPage, rowsPerPage],
  );

  const handleExport = () => {
    if (!items.length) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Feedback Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
    autoTable(doc, {
      startY: 28,
      head: [["From", "Email", "Feedback", "Sentiment", "Date"]],
      body: items.map((f) => [
        f.name || "Anonymous",
        f.email || "—",
        f.message,
        f.sentiment || "—",
        new Date(f.createdAt).toLocaleDateString(),
      ]),
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [20, 20, 20], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [250, 250, 250] },
    });
    doc.save(`feedback_export_${Date.now()}.pdf`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-black">
              Feedback
            </h1>
            <div className="w-12 h-px bg-black/10 mt-2" />
            <p className="text-xs text-black/50 mt-3">
              Customer feedback and improvement suggestions
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-black/80 transition text-sm"
          >
            <Download className="w-4 h-4 text-white" />
            <span className="font-light text-white">Export</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={MessageSquare}
            label="Total"
            value={summary.total}
            loading={summaryLoading}
          />
          <StatCard
            icon={Mail}
            label="Contact"
            value={summary.contact}
            delay={0.05}
            loading={summaryLoading}
          />
          <StatCard
            icon={Inbox}
            label="Testimonials"
            value={summary.testimonials}
            delay={0.1}
            loading={summaryLoading}
          />
          <StatCard
            icon={ThumbsUp}
            label="Positive"
            value={summary.positive}
            delay={0.15}
            loading={summaryLoading}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white border border-black/10 p-4">
          <form onSubmit={handleSearch} className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-black/10 focus:outline-none focus:border-black/30 text-sm font-light bg-transparent"
            />
            <button type="submit" className="hidden" />
          </form>
          <div className="relative">
            <select
              value={sentimentFilter}
              onChange={(e) => {
                setSentimentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none pl-3 pr-8 py-2 border border-black/10 focus:outline-none focus:border-black/30 text-xs font-light text-black/70 bg-white cursor-pointer"
            >
              <option value="">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-black/40 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-black/10">
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <DataTable
              columns={columns}
              data={items}
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
                  <MessageSquare className="w-8 h-8 text-black/15 mx-auto mb-3" />
                  <p className="text-xs text-black/40 tracking-wide">
                    No feedback submitted yet.
                  </p>
                </div>
              }
            />
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-black/10 z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
                <div>
                  <h2 className="text-sm font-light tracking-tight text-black">
                    Feedback
                  </h2>
                  <p className="text-[10px] text-black/40 mt-0.5 uppercase tracking-widest">
                    {new Date(selected.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-1.5 hover:bg-black/5 transition text-black/50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                <SentimentBadge sentiment={selected.sentiment} />

                <section>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-black/30 mb-3">
                    From
                  </p>
                  <div className="space-y-3">
                    <DrawerRow
                      label="Name"
                      value={selected.name || "Anonymous"}
                    />
                    <DrawerRow label="Email" value={selected.email || "—"} />
                  </div>
                </section>

                <div className="w-full h-px bg-black/5" />

                <section>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-black/30 mb-3">
                    Their Feedback
                  </p>
                  <p className="text-sm text-black/70 font-light leading-relaxed">
                    {selected.message}
                  </p>
                </section>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

const DrawerRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-4">
    <span className="text-[10px] uppercase tracking-[0.1em] text-black/30 shrink-0 pt-0.5">
      {label}
    </span>
    <span className="text-xs text-black/70 font-light text-right">{value}</span>
  </div>
);

export default Feedback;
