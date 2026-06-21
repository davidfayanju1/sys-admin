import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  AlertCircle,
  Trash2,
  ChevronDown,
  Copy,
  Check,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  CreditCard,
  User,
  Hash,
  Calendar,
  RefreshCw,
  FileText,
  Navigation,
} from "lucide-react";
import {
  useOrderDetails,
  useUpdateOrderStatus,
  useUpdateOrderPayment,
  useDeleteOrder,
  type OrderDetail,
  type OrderItem,
  type OrderAddress,
} from "../../hooks/useOrders";
import Skeleton from "../UI/Skeleton";
import { toast } from "sonner";

interface OrderDetailsModalProps {
  orderId: string;
  onClose: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const dash = "—";

const getCustomerName = (d: OrderDetail) =>
  d.user?.fullName ||
  d.user?.name ||
  [d.user?.firstName, d.user?.lastName].filter(Boolean).join(" ") ||
  d.customer ||
  dash;

const getItems = (d: OrderDetail): OrderItem[] =>
  (Array.isArray(d.items) ? d.items : null) || d.orderItems || [];

const getItemImage = (item: OrderItem): string | null => {
  const imgs = item.product?.images;
  if (!imgs?.length) return null;
  const first = imgs[0];
  return typeof first === "string" ? first : first.url || null;
};

const getItemName = (item: OrderItem) =>
  item.product?.name || item.product?.title || item.name || dash;

const getItemSku = (item: OrderItem) =>
  item.variant?.sku || item.sku || item.product?.sku || dash;

const getItemColor = (item: OrderItem) =>
  item.variant?.color || item.color || null;

const getItemSize = (item: OrderItem) =>
  item.variant?.size ||
  item.variant?.sizes?.[0] ||
  item.size ||
  null;

const getItemUnitPrice = (item: OrderItem) =>
  item.unitPrice ?? item.price ?? 0;

const getItemSubtotal = (item: OrderItem) =>
  item.subtotal ?? item.amount ?? getItemUnitPrice(item) * (item.quantity || 1);

const getTotal = (d: OrderDetail) =>
  d.totalPrice ?? d.total ?? d.amount ?? 0;

const getSubtotal = (d: OrderDetail) => {
  if (d.subtotal != null) return d.subtotal;
  const items = getItems(d);
  if (items.length)
    return items.reduce((sum, i) => sum + getItemSubtotal(i), 0);
  return getTotal(d);
};

const getShippingFee = (d: OrderDetail) =>
  d.shippingFee ?? d.shippingCost ?? 0;

const getDiscount = (d: OrderDetail) =>
  d.discount ?? d.discountAmount ?? 0;

const fmt = (n: number) =>
  `₦${Number(n).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const fmtDate = (s?: string) => {
  if (!s) return dash;
  try {
    return new Date(s).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dash;
  }
};

const fmtDateTime = (s?: string) => {
  if (!s) return dash;
  try {
    return new Date(s).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dash;
  }
};

const formatAddress = (addr?: OrderAddress): string[] => {
  if (!addr) return [];
  return [
    addr.street || addr.address || addr.line1,
    addr.line2,
    addr.city,
    addr.state,
    addr.postalCode || addr.zipCode,
    addr.country,
  ].filter(Boolean) as string[];
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[9px] uppercase tracking-[0.15em] text-black/40 mb-3 font-medium">
    {children}
  </p>
);

const InfoRow = ({
  label,
  value,
  mono,
  copyable,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
  copyable?: boolean;
}) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (!value || value === dash) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex items-start justify-between gap-2 py-1.5 border-b border-black/4 last:border-0">
      <span className="text-[11px] text-black/40 shrink-0">{label}</span>
      <div className="flex items-center gap-1 min-w-0">
        <span
          className={`text-[11px] text-right break-all ${mono ? "font-mono text-black/70" : "text-black/70"}`}
        >
          {value || dash}
        </span>
        {copyable && value && value !== dash && (
          <button
            onClick={handleCopy}
            className="shrink-0 text-black/20 hover:text-black/50 transition-colors ml-1"
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const CustomSelect = ({
  value,
  onChange,
  disabled,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  options: { label: string; value: string; className?: string }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value) || options[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-[11px] font-medium uppercase tracking-wider px-3 py-2.5 border border-black/10 focus:outline-none transition-colors disabled:opacity-50 ${selected?.className || "bg-black/5 text-black/80"}`}
      >
        <span>{selected?.label}</span>
        <ChevronDown className="w-3.5 h-3.5 ml-2 opacity-50" />
      </button>
      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50 w-full mt-1 bg-white border border-black/10 shadow-lg"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 text-[11px] font-medium uppercase tracking-wider hover:bg-black/5 transition-colors ${
                  value === opt.value ? "bg-black/5" : ""
                } ${opt.className || "text-black/80"}`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Progress Tracker ─────────────────────────────────────────────────────────

const ORDER_STEPS = [
  { key: "pending", label: "Pending", icon: Clock },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

const OrderProgressTracker = ({ status }: { status: string }) => {
  const lower = status.toLowerCase();
  const isCancelled = lower === "cancelled";
  const currentIdx = ORDER_STEPS.findIndex((s) => s.key === lower);

  if (isCancelled) {
    return (
      <div className="px-6 py-4 border-b border-black/10 flex items-center gap-2.5 bg-red-50">
        <XCircle className="w-4 h-4 text-red-500 shrink-0" />
        <span className="text-xs uppercase tracking-wider text-red-600 font-medium">
          Order Cancelled
        </span>
      </div>
    );
  }

  return (
    <div className="px-6 py-5 border-b border-black/10 bg-black/1">
      <SectionLabel>Order Progress</SectionLabel>
      <div className="flex items-start">
        {ORDER_STEPS.map((step, idx) => {
          const done = idx <= currentIdx;
          const active = idx === currentIdx;
          const Icon = step.icon;
          return (
            <div key={step.key} className="flex items-start flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5 min-w-0">
                <div
                  className={`w-8 h-8 flex items-center justify-center border-2 transition-all ${
                    done
                      ? "border-black bg-black"
                      : "border-black/15 bg-white"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${done ? "text-white" : "text-black/25"}`}
                  />
                </div>
                <span
                  className={`text-[9px] uppercase tracking-wider text-center leading-tight ${
                    active
                      ? "text-black font-semibold"
                      : done
                      ? "text-black/50"
                      : "text-black/25"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < ORDER_STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mt-4 mx-1.5 transition-colors ${
                    idx < currentIdx ? "bg-black" : "bg-black/10"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

const DrawerSkeleton = () => (
  <div className="p-6 space-y-6">
    <div className="space-y-2">
      <Skeleton className="w-40 h-4 rounded-sm" />
      <Skeleton className="w-56 h-3 rounded-sm" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Skeleton className="h-28 rounded-sm" />
      <Skeleton className="h-28 rounded-sm" />
      <Skeleton className="h-28 rounded-sm" />
      <Skeleton className="h-28 rounded-sm" />
    </div>
    <Skeleton className="h-10 rounded-sm" />
    <div className="space-y-3">
      <Skeleton className="w-32 h-3 rounded-sm" />
      <Skeleton className="h-16 rounded-sm" />
      <Skeleton className="h-16 rounded-sm" />
    </div>
    <div className="space-y-1.5">
      <Skeleton className="h-3 rounded-sm" />
      <Skeleton className="h-3 rounded-sm" />
      <Skeleton className="w-2/3 h-3 rounded-sm" />
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const statusOptions = [
  { label: "Pending", value: "pending", className: "text-yellow-700 bg-yellow-50" },
  { label: "Processing", value: "processing", className: "text-blue-700 bg-blue-50" },
  { label: "Shipped", value: "shipped", className: "text-purple-700 bg-purple-50" },
  { label: "Delivered", value: "delivered", className: "text-green-700 bg-green-50" },
  { label: "Cancelled", value: "cancelled", className: "text-red-700 bg-red-50" },
];

const paymentOptions = [
  { label: "Pending", value: "pending", className: "text-yellow-700 bg-yellow-50" },
  { label: "Paid", value: "paid", className: "text-green-700 bg-green-50" },
  { label: "Failed", value: "failed", className: "text-red-700 bg-red-50" },
  { label: "Refunded", value: "refunded", className: "text-gray-700 bg-gray-100" },
];

const OrderDetailsModal = ({ orderId, onClose }: OrderDetailsModalProps) => {
  const { data: orderDetailsData, isLoading, error } = useOrderDetails(orderId);
  const updateStatusMutation = useUpdateOrderStatus();
  const updatePaymentMutation = useUpdateOrderPayment();
  const deleteOrderMutation = useDeleteOrder();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const details: OrderDetail | null =
    orderDetailsData?.data || (orderDetailsData as any) || null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(orderId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1500);
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id: orderId, status: newStatus });
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handlePaymentChange = async (newStatus: string) => {
    try {
      await updatePaymentMutation.mutateAsync({
        id: orderId,
        paymentStatus: newStatus,
      });
      toast.success("Payment status updated");
    } catch {
      toast.error("Failed to update payment status");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteOrderMutation.mutateAsync(orderId);
      toast.success("Order deleted");
      setShowDeleteConfirm(false);
      onClose();
    } catch {
      toast.error("Failed to delete order");
    }
  };

  const items = details ? getItems(details) : [];
  const addressLines = details ? formatAddress(details.shippingAddress) : [];
  const subtotal = details ? getSubtotal(details) : 0;
  const shippingFee = details ? getShippingFee(details) : 0;
  const discount = details ? getDiscount(details) : 0;
  const total = details ? getTotal(details) : 0;
  const createdAt = details?.createdAt || details?.date;
  const updatedAt = details?.updatedAt;
  const orderRef =
    details?.orderNumber || details?._id || details?.id || orderId;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-3xl bg-white shadow-2xl flex flex-col overflow-hidden"
      >
        {/* ── Sticky Header ─────────────────────────────────────────────── */}
        <div className="shrink-0 border-b border-black/10 px-6 py-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-light tracking-wide truncate">
                {details?.orderNumber
                  ? `Order ${details.orderNumber}`
                  : "Order Details"}
              </h2>
              <button
                onClick={handleCopyId}
                title="Copy order ID"
                className="text-black/25 hover:text-black/60 transition-colors shrink-0"
              >
                {copiedId ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <p className="text-[10px] font-mono text-black/40 mt-0.5 truncate">
              {orderId}
            </p>
            {(createdAt || updatedAt) && (
              <p className="text-[10px] text-black/30 mt-1">
                {createdAt && `Created ${fmtDateTime(createdAt)}`}
                {updatedAt && createdAt && " · "}
                {updatedAt && `Updated ${fmtDateTime(updatedAt)}`}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleteOrderMutation.isPending || isLoading}
              title="Delete order"
              className="p-2 hover:bg-red-50 hover:text-red-600 transition-colors text-black/40 rounded disabled:opacity-40"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-black/5 transition-colors rounded text-black/40"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Progress Tracker ──────────────────────────────────────────── */}
        {details && !isLoading && (
          <div className="shrink-0">
            <OrderProgressTracker status={details.status} />
          </div>
        )}

        {/* ── Scrollable Body ───────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <DrawerSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <AlertCircle className="w-8 h-8 text-red-400" />
              <p className="text-sm text-black/50">Failed to load order details</p>
            </div>
          ) : !details ? (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-sm text-black/40">Order not found</p>
            </div>
          ) : (
            <div className="p-6 space-y-8">

              {/* ── Info Grid ──────────────────────────────────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Customer */}
                <div className="border border-black/08 p-4 space-y-0.5">
                  <div className="flex items-center gap-1.5 mb-3">
                    <User className="w-3.5 h-3.5 text-black/30" />
                    <SectionLabel>Customer</SectionLabel>
                  </div>
                  <InfoRow label="Name" value={getCustomerName(details)} />
                  <InfoRow label="Email" value={details.user?.email} />
                  <InfoRow label="Phone" value={details.user?.phone} />
                  {details.user?._id && (
                    <InfoRow
                      label="Customer ID"
                      value={details.user._id}
                      mono
                      copyable
                    />
                  )}
                </div>

                {/* Shipping Address */}
                <div className="border border-black/08 p-4">
                  <div className="flex items-center gap-1.5 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-black/30" />
                    <SectionLabel>Shipping Address</SectionLabel>
                  </div>
                  {addressLines.length > 0 ? (
                    <div className="space-y-0.5">
                      {addressLines.map((line, i) => (
                        <p key={i} className="text-[11px] text-black/70">
                          {line}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-black/30">{dash}</p>
                  )}
                </div>

                {/* Payment Details */}
                <div className="border border-black/08 p-4 space-y-0.5">
                  <div className="flex items-center gap-1.5 mb-3">
                    <CreditCard className="w-3.5 h-3.5 text-black/30" />
                    <SectionLabel>Payment</SectionLabel>
                  </div>
                  <InfoRow
                    label="Method"
                    value={
                      details.paymentMethod
                        ? details.paymentMethod.charAt(0).toUpperCase() +
                          details.paymentMethod.slice(1)
                        : null
                    }
                  />
                  <InfoRow
                    label="Reference"
                    value={details.paymentReference}
                    mono
                    copyable
                  />
                  <InfoRow label="Provider" value={details.paymentProvider} />
                  <InfoRow label="Currency" value={details.currency} />
                </div>

                {/* Fulfillment */}
                <div className="border border-black/08 p-4 space-y-0.5">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Navigation className="w-3.5 h-3.5 text-black/30" />
                    <SectionLabel>Fulfillment</SectionLabel>
                  </div>
                  <InfoRow
                    label="Tracking No."
                    value={details.trackingNumber}
                    mono
                    copyable
                  />
                  <InfoRow label="Carrier" value={details.carrier} />
                  <InfoRow
                    label="Est. Delivery"
                    value={fmtDate(details.estimatedDelivery)}
                  />
                  <InfoRow
                    label="Order Ref"
                    value={orderRef}
                    mono
                    copyable
                  />
                </div>
              </div>

              {/* ── Status Management ───────────────────────────────────── */}
              <div>
                <SectionLabel>Manage Status</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-black/40 mb-1.5 uppercase tracking-wider">
                      Order Status
                    </p>
                    <CustomSelect
                      value={details.status?.toLowerCase()}
                      onChange={handleStatusChange}
                      disabled={updateStatusMutation.isPending}
                      options={statusOptions}
                    />
                    {updateStatusMutation.isPending && (
                      <p className="text-[10px] text-black/40 mt-1 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Updating…
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] text-black/40 mb-1.5 uppercase tracking-wider">
                      Payment Status
                    </p>
                    <CustomSelect
                      value={details.paymentStatus?.toLowerCase()}
                      onChange={handlePaymentChange}
                      disabled={updatePaymentMutation.isPending}
                      options={paymentOptions}
                    />
                    {updatePaymentMutation.isPending && (
                      <p className="text-[10px] text-black/40 mt-1 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Updating…
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Order Items ─────────────────────────────────────────── */}
              <div>
                <SectionLabel>Order Items ({items.length || dash})</SectionLabel>
                {items.length > 0 ? (
                  <div className="border border-black/10 divide-y divide-black/5">
                    {/* Table header */}
                    <div className="grid grid-cols-[auto_1fr_auto_auto] gap-3 px-4 py-2.5 bg-black/2">
                      <span className="text-[9px] uppercase tracking-wider text-black/35 w-10">
                        Item
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-black/35">
                        Product
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-black/35 text-right">
                        Qty
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-black/35 text-right min-w-[80px]">
                        Subtotal
                      </span>
                    </div>

                    {items.map((item, idx) => {
                      const img = getItemImage(item);
                      const color = getItemColor(item);
                      const size = getItemSize(item);
                      const unitPrice = getItemUnitPrice(item);
                      const subtotalItem = getItemSubtotal(item);

                      return (
                        <div
                          key={item._id || idx}
                          className="grid grid-cols-[auto_1fr_auto_auto] gap-3 px-4 py-3 items-start"
                        >
                          {/* Image */}
                          <div className="w-10 h-10 bg-black/5 shrink-0 overflow-hidden">
                            {img ? (
                              <img
                                src={img}
                                alt={getItemName(item)}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-4 h-4 text-black/20" />
                              </div>
                            )}
                          </div>

                          {/* Name + meta */}
                          <div className="min-w-0">
                            <p className="text-[12px] text-black/80 font-medium truncate">
                              {getItemName(item)}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {color && (
                                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-black/5 text-black/50">
                                  {color}
                                </span>
                              )}
                              {size && (
                                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-black/5 text-black/50">
                                  {size}
                                </span>
                              )}
                              <span className="text-[9px] font-mono text-black/30 self-center">
                                {getItemSku(item)}
                              </span>
                            </div>
                            {unitPrice > 0 && (
                              <p className="text-[10px] text-black/40 mt-1">
                                {fmt(unitPrice)} × {item.quantity || 1}
                              </p>
                            )}
                          </div>

                          {/* Qty */}
                          <span className="text-[12px] text-black/60 text-right self-center">
                            {item.quantity || 1}
                          </span>

                          {/* Subtotal */}
                          <span className="text-[12px] font-medium text-black text-right self-center min-w-[80px]">
                            {fmt(subtotalItem)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[11px] text-black/30 border border-black/8 px-4 py-5">
                    No item details available
                  </p>
                )}
              </div>

              {/* ── Order Totals ────────────────────────────────────────── */}
              <div>
                <SectionLabel>Order Totals</SectionLabel>
                <div className="border border-black/10 divide-y divide-black/5">
                  <div className="flex justify-between px-4 py-2.5">
                    <span className="text-[11px] text-black/50">Subtotal</span>
                    <span className="text-[11px] text-black/70">{fmt(subtotal)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-2.5">
                    <span className="text-[11px] text-black/50">Shipping Fee</span>
                    <span className="text-[11px] text-black/70">
                      {shippingFee > 0 ? fmt(shippingFee) : "Free"}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between px-4 py-2.5">
                      <span className="text-[11px] text-black/50">Discount</span>
                      <span className="text-[11px] text-green-600">
                        −{fmt(discount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between px-4 py-3 bg-black/1.5">
                    <span className="text-[12px] font-medium text-black uppercase tracking-wide">
                      Total
                    </span>
                    <span className="text-[13px] font-semibold text-black">
                      {fmt(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Status History ──────────────────────────────────────── */}
              {details.statusHistory && details.statusHistory.length > 0 && (
                <div>
                  <SectionLabel>Status History</SectionLabel>
                  <div className="space-y-2">
                    {details.statusHistory.map((entry, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 text-[11px]"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-black/20 mt-1.5 shrink-0" />
                        <div className="flex-1">
                          <span className="font-medium text-black/70 uppercase tracking-wider text-[10px]">
                            {entry.status}
                          </span>
                          {entry.note && (
                            <span className="text-black/40"> · {entry.note}</span>
                          )}
                        </div>
                        <span className="text-black/30 shrink-0">
                          {fmtDateTime(entry.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Notes ──────────────────────────────────────────────── */}
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <FileText className="w-3.5 h-3.5 text-black/30" />
                  <SectionLabel>Notes</SectionLabel>
                </div>
                <div className="border border-black/08 px-4 py-3 min-h-[56px]">
                  {details.notes || details.adminNotes ? (
                    <p className="text-[11px] text-black/60 leading-relaxed">
                      {details.notes || details.adminNotes}
                    </p>
                  ) : (
                    <p className="text-[11px] text-black/25 italic">
                      No notes on this order
                    </p>
                  )}
                </div>
              </div>

              {/* ── Meta IDs ───────────────────────────────────────────── */}
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <Hash className="w-3.5 h-3.5 text-black/30" />
                  <SectionLabel>Reference IDs</SectionLabel>
                </div>
                <div className="border border-black/08 p-4 space-y-0.5">
                  <InfoRow label="Order ID" value={orderId} mono copyable />
                  {details._id && details._id !== orderId && (
                    <InfoRow label="DB ID" value={details._id} mono copyable />
                  )}
                  {details.orderNumber && (
                    <InfoRow
                      label="Order No."
                      value={details.orderNumber}
                      mono
                      copyable
                    />
                  )}
                  {details.paymentReference && (
                    <InfoRow
                      label="Payment Ref"
                      value={details.paymentReference}
                      mono
                      copyable
                    />
                  )}
                  {details.trackingNumber && (
                    <InfoRow
                      label="Tracking"
                      value={details.trackingNumber}
                      mono
                      copyable
                    />
                  )}
                </div>
              </div>

              {/* ── Timestamps ─────────────────────────────────────────── */}
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <Calendar className="w-3.5 h-3.5 text-black/30" />
                  <SectionLabel>Timestamps</SectionLabel>
                </div>
                <div className="border border-black/08 p-4 space-y-0.5">
                  <InfoRow label="Placed" value={fmtDateTime(createdAt)} />
                  <InfoRow label="Last Updated" value={fmtDateTime(updatedAt)} />
                  {details.estimatedDelivery && (
                    <InfoRow
                      label="Est. Delivery"
                      value={fmtDate(details.estimatedDelivery)}
                    />
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </motion.div>

      {/* ── Delete Confirm ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-black/10 w-full max-w-sm p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <h3 className="text-base font-light tracking-wide">
                  Delete Order
                </h3>
              </div>
              <p className="text-xs text-black/60 mb-2 font-light leading-relaxed">
                Are you sure you want to permanently delete this order?
              </p>
              <p className="text-[10px] font-mono text-black/40 bg-black/5 px-3 py-2 mb-6 break-all">
                {orderId}
              </p>
              <p className="text-[10px] text-red-500 mb-5">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteOrderMutation.isPending}
                  className="flex-1 py-2.5 text-[11px] uppercase tracking-wider border border-black/10 hover:bg-black/5 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteOrderMutation.isPending}
                  className="flex-1 py-2.5 text-[11px] uppercase tracking-wider bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleteOrderMutation.isPending ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Deleting…
                    </>
                  ) : (
                    "Delete Order"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OrderDetailsModal;
