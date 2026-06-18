import { useState, useMemo } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  Layers,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  ListChecks,
  X,
  RefreshCw,
  AlertTriangle,
  Smile,
  DollarSign,
} from "lucide-react";
import ImageUpload, { ImagePlaceholder } from "../components/UI/ImageUpload";
import RowActionMenu from "../components/UI/RowActionMenu";
import DataTableComponent, {
  type TableColumn,
} from "react-data-table-component";
import {
  useServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
  type Service,
  type ServicePayload,
} from "../hooks/useServices";
import StatCard from "../components/UI/StatCard";
import { TableSkeleton } from "../components/skeleton-loaders/OrderDetailsModalSkeleton";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

const DataTable = (DataTableComponent as any).default || DataTableComponent;

const formatPrice = (price: number, currency = "NGN") =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);

const StatusBadge = ({ active }: { active: boolean }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-1 text-[9px] uppercase tracking-wide font-medium ${
      active
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {active ? (
      <CheckCircle2 className="w-3 h-3" />
    ) : (
      <XCircle className="w-3 h-3" />
    )}
    {active ? "Active" : "Inactive"}
  </span>
);

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
      "&:hover:not(:disabled)": { backgroundColor: "rgba(0,0,0,0.04)", fill: "rgba(0,0,0,0.8)" },
      "&:disabled": { cursor: "default", fill: "rgba(0,0,0,0.15)" },
    },
  },
  noData: {
    style: { padding: "32px", color: "rgba(0,0,0,0.4)", fontSize: "12px", fontWeight: "300" },
  },
};

/* ── Blank form ── */
const blankForm = (): ServicePayload => ({
  name: "",
  summary: "",
  description: "",
  icon: "",
  image: "",
  startingPrice: 0,
  features: [""],
});

/* ── Main page ── */
const Services = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [viewService, setViewService] = useState<Service | null>(null);
  const [editService, setEditService] = useState<Service | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const [form, setForm] = useState<ServicePayload>(blankForm());

  const { data: res, isLoading, error } = useServices(currentPage, rowsPerPage, searchTerm);
  const services = res?.data ?? [];
  const meta = res?.meta ?? { total: 0 };

  const activeCount = services.filter((s) => s.isActive).length;
  const inactiveCount = services.filter((s) => !s.isActive).length;

  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  /* ── search ── */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  /* ── open create modal ── */
  const openCreate = () => {
    setForm(blankForm());
    setShowCreate(true);
    setEditService(null);
  };

  /* ── open edit modal ── */
  const openEdit = (service: Service) => {
    setForm({
      name: service.name,
      summary: service.summary,
      description: service.description,
      icon: service.icon,
      image: service.image,
      startingPrice: service.startingPrice,
      features: service.features.length ? [...service.features] : [""],
    });
    setEditService(service);
    setShowCreate(false);
  };

  /* ── submit create / edit ── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ServicePayload = {
      ...form,
      features: form.features.filter((f) => f.trim() !== ""),
    };

    if (editService) {
      updateService.mutate(
        { id: editService._id, ...payload },
        {
          onSuccess: () => {
            toast.success("Service updated successfully");
            setEditService(null);
          },
          onError: () => toast.error("Failed to update service"),
        }
      );
    } else {
      createService.mutate(payload, {
        onSuccess: () => {
          toast.success("Service created successfully");
          setShowCreate(false);
          setForm(blankForm());
        },
        onError: () => toast.error("Failed to create service"),
      });
    }
  };

  /* ── delete ── */
  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteService.mutate(deleteTarget._id, {
      onSuccess: () => {
        toast.success(`"${deleteTarget.name}" deleted`);
        setDeleteTarget(null);
      },
      onError: () => toast.error("Failed to delete service"),
    });
  };

  /* ── feature list helpers ── */
  const addFeature = () => setForm((f) => ({ ...f, features: [...f.features, ""] }));
  const removeFeature = (i: number) =>
    setForm((f) => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));
  const updateFeature = (i: number, value: string) =>
    setForm((f) => {
      const copy = [...f.features];
      copy[i] = value;
      return { ...f, features: copy };
    });

  /* ── columns ── */
  const columns: TableColumn<Service>[] = useMemo(
    () => [
      {
        name: "S/N",
        width: "60px",
        center: true,
        cell: (_row: Service, rowIndex: number) => (
          <span className="text-xs text-black/40 font-light">
            {(currentPage - 1) * rowsPerPage + rowIndex + 1}
          </span>
        ),
      },
      {
        name: "Service",
        selector: (row) => row.name,
        sortable: true,
        cell: (row) => (
          <div className="py-1">
            <div className="flex items-center gap-2">
              {row.icon ? (
                <span className="text-base leading-none">{row.icon}</span>
              ) : (
                <div className="w-6 h-6 bg-black/5 flex items-center justify-center">
                  <Layers className="w-3 h-3 text-black/25" />
                </div>
              )}
              <p className="text-xs text-black/80 font-light">{row.name}</p>
            </div>
            <p className="text-[10px] text-black/35 font-light mt-0.5 pl-8">
              /{row.slug}
            </p>
          </div>
        ),
        minWidth: "220px",
      },
      {
        name: "Summary",
        selector: (row) => row.summary,
        cell: (row) => (
          <p className="text-xs text-black/55 font-light line-clamp-2 max-w-xs">
            {row.summary || "—"}
          </p>
        ),
        minWidth: "280px",
      },
      {
        name: "Starting Price",
        selector: (row) => row.startingPrice,
        sortable: true,
        cell: (row) => (
          <span className="text-xs text-black/70 font-light tabular-nums">
            {formatPrice(row.startingPrice, row.currency)}
          </span>
        ),
        width: "160px",
      },
      {
        name: "Features",
        center: true,
        cell: (row) => (
          <div className="flex items-center gap-1">
            <ListChecks className="w-3 h-3 text-black/30" />
            <span className="text-xs text-black/50 font-light">{row.features.length}</span>
          </div>
        ),
        width: "100px",
      },
      {
        name: "Order",
        selector: (row) => row.order,
        sortable: true,
        center: true,
        cell: (row) => (
          <span className="text-xs text-black/40 font-light tabular-nums">{row.order}</span>
        ),
        width: "80px",
      },
      {
        name: "Status",
        selector: (row) => (row.isActive ? "active" : "inactive"),
        sortable: true,
        cell: (row) => <StatusBadge active={row.isActive} />,
        width: "110px",
      },
      {
        name: "Actions",
        center: true,
        width: "80px",
        cell: (row) => (
          <RowActionMenu
            actions={[
              { icon: Eye, label: "View Details", onClick: () => setViewService(row) },
              { icon: Edit3, label: "Edit", onClick: () => openEdit(row) },
              { icon: Trash2, label: "Delete", onClick: () => setDeleteTarget(row), destructive: true },
            ]}
          />
        ),
      },
    ],
    [currentPage, rowsPerPage]
  );

  const isPending = createService.isPending || updateService.isPending;
  const isFormOpen = showCreate || !!editService;

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-black">Services</h1>
            <div className="w-12 h-px bg-black/10 mt-2" />
            <p className="text-xs text-black/50 mt-3">
              Manage the service offerings displayed on the website
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-black/80 transition text-sm"
          >
            <Plus className="w-4 h-4 text-white" />
            <span className="font-light text-white">Add Service</span>
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={Layers} label="Total Services" value={meta.total} loading={isLoading} />
          <StatCard icon={CheckCircle2} label="Active" value={activeCount} delay={0.05} loading={isLoading} />
          <StatCard icon={XCircle} label="Inactive" value={inactiveCount} delay={0.1} loading={isLoading} />
        </div>

        {/* Search */}
        <div className="bg-white border border-black/10 p-4">
          <form onSubmit={handleSearch} className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-black/10 focus:outline-none focus:border-black/30 text-sm font-light bg-transparent"
            />
            <button type="submit" className="hidden" />
          </form>
        </div>

        {/* Table */}
        <div className="bg-white border border-black/10">
          {isLoading ? (
            <TableSkeleton />
          ) : error ? (
            <div className="py-16 text-center">
              <AlertTriangle className="w-8 h-8 text-red-300 mx-auto mb-3" />
              <p className="text-xs text-black/40">Failed to load services.</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={services}
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
                <div className="py-16 text-center">
                  <Layers className="w-8 h-8 text-black/15 mx-auto mb-3" />
                  <p className="text-xs text-black/40 tracking-wide">No services found.</p>
                  <button
                    onClick={openCreate}
                    className="mt-4 flex items-center gap-1.5 text-xs text-black/60 hover:text-black transition mx-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create your first service
                  </button>
                </div>
              }
            />
          )}
        </div>
      </div>

      {/* ── View Drawer ── */}
      <AnimatePresence>
        {viewService && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setViewService(null)}
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
                    Service Details
                  </h2>
                  <p className="text-[10px] text-black/40 mt-0.5 uppercase tracking-widest">
                    /{viewService.slug}
                  </p>
                </div>
                <button
                  onClick={() => setViewService(null)}
                  className="p-1.5 hover:bg-black/5 transition text-black/50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                {/* Status */}
                <StatusBadge active={viewService.isActive} />

                {/* Image preview */}
                {viewService.image ? (
                  <div className="w-full aspect-video bg-black/5 overflow-hidden">
                    <img
                      src={viewService.image}
                      alt={viewService.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                ) : (
                  <ImagePlaceholder className="w-full aspect-video" />
                )}

                {/* Identity */}
                <section>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-black/30 mb-3">Identity</p>
                  <div className="space-y-3">
                    <DrawerRow label="Name" value={viewService.name} />
                    <DrawerRow label="Slug" value={`/${viewService.slug}`} />
                    <DrawerRow label="Icon" value={viewService.icon || "—"} />
                    <DrawerRow label="Order" value={String(viewService.order)} />
                  </div>
                </section>

                <div className="w-full h-px bg-black/5" />

                {/* Pricing */}
                <section>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-black/30 mb-3">Pricing</p>
                  <div className="space-y-3">
                    <DrawerRow
                      label="Starting Price"
                      value={formatPrice(viewService.startingPrice, viewService.currency)}
                    />
                    <DrawerRow label="Currency" value={viewService.currency} />
                  </div>
                </section>

                <div className="w-full h-px bg-black/5" />

                {/* Content */}
                <section>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-black/30 mb-3">Content</p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.1em] text-black/30 mb-1">Summary</p>
                      <p className="text-xs text-black/65 font-light leading-relaxed">
                        {viewService.summary || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.1em] text-black/30 mb-1">Description</p>
                      <p className="text-xs text-black/65 font-light leading-relaxed">
                        {viewService.description || "—"}
                      </p>
                    </div>
                  </div>
                </section>

                {viewService.features.length > 0 && (
                  <>
                    <div className="w-full h-px bg-black/5" />
                    <section>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-black/30 mb-3">
                        Features ({viewService.features.length})
                      </p>
                      <ul className="space-y-2">
                        {viewService.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3 h-3 text-black/30 mt-0.5 shrink-0" />
                            <span className="text-xs text-black/65 font-light">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </>
                )}

                <div className="w-full h-px bg-black/5" />

                <section>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-black/30 mb-3">Dates</p>
                  <div className="space-y-3">
                    <DrawerRow
                      label="Created"
                      value={new Date(viewService.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit", month: "long", year: "numeric",
                      })}
                    />
                    <DrawerRow
                      label="Updated"
                      value={new Date(viewService.updatedAt).toLocaleDateString("en-GB", {
                        day: "2-digit", month: "long", year: "numeric",
                      })}
                    />
                  </div>
                </section>
              </div>

              <div className="px-6 py-4 border-t border-black/10 shrink-0">
                <button
                  onClick={() => {
                    openEdit(viewService);
                    setViewService(null);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-black text-white text-sm hover:bg-black/80 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Service
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Create / Edit Modal ── */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => { setShowCreate(false); setEditService(null); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18 }}
              className="relative bg-white w-full max-w-xl mx-4 flex flex-col max-h-[92vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-black/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black flex items-center justify-center">
                    <Layers className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-light tracking-wide text-black">
                      {editService ? "Edit Service" : "New Service"}
                    </h3>
                    <p className="text-[10px] text-black/40 mt-0.5">
                      {editService ? editService.name : "Add a new service offering"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setShowCreate(false); setEditService(null); }}
                  className="p-1.5 hover:bg-black/5 transition text-black/40"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                <div className="px-6 py-5 space-y-5">

                  {/* Name */}
                  <Field label="Service Name" required>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Custom Tailoring"
                      className={inputCls}
                    />
                  </Field>

                  {/* Summary */}
                  <Field label="Summary" hint="Short one-line description shown in listings">
                    <input
                      type="text"
                      value={form.summary}
                      onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                      placeholder="A brief summary of the service"
                      className={inputCls}
                    />
                  </Field>

                  {/* Description */}
                  <Field label="Description">
                    <textarea
                      rows={4}
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="Full description of the service..."
                      className={`${inputCls} resize-none`}
                    />
                  </Field>

                  {/* Icon */}
                  <Field label="Icon" hint="Emoji or icon class name (e.g. ✂️)">
                    <div className="relative">
                      <Smile className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/25" />
                      <input
                        type="text"
                        value={form.icon}
                        onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                        placeholder="✂️ or icon-name"
                        className={`${inputCls} pl-9`}
                      />
                    </div>
                  </Field>

                  {/* Image upload */}
                  <ImageUpload
                    label="Service Image"
                    hint="Cover photo displayed on the website"
                    value={form.image}
                    onChange={(url) => setForm((f) => ({ ...f, image: url }))}
                  />

                  {/* Starting Price */}
                  <Field label="Starting Price (NGN)" required>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/25" />
                      <input
                        type="number"
                        required
                        min={0}
                        value={form.startingPrice || ""}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, startingPrice: Number(e.target.value) }))
                        }
                        placeholder="300000"
                        className={`${inputCls} pl-9`}
                      />
                    </div>
                    {form.startingPrice > 0 && (
                      <p className="text-[9px] text-black/40 mt-1">
                        = {formatPrice(form.startingPrice)}
                      </p>
                    )}
                  </Field>

                  {/* Features */}
                  <Field label="Features" hint="What's included in this service">
                    <div className="space-y-2">
                      {form.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="flex-1 relative">
                            <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/25" />
                            <input
                              type="text"
                              value={feat}
                              onChange={(e) => updateFeature(i, e.target.value)}
                              placeholder={`Feature ${i + 1}`}
                              className={`${inputCls} pl-9`}
                            />
                          </div>
                          {form.features.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFeature(i)}
                              className="p-1.5 text-black/30 hover:text-red-500 transition shrink-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addFeature}
                        className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] text-black/40 hover:text-black transition pt-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add feature
                      </button>
                    </div>
                  </Field>
                </div>

                {/* Modal Footer */}
                <div className="flex gap-3 px-6 py-4 border-t border-black/10 shrink-0">
                  <button
                    type="button"
                    onClick={() => { setShowCreate(false); setEditService(null); }}
                    className="flex-1 py-2.5 border border-black/10 text-sm text-black/60 hover:border-black transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending || !form.name.trim()}
                    className="flex-1 py-2.5 bg-black text-white text-sm hover:bg-black/80 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isPending ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Saving…
                      </>
                    ) : editService ? (
                      <>
                        <Edit3 className="w-3.5 h-3.5" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        Create Service
                      </>
                    )}
                  </button>
                </div>
              </form>
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
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18 }}
              className="relative bg-white w-full max-w-sm mx-4 p-6"
            >
              <div className="flex items-start gap-4 mb-5">
                <div className="w-9 h-9 bg-red-50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4.5 h-4.5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-sm font-light text-black">Delete Service</h3>
                  <p className="text-xs text-black/50 font-light mt-1 leading-relaxed">
                    Are you sure you want to delete{" "}
                    <span className="text-black font-normal">"{deleteTarget.name}"</span>?
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 border border-black/10 text-sm text-black/60 hover:border-black transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteService.isPending}
                  className="flex-1 py-2.5 bg-red-500 text-white text-sm hover:bg-red-600 transition disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {deleteService.isPending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Deleting…
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

/* ── Helper components ── */
const inputCls =
  "w-full px-3 py-2 border border-black/10 text-sm font-light focus:outline-none focus:border-black transition";

const Field = ({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center gap-1 mb-1.5">
      <label className="text-[9px] uppercase tracking-[0.15em] text-black/40">
        {label}
      </label>
      {required && <span className="text-red-400 text-[9px]">*</span>}
    </div>
    {hint && <p className="text-[9px] text-black/30 mb-1.5">{hint}</p>}
    {children}
  </div>
);

const DrawerRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-4">
    <span className="text-[10px] uppercase tracking-[0.1em] text-black/30 shrink-0 pt-0.5">
      {label}
    </span>
    <span className="text-xs text-black/70 font-light text-right">{value}</span>
  </div>
);

export default Services;
