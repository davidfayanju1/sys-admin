import { useState, useMemo } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  Users,
  Shield,
  UserCheck,
  UserX,
  Search,
  Plus,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  X,
  Mail,
  Phone,
  Lock,
  Pencil,
  RefreshCw,
} from "lucide-react";
import RowActionMenu from "../components/UI/RowActionMenu";
import DataTableComponent, { type TableColumn } from "react-data-table-component";
import { AnimatePresence, motion } from "framer-motion";
import StatCard from "../components/UI/StatCard";
import Skeleton from "../components/UI/Skeleton";
import {
  useStaff,
  useStaffRoles,
  useStaffStats,
  useStaffById,
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
  useDeactivateStaff,
  useActivateStaff,
} from "../hooks/useStaff";
import type { StaffUser } from "../types/staff";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataTable = (DataTableComponent as any).default ?? DataTableComponent;

const getRoleBadge = (role: string) => {
  const map: Record<string, string> = {
    superadmin: "bg-black text-white",
    admin: "bg-blue-100 text-blue-700",
    editor: "bg-purple-100 text-purple-700",
    client: "bg-gray-100 text-gray-600",
  };
  return map[role?.toLowerCase()] ?? "bg-gray-100 text-gray-600";
};

const getRoleLabel = (role: string) => {
  const map: Record<string, string> = {
    superadmin: "Super Admin",
    admin: "Admin",
    editor: "Editor",
    client: "Client",
  };
  return map[role?.toLowerCase()] ?? role;
};

const statusBadge = (isActive: boolean) =>
  isActive
    ? { label: "Active", cls: "bg-green-100 text-green-700" }
    : { label: "Inactive", cls: "bg-gray-100 text-gray-500" };

const customStyles = {
  table: {
    style: { backgroundColor: "transparent", borderRadius: "0px" },
  },
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

const TableSkeleton = () => (
  <div className="p-5 space-y-4">
    <div className="flex items-center gap-4 pb-3 border-b border-black/5">
      {["w-40", "w-36", "w-24", "w-20", "w-16", "w-20", "w-20", "w-24"].map(
        (cls, i) => (
          <Skeleton key={i} className={`${cls} h-3 rounded-sm`} />
        ),
      )}
    </div>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <div className="flex items-center gap-2 w-40 shrink-0">
          <Skeleton className="w-8 h-8 rounded-sm shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="w-24 h-3 rounded-sm" />
            <Skeleton className="w-14 h-2 rounded-sm" />
          </div>
        </div>
        <Skeleton className="w-36 h-3 rounded-sm" />
        <Skeleton className="w-24 h-3 rounded-sm" />
        <Skeleton className="w-20 h-5 rounded-sm" />
        <Skeleton className="w-16 h-5 rounded-sm" />
        <Skeleton className="w-20 h-3 rounded-sm" />
        <Skeleton className="w-20 h-3 rounded-sm" />
        <div className="flex gap-1">
          <Skeleton className="w-6 h-6 rounded-sm" />
          <Skeleton className="w-6 h-6 rounded-sm" />
          <Skeleton className="w-6 h-6 rounded-sm" />
        </div>
      </div>
    ))}
  </div>
);

const FALLBACK_ROLES = [
  { value: "client", label: "Client" },
  { value: "editor", label: "Editor" },
  { value: "admin", label: "Admin" },
  { value: "superadmin", label: "Super Admin" },
];

const emptyAdd = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  role: "client",
};

const emptyEdit = { firstName: "", lastName: "", phone: "", role: "client" };

const Staffs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [viewUserId, setViewUserId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<StaffUser | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddPassword, setShowAddPassword] = useState(false);

  const [addForm, setAddForm] = useState(emptyAdd);
  const [editForm, setEditForm] = useState(emptyEdit);

  const { data: staffData, isLoading } = useStaff(
    currentPage,
    rowsPerPage,
    searchTerm || undefined,
    roleFilter,
    statusFilter,
  );
  const { data: roles = [] } = useStaffRoles();
  const stats = useStaffStats();
  const { data: viewData, isLoading: isLoadingView } = useStaffById(viewUserId);

  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();
  const deleteStaff = useDeleteStaff();
  const deactivateStaff = useDeactivateStaff();
  const activateStaff = useActivateStaff();

  const users = staffData?.data?.users ?? [];
  const totalRows = staffData?.meta?.total ?? 0;
  const roleOptions = roles.length > 0 ? roles : FALLBACK_ROLES;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleOpenEdit = (user: StaffUser) => {
    setEditingUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone ?? "",
      role: user.role,
    });
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;
    updateStaff.mutate(
      { id: editingUser.id, payload: editForm },
      { onSuccess: () => setEditingUser(null) },
    );
  };

  const handleCreate = () => {
    if (
      !addForm.firstName ||
      !addForm.lastName ||
      !addForm.email ||
      !addForm.password
    )
      return;
    createStaff.mutate(addForm, {
      onSuccess: () => {
        setShowAddModal(false);
        setAddForm(emptyAdd);
        setShowAddPassword(false);
      },
    });
  };

  const handleConfirmDelete = () => {
    if (!deletingUser) return;
    deleteStaff.mutate(deletingUser.id, {
      onSuccess: () => setDeletingUser(null),
    });
  };

  const columns: TableColumn<StaffUser>[] = useMemo(
    () => [
      {
        name: "S/N",
        width: "60px",
        center: true,
        cell: (_row: StaffUser, rowIndex: number) => (
          <span className="text-xs text-black/40 font-light">
            {(currentPage - 1) * rowsPerPage + rowIndex + 1}
          </span>
        ),
      },
      {
        name: "Staff Member",
        selector: (row) => row.fullName,
        sortable: true,
        minWidth: "200px",
        cell: (row) => (
          <div className="flex items-center gap-3 py-1">
            {row.avatar ? (
              <img
                src={row.avatar}
                alt={row.fullName}
                className="w-8 h-8 object-cover border border-black/10 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 bg-black/5 border border-black/10 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-medium text-black/60 uppercase">
                  {row.firstName?.charAt(0)}
                  {row.lastName?.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-black leading-tight">
                {row.fullName}
              </p>
              <p className="text-[10px] text-black/30 mt-0.5 font-light">
                #{row.id?.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
        ),
      },
      {
        name: "Email",
        selector: (row) => row.email,
        sortable: true,
        minWidth: "200px",
        cell: (row) => (
          <span className="text-xs text-black/60 font-light">{row.email}</span>
        ),
      },
      {
        name: "Phone",
        selector: (row) => row.phone ?? "",
        width: "140px",
        cell: (row) => (
          <span className="text-xs text-black/50 font-light">
            {row.phone || "—"}
          </span>
        ),
      },
      {
        name: "Role",
        selector: (row) => row.role,
        sortable: true,
        width: "120px",
        cell: (row) => (
          <span
            className={`inline-flex px-2 py-0.5 text-[9px] uppercase tracking-wide font-medium ${getRoleBadge(row.role)}`}
          >
            {getRoleLabel(row.role)}
          </span>
        ),
      },
      {
        name: "Status",
        selector: (row) => (row.isActive ? "active" : "inactive"),
        sortable: true,
        width: "100px",
        cell: (row) => {
          const s = statusBadge(row.isActive);
          return (
            <span
              className={`inline-flex px-2 py-0.5 text-[9px] uppercase tracking-wide font-medium ${s.cls}`}
            >
              {s.label}
            </span>
          );
        },
      },
      {
        name: "Joined",
        selector: (row) => row.createdAt,
        sortable: true,
        width: "100px",
        cell: (row) => (
          <span className="text-xs text-black/40 font-light">
            {new Date(row.createdAt).toLocaleDateString()}
          </span>
        ),
      },
      {
        name: "Last Login",
        selector: (row) => row.lastLoginAt ?? "",
        sortable: true,
        width: "100px",
        cell: (row) => (
          <span className="text-xs text-black/40 font-light">
            {row.lastLoginAt
              ? new Date(row.lastLoginAt).toLocaleDateString()
              : "Never"}
          </span>
        ),
      },
      {
        name: "Actions",
        center: true,
        width: "70px",
        cell: (row) => (
          <RowActionMenu
            actions={[
              { icon: Eye, label: "View Details", onClick: () => setViewUserId(row.id) },
              { icon: Edit, label: "Edit", onClick: () => handleOpenEdit(row), hidden: !row.actions?.canEdit },
              { icon: UserX, label: "Deactivate", onClick: () => deactivateStaff.mutate(row.id), disabled: deactivateStaff.isPending, hidden: !row.actions?.canDeactivate },
              { icon: UserCheck, label: "Activate", onClick: () => activateStaff.mutate(row.id), disabled: activateStaff.isPending, hidden: !row.actions?.canActivate },
              { icon: Trash2, label: "Delete", onClick: () => setDeletingUser(row), destructive: true, hidden: !row.actions?.canDelete },
            ]}
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPage, rowsPerPage, deactivateStaff.isPending, activateStaff.isPending],
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-black">
              Staff
            </h1>
            <div className="w-12 h-px bg-black/10 mt-2" />
            <p className="text-xs text-black/50 mt-3 font-light">
              Manage admin users, roles, and access levels
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm hover:bg-black/90 transition"
          >
            <Plus className="w-4 h-4" />
            Add Staff
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Total Staff"
            value={stats.total.data ?? 0}
            loading={stats.total.isLoading}
            delay={0}
          />
          <StatCard
            icon={UserCheck}
            label="Active"
            value={stats.active.data ?? 0}
            loading={stats.active.isLoading}
            delay={0.05}
          />
          <StatCard
            icon={Shield}
            label="Admins"
            value={stats.admins.data ?? 0}
            loading={stats.admins.isLoading}
            delay={0.1}
          />
          <StatCard
            icon={Pencil}
            label="Editors"
            value={stats.editors.data ?? 0}
            loading={stats.editors.isLoading}
            delay={0.15}
          />
        </div>

        {/* Filters */}
        <div className="bg-white border border-black/10 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <form
              onSubmit={handleSearch}
              className="relative flex-1 max-w-sm"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (!e.target.value) {
                    setSearchTerm("");
                    setCurrentPage(1);
                  }
                }}
                className="w-full pl-10 pr-4 py-2 border border-black/10 text-sm focus:outline-none focus:border-black transition bg-transparent"
              />
            </form>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-black/10 focus:border-black outline-none text-sm bg-white text-black/70"
            >
              <option value="all">All Roles</option>
              {roleOptions.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-black/10 focus:border-black outline-none text-sm bg-white text-black/70"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-black/10">
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <DataTable
              columns={columns}
              data={users}
              customStyles={customStyles}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              paginationPerPage={rowsPerPage}
              paginationRowsPerPageOptions={[10, 20, 50]}
              onChangePage={(page: number) => setCurrentPage(page)}
              onChangeRowsPerPage={(newPerPage: number, page: number) => {
                setRowsPerPage(newPerPage);
                setCurrentPage(page);
              }}
              highlightOnHover
              responsive
              persistTableHead
              noDataComponent={
                <div className="py-12 text-center">
                  <p className="text-xs text-black/40 tracking-wide">
                    No staff members found
                  </p>
                </div>
              }
            />
          )}
        </div>
      </div>

      {/* ───── Add Staff Modal ───── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="bg-white w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-black/10 sticky top-0 bg-white z-10">
                <div>
                  <h3 className="text-sm font-light tracking-wide">
                    Add Staff Member
                  </h3>
                  <p className="text-[10px] text-black/40 mt-0.5">
                    Fill in the details below
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setAddForm(emptyAdd);
                    setShowAddPassword(false);
                  }}
                  className="p-1.5 hover:bg-black/5 transition"
                >
                  <X className="w-4 h-4 text-black/60" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.15em] text-black/50 mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={addForm.firstName}
                      onChange={(e) =>
                        setAddForm({ ...addForm, firstName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-black/10 text-sm focus:outline-none focus:border-black"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.15em] text-black/50 mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={addForm.lastName}
                      onChange={(e) =>
                        setAddForm({ ...addForm, lastName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-black/10 text-sm focus:outline-none focus:border-black"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-[0.15em] text-black/50 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                    <input
                      type="email"
                      value={addForm.email}
                      onChange={(e) =>
                        setAddForm({ ...addForm, email: e.target.value })
                      }
                      className="w-full pl-9 pr-4 py-2 border border-black/10 text-sm focus:outline-none focus:border-black"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-[0.15em] text-black/50 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                    <input
                      type="tel"
                      value={addForm.phone}
                      onChange={(e) =>
                        setAddForm({ ...addForm, phone: e.target.value })
                      }
                      className="w-full pl-9 pr-4 py-2 border border-black/10 text-sm focus:outline-none focus:border-black"
                      placeholder="+234..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-[0.15em] text-black/50 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                    <input
                      type={showAddPassword ? "text" : "password"}
                      value={addForm.password}
                      onChange={(e) =>
                        setAddForm({ ...addForm, password: e.target.value })
                      }
                      className="w-full pl-9 pr-10 py-2 border border-black/10 text-sm focus:outline-none focus:border-black"
                      placeholder="Min. 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAddPassword(!showAddPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60 transition"
                    >
                      {showAddPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-[0.15em] text-black/50 mb-1.5">
                    Role
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                    <select
                      value={addForm.role}
                      onChange={(e) =>
                        setAddForm({ ...addForm, role: e.target.value })
                      }
                      className="w-full pl-9 pr-4 py-2 border border-black/10 text-sm focus:outline-none focus:border-black bg-white appearance-none"
                    >
                      {roleOptions.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-[8px] text-black/30 mt-1 tracking-wide">
                    A verification email will be sent to this address
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-5 border-t border-black/10 sticky bottom-0 bg-white">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setAddForm(emptyAdd);
                    setShowAddPassword(false);
                  }}
                  className="flex-1 py-2.5 border border-black/10 text-sm text-black/60 hover:border-black transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={
                    createStaff.isPending ||
                    !addForm.firstName ||
                    !addForm.lastName ||
                    !addForm.email ||
                    !addForm.password
                  }
                  className="flex-1 py-2.5 bg-black text-white text-sm hover:bg-black/90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {createStaff.isPending && (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  )}
                  {createStaff.isPending ? "Creating..." : "Add Staff Member"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ───── View Staff Modal ───── */}
      <AnimatePresence>
        {viewUserId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="bg-white w-full max-w-sm mx-4"
            >
              <div className="flex items-center justify-between p-5 border-b border-black/10">
                <h3 className="text-sm font-light tracking-wide">
                  Staff Details
                </h3>
                <button
                  onClick={() => setViewUserId(null)}
                  className="p-1.5 hover:bg-black/5 transition"
                >
                  <X className="w-4 h-4 text-black/60" />
                </button>
              </div>

              {isLoadingView ? (
                <div className="p-5 space-y-4">
                  <div className="flex flex-col items-center gap-3 pb-5 border-b border-black/5">
                    <Skeleton className="w-16 h-16" />
                    <Skeleton className="w-28 h-4 rounded-sm" />
                    <Skeleton className="w-16 h-5 rounded-sm" />
                  </div>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="w-20 h-3 rounded-sm" />
                      <Skeleton className="w-28 h-3 rounded-sm" />
                    </div>
                  ))}
                </div>
              ) : viewData?.user ? (
                <>
                  <div className="flex flex-col items-center pt-6 pb-5 px-5 border-b border-black/5">
                    {viewData.user.avatar ? (
                      <img
                        src={viewData.user.avatar}
                        alt={viewData.user.fullName}
                        className="w-16 h-16 object-cover border border-black/10 mb-3"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-black/5 border border-black/10 flex items-center justify-center mb-3">
                        <span className="text-xl font-light text-black/60 uppercase">
                          {viewData.user.firstName?.charAt(0)}
                          {viewData.user.lastName?.charAt(0)}
                        </span>
                      </div>
                    )}
                    <p className="text-sm font-light text-black">
                      {viewData.user.fullName}
                    </p>
                    <span
                      className={`mt-2 inline-flex px-2 py-0.5 text-[9px] uppercase tracking-wide font-medium ${getRoleBadge(viewData.user.role)}`}
                    >
                      {getRoleLabel(viewData.user.role)}
                    </span>
                  </div>

                  <div className="p-5 space-y-3.5">
                    {(
                      [
                        { label: "Email", value: viewData.user.email },
                        { label: "Phone", value: viewData.user.phone || "—" },
                        {
                          label: "Status",
                          value: (
                            <span
                              className={`inline-flex px-2 py-0.5 text-[9px] uppercase tracking-wide font-medium ${statusBadge(viewData.user.isActive).cls}`}
                            >
                              {statusBadge(viewData.user.isActive).label}
                            </span>
                          ),
                        },
                        {
                          label: "Email Verified",
                          value: viewData.user.isEmailVerified ? "Yes" : "No",
                        },
                        {
                          label: "Joined",
                          value: new Date(
                            viewData.user.createdAt,
                          ).toLocaleDateString(),
                        },
                        {
                          label: "Last Login",
                          value: viewData.user.lastLoginAt
                            ? new Date(
                                viewData.user.lastLoginAt,
                              ).toLocaleDateString()
                            : "Never",
                        },
                      ] as { label: string; value: React.ReactNode }[]
                    ).map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex justify-between items-center"
                      >
                        <span className="text-[9px] uppercase tracking-[0.15em] text-black/40">
                          {label}
                        </span>
                        <span className="text-xs text-black font-light">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 p-5 border-t border-black/10">
                    <button
                      onClick={() => setViewUserId(null)}
                      className="flex-1 py-2.5 border border-black/10 text-sm text-black/60 hover:border-black transition"
                    >
                      Close
                    </button>
                    {viewData.user.actions?.canEdit && (
                      <button
                        onClick={() => {
                          setViewUserId(null);
                          handleOpenEdit(viewData.user);
                        }}
                        className="flex-1 py-2.5 bg-black text-white text-sm hover:bg-black/90 transition"
                      >
                        Edit Staff
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-10 text-center">
                  <p className="text-xs text-black/40">
                    Failed to load user details
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ───── Edit Staff Modal ───── */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="bg-white w-full max-w-md mx-4"
            >
              <div className="flex items-center justify-between p-5 border-b border-black/10">
                <div>
                  <h3 className="text-sm font-light tracking-wide">
                    Edit Staff Member
                  </h3>
                  <p className="text-[10px] text-black/40 mt-0.5">
                    {editingUser.fullName}
                  </p>
                </div>
                <button
                  onClick={() => setEditingUser(null)}
                  className="p-1.5 hover:bg-black/5 transition"
                >
                  <X className="w-4 h-4 text-black/60" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.15em] text-black/50 mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) =>
                        setEditForm({ ...editForm, firstName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-black/10 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.15em] text-black/50 mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) =>
                        setEditForm({ ...editForm, lastName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-black/10 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-[0.15em] text-black/50 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      className="w-full pl-9 pr-4 py-2 border border-black/10 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-[0.15em] text-black/50 mb-1.5">
                    Role
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                    <select
                      value={editForm.role}
                      onChange={(e) =>
                        setEditForm({ ...editForm, role: e.target.value })
                      }
                      className="w-full pl-9 pr-4 py-2 border border-black/10 text-sm focus:outline-none focus:border-black bg-white appearance-none"
                    >
                      {roleOptions.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-[0.15em] text-black/50 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingUser.email}
                    disabled
                    className="w-full px-3 py-2 border border-black/10 text-sm bg-black/2 text-black/40 cursor-not-allowed outline-none"
                  />
                  <p className="text-[8px] text-black/30 mt-1">
                    Email cannot be changed
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-5 border-t border-black/10">
                <button
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-2.5 border border-black/10 text-sm text-black/60 hover:border-black transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={updateStaff.isPending}
                  className="flex-1 py-2.5 bg-black text-white text-sm hover:bg-black/90 transition disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {updateStaff.isPending && (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  )}
                  {updateStaff.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ───── Delete Confirm Modal ───── */}
      <AnimatePresence>
        {deletingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="relative bg-white w-full max-w-sm mx-4 p-6"
            >
              <button
                onClick={() => setDeletingUser(null)}
                disabled={deleteStaff.isPending}
                className="absolute top-4 right-4 text-black/40 hover:text-black/60 transition"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-red-50 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-sm font-light text-black">
                  Delete Staff Member
                </h3>
                <p className="text-xs text-black/40 mt-2 leading-relaxed">
                  Are you sure you want to permanently delete{" "}
                  <span className="font-medium text-black/70">
                    {deletingUser.fullName}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingUser(null)}
                  disabled={deleteStaff.isPending}
                  className="flex-1 py-2.5 border border-black/20 text-sm text-black/60 hover:border-black/40 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteStaff.isPending}
                  className="flex-1 py-2.5 bg-red-600 text-white text-sm hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleteStaff.isPending && (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  )}
                  {deleteStaff.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Staffs;
