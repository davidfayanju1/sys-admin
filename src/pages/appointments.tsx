import { useState, useMemo } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  CalendarClock,
  Clock,
  CheckCircle,
  CalendarCheck,
  Search,
  Download,
  Eye,
  ChevronDown,
  X,
  Mail,
  Video,
  Briefcase,
  MessageSquare,
} from "lucide-react";
import RowActionMenu from "../components/UI/RowActionMenu";
import SendEmailModal from "../components/appointments/SendEmailModal";
import ScheduleMeetingModal from "../components/appointments/ScheduleMeetingModal";
import DataTableComponent, {
  type TableColumn,
} from "react-data-table-component";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  useAppointments,
  useAppointmentSummary,
  type Appointment,
} from "../hooks/useAppointments";
import StatCard from "../components/UI/StatCard";
import { TableSkeleton } from "../components/skeleton-loaders/OrderDetailsModalSkeleton";
import { AnimatePresence, motion } from "framer-motion";

const DataTable = (DataTableComponent as any).default || DataTableComponent;

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { icon: any; label: string; className: string }> = {
    pending: { icon: Clock, label: "Pending", className: "bg-yellow-100 text-yellow-700" },
    confirmed: { icon: CalendarCheck, label: "Confirmed", className: "bg-blue-100 text-blue-700" },
    completed: { icon: CheckCircle, label: "Completed", className: "bg-green-100 text-green-700" },
    cancelled: { icon: X, label: "Cancelled", className: "bg-red-100 text-red-700" },
  };

  const { icon: Icon, label, className } = config[status.toLowerCase()] ?? {
    icon: Clock,
    label: status,
    className: "bg-gray-100 text-gray-700",
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-[9px] uppercase tracking-wide font-medium ${className}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

const customStyles = {
  table: { style: { backgroundColor: "transparent", borderRadius: "0px" } },
  headRow: {
    style: {
      backgroundColor: "rgba(0, 0, 0, 0.03)",
      borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
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
      color: "rgba(0, 0, 0, 0.5)",
      paddingLeft: "16px",
      paddingRight: "16px",
    },
  },
  rows: {
    style: {
      minHeight: "56px",
      borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
      "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.02)" },
      transition: "background-color 0.15s ease",
    },
  },
  cells: { style: { paddingLeft: "16px", paddingRight: "16px" } },
  pagination: {
    style: {
      fontSize: "11px",
      fontWeight: "300",
      color: "rgba(0, 0, 0, 0.5)",
      borderTop: "1px solid rgba(0, 0, 0, 0.06)",
      minHeight: "48px",
    },
    pageButtonsStyle: {
      borderRadius: "0px",
      height: "32px",
      width: "32px",
      padding: "4px",
      cursor: "pointer",
      transition: "0.2s",
      fill: "rgba(0, 0, 0, 0.4)",
      "&:hover:not(:disabled)": { backgroundColor: "rgba(0, 0, 0, 0.04)", fill: "rgba(0, 0, 0, 0.8)" },
      "&:disabled": { cursor: "default", fill: "rgba(0, 0, 0, 0.15)" },
    },
  },
  noData: {
    style: { padding: "32px", color: "rgba(0, 0, 0, 0.4)", fontSize: "12px", fontWeight: "300" },
  },
};

const Appointments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [emailModalAppointment, setEmailModalAppointment] = useState<Appointment | null>(null);
  const [meetingModalAppointment, setMeetingModalAppointment] = useState<Appointment | null>(null);

  const { data: appointmentsResponse, isLoading } = useAppointments(
    currentPage,
    rowsPerPage,
    searchTerm,
    statusFilter
  );
  const appointments = appointmentsResponse?.data?.items || [];
  const meta = appointmentsResponse?.meta || { total: 0 };

  const { data: summaryResponse, isLoading: summaryLoading } = useAppointmentSummary();
  const summary = summaryResponse?.data || {
    total: 0,
    appointments: 0,
    consultations: 0,
    inquiries: 0,
    pending: 0,
    confirmed: 0,
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const columns: TableColumn<Appointment>[] = useMemo(
    () => [
      {
        name: "S/N",
        width: "60px",
        center: true,
        cell: (_row: Appointment, rowIndex: number) => (
          <span className="text-xs text-black/40 font-light">
            {(currentPage - 1) * rowsPerPage + rowIndex + 1}
          </span>
        ),
      },
      {
        name: "Client",
        selector: (row) => row.name,
        sortable: true,
        cell: (row) => (
          <div>
            <p className="text-xs text-black/80 font-light">{row.name}</p>
            <p className="text-[10px] text-black/40 font-light">{row.email}</p>
          </div>
        ),
        minWidth: "180px",
      },
      {
        name: "Phone",
        selector: (row) => row.phone,
        cell: (row) => (
          <span className="text-xs text-black/50 font-light">{row.phone}</span>
        ),
        width: "150px",
      },
      {
        name: "Type",
        selector: (row) => row.type,
        sortable: true,
        cell: (row) => (
          <span className="text-xs text-black/70 font-light capitalize">
            {row.type.replace(/-/g, " ")}
          </span>
        ),
        minWidth: "160px",
      },
      {
        name: "Service",
        selector: (row) => row.service,
        cell: (row) => (
          <span className="text-xs text-black/60 font-light">{row.service}</span>
        ),
        minWidth: "140px",
      },
      {
        name: "Scheduled",
        selector: (row) => row.scheduledAt,
        sortable: true,
        cell: (row) => (
          <span className="text-xs text-black/70 font-light">
            {new Date(row.scheduledAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        ),
        width: "130px",
      },
      {
        name: "Status",
        selector: (row) => row.status,
        sortable: true,
        cell: (row) => <StatusBadge status={row.status} />,
        width: "130px",
      },
      {
        name: "Actions",
        center: true,
        width: "70px",
        cell: (row) => (
          <RowActionMenu
            actions={[
              { icon: Eye, label: "View Details", onClick: () => setSelectedAppointment(row) },
              { icon: Mail, label: "Send Email", onClick: () => setEmailModalAppointment(row) },
              { icon: Video, label: "Schedule Meeting", onClick: () => setMeetingModalAppointment(row) },
            ]}
          />
        ),
      },
    ],
    [currentPage, rowsPerPage]
  );

  const handleExport = () => {
    if (!appointments.length) return;

    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(16);
    doc.text("Appointments Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [["Client", "Email", "Phone", "Type", "Service", "Scheduled", "Status"]],
      body: appointments.map((a) => [
        a.name,
        a.email,
        a.phone,
        a.type.replace(/-/g, " "),
        a.service,
        new Date(a.scheduledAt).toLocaleDateString(),
        a.status,
      ]),
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [20, 20, 20], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [250, 250, 250] },
    });

    doc.save(`appointments_export_${new Date().getTime()}.pdf`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-black">Appointments</h1>
            <div className="w-12 h-px bg-black/10 mt-2" />
            <p className="text-xs text-black/50 mt-3">Manage and track all client consultations</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-black border border-black/10 hover:bg-black/80 transition text-sm"
          >
            <Download className="w-4 h-4 text-white" />
            <span className="font-light text-white">Export</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard icon={CalendarClock} label="Total" value={summary.total} loading={summaryLoading} />
          <StatCard icon={Briefcase} label="Appointments" value={summary.appointments} delay={0.05} loading={summaryLoading} />
          <StatCard icon={MessageSquare} label="Consultations" value={summary.consultations} delay={0.1} loading={summaryLoading} />
          <StatCard icon={Clock} label="Pending" value={summary.pending} delay={0.15} loading={summaryLoading} />
          <StatCard icon={CalendarCheck} label="Confirmed" value={summary.confirmed} delay={0.2} loading={summaryLoading} />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white border border-black/10 p-4">
          <form onSubmit={handleSearch} className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
            <input
              type="text"
              placeholder="Search by name, email, or type..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-black/10 focus:outline-none focus:border-black/30 transition-colors text-sm font-light bg-transparent"
            />
            <button type="submit" className="hidden" />
          </form>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="appearance-none pl-3 pr-8 py-2 border border-black/10 focus:outline-none focus:border-black/30 text-xs font-light text-black/70 bg-white transition-colors cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
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
              data={appointments}
              customStyles={customStyles}
              pagination
              paginationServer
              paginationTotalRows={meta.total}
              onChangePage={(page: number) => setCurrentPage(page)}
              onChangeRowsPerPage={(newPerPage: number, page: number) => {
                setRowsPerPage(newPerPage);
                setCurrentPage(page);
              }}
              paginationPerPage={rowsPerPage}
              paginationRowsPerPageOptions={[10, 20, 50]}
              highlightOnHover
              responsive
              persistTableHead
              noDataComponent={
                <div className="py-12 text-center">
                  <CalendarClock className="w-8 h-8 text-black/15 mx-auto mb-3" />
                  <p className="text-xs text-black/40 tracking-wide">No appointments found.</p>
                </div>
              }
            />
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedAppointment && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setSelectedAppointment(null)}
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
                  <h2 className="text-sm font-light tracking-tight text-black">Appointment Details</h2>
                  <p className="text-[10px] text-black/40 mt-0.5 uppercase tracking-widest">
                    {selectedAppointment.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="p-1.5 hover:bg-black/5 transition-colors text-black/50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                <StatusBadge status={selectedAppointment.status} />

                <section>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-black/30 mb-3">Client</p>
                  <div className="space-y-3">
                    <Row label="Name" value={selectedAppointment.name} />
                    <Row label="Email" value={selectedAppointment.email} />
                    <Row label="Phone" value={selectedAppointment.phone} />
                  </div>
                </section>

                <div className="w-full h-px bg-black/5" />

                <section>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-black/30 mb-3">Appointment</p>
                  <div className="space-y-3">
                    <Row label="Type" value={selectedAppointment.type.replace(/-/g, " ")} />
                    <Row label="Service" value={selectedAppointment.service} />
                    <Row
                      label="Scheduled"
                      value={new Date(selectedAppointment.scheduledAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    />
                  </div>
                </section>

                {selectedAppointment.notes && (
                  <>
                    <div className="w-full h-px bg-black/5" />
                    <section>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-black/30 mb-3">Notes</p>
                      <p className="text-xs text-black/70 font-light leading-relaxed">
                        {selectedAppointment.notes}
                      </p>
                    </section>
                  </>
                )}
              </div>

              <div className="px-6 py-4 border-t border-black/10 shrink-0 flex gap-3">
                <button
                  onClick={() => {
                    setEmailModalAppointment(selectedAppointment);
                    setSelectedAppointment(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-black text-white text-sm hover:bg-black/80 transition"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Send Email
                </button>
                <button
                  onClick={() => {
                    setMeetingModalAppointment(selectedAppointment);
                    setSelectedAppointment(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1a73e8] text-white text-sm hover:bg-[#1557b0] transition"
                >
                  <Video className="w-3.5 h-3.5" />
                  Schedule Meet
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {emailModalAppointment && (
        <SendEmailModal
          appointment={emailModalAppointment}
          onClose={() => setEmailModalAppointment(null)}
        />
      )}

      {meetingModalAppointment && (
        <ScheduleMeetingModal
          appointment={meetingModalAppointment}
          onClose={() => setMeetingModalAppointment(null)}
        />
      )}
    </DashboardLayout>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-4">
    <span className="text-[10px] uppercase tracking-[0.1em] text-black/30 shrink-0 pt-0.5">{label}</span>
    <span className="text-xs text-black/70 font-light text-right">{value}</span>
  </div>
);

export default Appointments;
