import { useState, useMemo } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  Users,
  Shield,
  UserCheck,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  X,
  Mail,
  Phone,
  Pencil,
} from "lucide-react";
import DataTableComponent, { type TableColumn } from "react-data-table-component";
import { AnimatePresence, motion } from "framer-motion";
import StatCard from "../components/UI/StatCard";

const DataTable = (DataTableComponent as any).default || DataTableComponent;

type Role = "superadmin" | "admin" | "editor" | "client";
type StaffStatus = "active" | "inactive" | "suspended";

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Role;
  status: StaffStatus;
  createdAt: string;
  lastLogin: string;
}

const roleConfig: Record<Role, { label: string; className: string }> = {
  superadmin: { label: "Super Admin", className: "bg-black text-white" },
  admin: { label: "Admin", className: "bg-blue-100 text-blue-700" },
  editor: { label: "Editor", className: "bg-purple-100 text-purple-700" },
  client: { label: "Client", className: "bg-gray-100 text-gray-600" },
};

const statusConfig: Record<StaffStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-green-100 text-green-700" },
  inactive: { label: "Inactive", className: "bg-gray-100 text-gray-500" },
  suspended: { label: "Suspended", className: "bg-yellow-100 text-yellow-700" },
};

const initialStaff: Staff[] = [
  {
    id: "STF-001",
    firstName: "David",
    lastName: "Fayanju",
    email: "david@sysempire.com",
    phone: "+2348161525506",
    role: "superadmin",
    status: "active",
    createdAt: "2024-01-01",
    lastLogin: "2024-06-14",
  },
  {
    id: "STF-002",
    firstName: "Amaka",
    lastName: "Okonkwo",
    email: "amaka@sysempire.com",
    phone: "+2348031234567",
    role: "admin",
    status: "active",
    createdAt: "2024-01-15",
    lastLogin: "2024-06-13",
  },
  {
    id: "STF-003",
    firstName: "Chidi",
    lastName: "Nwosu",
    email: "chidi@sysempire.com",
    phone: "+2348097654321",
    role: "editor",
    status: "active",
    createdAt: "2024-02-01",
    lastLogin: "2024-06-12",
  },
  {
    id: "STF-004",
    firstName: "Ngozi",
    lastName: "Adeyemi",
    email: "ngozi@sysempire.com",
    phone: "+2347011223344",
    role: "editor",
    status: "active",
    createdAt: "2024-02-10",
    lastLogin: "2024-06-10",
  },
  {
    id: "STF-005",
    firstName: "Emeka",
    lastName: "Eze",
    email: "emeka@sysempire.com",
    phone: "+2348155667788",
    role: "admin",
    status: "inactive",
    createdAt: "2024-03-01",
    lastLogin: "2024-05-20",
  },
  {
    id: "STF-006",
    firstName: "Funmi",
    lastName: "Bello",
    email: "funmi@sysempire.com",
    phone: "+2348166778899",
    role: "editor",
    status: "suspended",
    createdAt: "2024-03-15",
    lastLogin: "2024-04-30",
  },
  {
    id: "STF-007",
    firstName: "Kelechi",
    lastName: "Okoro",
    email: "kelechi@sysempire.com",
    phone: "+2348122334455",
    role: "client",
    status: "active",
    createdAt: "2024-04-01",
    lastLogin: "2024-06-11",
  },
  {
    id: "STF-008",
    firstName: "Tola",
    lastName: "Adesanya",
    email: "tola@sysempire.com",
    phone: "+2348133445566",
    role: "admin",
    status: "active",
    createdAt: "2024-04-15",
    lastLogin: "2024-06-14",
  },
  {
    id: "STF-009",
    firstName: "Biodun",
    lastName: "Adeleke",
    email: "biodun@sysempire.com",
    phone: "+2348144556677",
    role: "editor",
    status: "active",
    createdAt: "2024-05-01",
    lastLogin: "2024-06-09",
  },
  {
    id: "STF-010",
    firstName: "Seun",
    lastName: "Lawal",
    email: "seun@sysempire.com",
    phone: "+2348100112233",
    role: "client",
    status: "inactive",
    createdAt: "2024-05-20",
    lastLogin: "2024-06-01",
  },
];

const customStyles = {
  table: {
    style: { backgroundColor: "transparent", borderRadius: "0px" },
  },
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
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.02)",
        cursor: "pointer",
      },
      transition: "background-color 0.15s ease",
    },
  },
  cells: {
    style: { paddingLeft: "16px", paddingRight: "16px" },
  },
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
      "&:hover:not(:disabled)": {
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        fill: "rgba(0, 0, 0, 0.8)",
      },
      "&:disabled": {
        cursor: "default",
        fill: "rgba(0, 0, 0, 0.15)",
      },
    },
  },
  noData: {
    style: {
      padding: "32px",
      color: "rgba(0, 0, 0, 0.4)",
      fontSize: "12px",
      fontWeight: "300",
    },
  },
};

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "editor" as Role,
  status: "active" as StaffStatus,
};

const Staffs = () => {
  const [staffList, setStaffList] = useState<Staff[]>(initialStaff);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const summary = useMemo(
    () => ({
      total: staffList.length,
      active: staffList.filter((s) => s.status === "active").length,
      admins: staffList.filter(
        (s) => s.role === "admin" || s.role === "superadmin",
      ).length,
      editors: staffList.filter((s) => s.role === "editor").length,
    }),
    [staffList],
  );

  const filteredStaff = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return staffList.filter((s) => {
      const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.phone.includes(searchTerm);
      const matchesRole = roleFilter === "all" || s.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [staffList, searchTerm, roleFilter, statusFilter]);

  const handleAddStaff = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) return;
    const newStaff: Staff = {
      id: `STF-${String(staffList.length + 1).padStart(3, "0")}`,
      ...formData,
      createdAt: new Date().toISOString().split("T")[0],
      lastLogin: "Never",
    };
    setStaffList([newStaff, ...staffList]);
    setShowAddModal(false);
    setFormData(emptyForm);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Remove this staff member?")) {
      setStaffList((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleViewStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    setShowViewModal(true);
  };

  const columns: TableColumn<Staff>[] = useMemo(
    () => [
      {
        name: "Staff Member",
        selector: (row) => row.firstName,
        sortable: true,
        cell: (row) => (
          <div className="flex items-center gap-3 py-1">
            <div className="w-8 h-8 bg-black/5 border border-black/10 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-medium text-black/60 uppercase">
                {row.firstName.charAt(0)}
                {row.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-black">
                {row.firstName} {row.lastName}
              </p>
              <p className="text-[10px] text-black/30 mt-0.5">{row.id}</p>
            </div>
          </div>
        ),
        minWidth: "190px",
      },
      {
        name: "Email",
        selector: (row) => row.email,
        sortable: true,
        cell: (row) => (
          <span className="text-xs text-black/60 font-light">{row.email}</span>
        ),
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
        name: "Role",
        selector: (row) => row.role,
        sortable: true,
        cell: (row) => {
          const cfg = roleConfig[row.role];
          return (
            <span
              className={`inline-flex px-2 py-0.5 text-[9px] uppercase tracking-wide font-medium ${cfg.className}`}
            >
              {cfg.label}
            </span>
          );
        },
        width: "120px",
      },
      {
        name: "Status",
        selector: (row) => row.status,
        sortable: true,
        cell: (row) => {
          const cfg = statusConfig[row.status];
          return (
            <span
              className={`inline-flex px-2 py-0.5 text-[9px] uppercase tracking-wide font-medium ${cfg.className}`}
            >
              {cfg.label}
            </span>
          );
        },
        width: "110px",
      },
      {
        name: "Joined",
        selector: (row) => row.createdAt,
        sortable: true,
        cell: (row) => (
          <span className="text-xs text-black/40 font-light">
            {new Date(row.createdAt).toLocaleDateString()}
          </span>
        ),
        width: "110px",
      },
      {
        name: "Last Login",
        selector: (row) => row.lastLogin,
        sortable: true,
        cell: (row) => (
          <span className="text-xs text-black/40 font-light">
            {row.lastLogin === "Never"
              ? "Never"
              : new Date(row.lastLogin).toLocaleDateString()}
          </span>
        ),
        width: "110px",
      },
      {
        name: "Actions",
        center: true,
        cell: (row) => (
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => handleViewStaff(row)}
              className="p-1.5 hover:bg-black/5 transition text-black/40 hover:text-black"
              title="View"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              className="p-1.5 hover:bg-black/5 transition text-black/40 hover:text-black"
              title="Edit"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="p-1.5 hover:bg-red-50 transition text-black/40 hover:text-red-500"
              title="Remove"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ),
        width: "110px",
      },
    ],
    [staffList],
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
            <p className="text-xs text-black/50 mt-3">
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
            value={summary.total}
            delay={0}
          />
          <StatCard
            icon={UserCheck}
            label="Active"
            value={summary.active}
            delay={0.05}
          />
          <StatCard
            icon={Shield}
            label="Admins"
            value={summary.admins}
            delay={0.1}
          />
          <StatCard
            icon={Pencil}
            label="Editors"
            value={summary.editors}
            delay={0.15}
          />
        </div>

        {/* Filters */}
        <div className="bg-white border border-black/10 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-black/10 text-sm focus:outline-none focus:border-black transition bg-transparent"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-black/10 focus:border-black outline-none text-sm bg-white text-black/70"
            >
              <option value="all">All Roles</option>
              <option value="superadmin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="client">Client</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-black/10 focus:border-black outline-none text-sm bg-white text-black/70"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-black/10">
          <DataTable
            columns={columns}
            data={filteredStaff}
            customStyles={customStyles}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20, 50]}
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
        </div>
      </div>

      {/* Add Staff Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md mx-4"
            >
              <div className="flex items-center justify-between p-5 border-b border-black/10">
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
                    setFormData(emptyForm);
                  }}
                  className="p-1.5 hover:bg-black/5 transition"
                >
                  <X className="w-4 h-4 text-black/60" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Name row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.15em] text-black/50 mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
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
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-black/10 text-sm focus:outline-none focus:border-black"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.15em] text-black/50 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full pl-9 pr-4 py-2 border border-black/10 text-sm focus:outline-none focus:border-black"
                      placeholder="name@sysempire.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.15em] text-black/50 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full pl-9 pr-4 py-2 border border-black/10 text-sm focus:outline-none focus:border-black"
                      placeholder="+234..."
                    />
                  </div>
                </div>

                {/* Role + Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.15em] text-black/50 mb-1.5">
                      Role
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                      <select
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            role: e.target.value as Role,
                          })
                        }
                        className="w-full pl-9 pr-4 py-2 border border-black/10 text-sm focus:outline-none focus:border-black bg-white appearance-none"
                      >
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                        <option value="client">Client</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.15em] text-black/50 mb-1.5">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as StaffStatus,
                        })
                      }
                      className="w-full px-3 py-2 border border-black/10 text-sm focus:outline-none focus:border-black bg-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                {/* Role description hint */}
                <div className="bg-black/2 border border-black/5 p-3">
                  <p className="text-[9px] uppercase tracking-[0.15em] text-black/40 mb-1">
                    Role Permissions
                  </p>
                  {formData.role === "superadmin" && (
                    <p className="text-[10px] text-black/50">
                      Full platform control — all features and settings
                    </p>
                  )}
                  {formData.role === "admin" && (
                    <p className="text-[10px] text-black/50">
                      Full dashboard access — cannot manage other admins
                    </p>
                  )}
                  {formData.role === "editor" && (
                    <p className="text-[10px] text-black/50">
                      Manage content, products, and collections only
                    </p>
                  )}
                  {formData.role === "client" && (
                    <p className="text-[10px] text-black/50">
                      Customer-level access — shop and order only
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 p-5 border-t border-black/10">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData(emptyForm);
                  }}
                  className="flex-1 py-2.5 border border-black/10 text-sm text-black/60 hover:border-black transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStaff}
                  disabled={
                    !formData.firstName || !formData.lastName || !formData.email
                  }
                  className="flex-1 py-2.5 bg-black text-white text-sm hover:bg-black/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Add Staff Member
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Staff Modal */}
      <AnimatePresence>
        {showViewModal && selectedStaff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-sm mx-4"
            >
              <div className="flex items-center justify-between p-5 border-b border-black/10">
                <h3 className="text-sm font-light tracking-wide">
                  Staff Details
                </h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-1.5 hover:bg-black/5 transition"
                >
                  <X className="w-4 h-4 text-black/60" />
                </button>
              </div>

              {/* Avatar block */}
              <div className="flex flex-col items-center pt-6 pb-5 px-5 border-b border-black/5">
                <div className="w-16 h-16 bg-black/5 border border-black/10 flex items-center justify-center mb-3">
                  <span className="text-xl font-light text-black/60 uppercase">
                    {selectedStaff.firstName.charAt(0)}
                    {selectedStaff.lastName.charAt(0)}
                  </span>
                </div>
                <p className="text-sm font-light text-black">
                  {selectedStaff.firstName} {selectedStaff.lastName}
                </p>
                <span
                  className={`mt-2 inline-flex px-2 py-0.5 text-[9px] uppercase tracking-wide font-medium ${roleConfig[selectedStaff.role].className}`}
                >
                  {roleConfig[selectedStaff.role].label}
                </span>
              </div>

              {/* Detail rows */}
              <div className="p-5 space-y-3.5">
                {(
                  [
                    { label: "Staff ID", value: selectedStaff.id },
                    { label: "Email", value: selectedStaff.email },
                    { label: "Phone", value: selectedStaff.phone },
                    {
                      label: "Status",
                      value: (
                        <span
                          className={`inline-flex px-2 py-0.5 text-[9px] uppercase tracking-wide font-medium ${statusConfig[selectedStaff.status].className}`}
                        >
                          {statusConfig[selectedStaff.status].label}
                        </span>
                      ),
                    },
                    {
                      label: "Joined",
                      value: new Date(
                        selectedStaff.createdAt,
                      ).toLocaleDateString(),
                    },
                    {
                      label: "Last Login",
                      value:
                        selectedStaff.lastLogin === "Never"
                          ? "Never"
                          : new Date(
                              selectedStaff.lastLogin,
                            ).toLocaleDateString(),
                    },
                  ] as { label: string; value: React.ReactNode }[]
                ).map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-[9px] uppercase tracking-[0.15em] text-black/40">
                      {label}
                    </span>
                    <span className="text-xs text-black">{value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 p-5 border-t border-black/10">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="flex-1 py-2.5 border border-black/10 text-sm text-black/60 hover:border-black transition"
                >
                  Close
                </button>
                <button className="flex-1 py-2.5 bg-black text-white text-sm hover:bg-black/90 transition">
                  Edit Staff
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
