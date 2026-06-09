import { useState, useRef, useEffect } from "react";
import { X, AlertCircle, Trash2, ChevronDown } from "lucide-react";
import {
  useOrderDetails,
  useUpdateOrderStatus,
  useUpdateOrderPayment,
  useDeleteOrder,
} from "../../hooks/useOrders";
import Skeleton from "../UI/Skeleton";
import { toast } from "sonner";

interface OrderDetailsModalProps {
  orderId: string;
  onClose: () => void;
}

const CustomSelect = ({
  value,
  onChange,
  disabled,
  options,
  className,
}: {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  options: { label: string; value: string; className?: string }[];
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-[11px] font-medium uppercase tracking-wider p-2.5 border border-black/10 focus:outline-none transition-colors disabled:opacity-50 ${className} ${selectedOption?.className || "bg-black/5 text-black/80"}`}
      >
        <span>{selectedOption?.label}</span>
        <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-black/10 shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 text-[11px] font-medium uppercase tracking-wider hover:bg-black/5 transition-colors ${
                value === option.value ? "bg-black/5" : ""
              } ${option.className || "text-black/80"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const OrderDetailsModal = ({ orderId, onClose }: OrderDetailsModalProps) => {
  const { data: orderDetailsData, isLoading, error } = useOrderDetails(orderId);
  const updateStatusMutation = useUpdateOrderStatus();
  const updatePaymentMutation = useUpdateOrderPayment();
  const deleteOrderMutation = useDeleteOrder();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fallback to error or empty state handling if needed
  const details = orderDetailsData?.data || orderDetailsData;

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: orderId,
        status: newStatus,
      });
      toast.success("Order status updated");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handlePaymentChange = async (newPaymentStatus: string) => {
    try {
      await updatePaymentMutation.mutateAsync({
        id: orderId,
        paymentStatus: newPaymentStatus,
      });
      toast.success("Payment status updated");
    } catch (err) {
      toast.error("Failed to update payment");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteOrderMutation.mutateAsync(orderId);
      toast.success("Order deleted");
      setShowDeleteConfirm(false);
      onClose();
    } catch (err) {
      toast.error("Failed to delete order");
    }
  };

  const statusOptions = [
    { label: "Pending", value: "pending" },
    {
      label: "Processing",
      value: "processing",
      className: "text-blue-700 bg-blue-50",
    },
    {
      label: "Shipped",
      value: "shipped",
      className: "text-purple-700 bg-purple-50",
    },
    {
      label: "Delivered",
      value: "delivered",
      className: "text-green-700 bg-green-50",
    },
    {
      label: "Cancelled",
      value: "cancelled",
      className: "text-red-700 bg-red-50",
    },
  ];

  const paymentOptions = [
    {
      label: "Pending",
      value: "pending",
      className: "text-yellow-700 bg-yellow-50",
    },
    { label: "Paid", value: "paid", className: "text-green-700 bg-green-50" },
    { label: "Failed", value: "failed", className: "text-red-700 bg-red-50" },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
        <div className="bg-white border border-black/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
          <div className="sticky top-0 bg-white border-b border-black/10 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-lg font-light tracking-wide">
                Order Details
              </h2>
              <p className="text-[10px] text-black/50 mt-1 uppercase tracking-[0.1em]">
                {orderId}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deleteOrderMutation.isPending || isLoading}
                className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors disabled:opacity-50 text-black/60"
                title="Delete Order"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-black/60" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="space-y-6">
                <Skeleton className="w-1/3 h-6 rounded-sm" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="w-full h-20 rounded-sm" />
                  <Skeleton className="w-full h-20 rounded-sm" />
                </div>
                <Skeleton className="w-full h-40 rounded-sm" />
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <p className="text-sm text-black/60">
                  Failed to load order details
                </p>
              </div>
            ) : !details ? (
              <div className="text-center py-10">
                <p className="text-sm text-black/60">Order not found</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-black/40 mb-3">
                      Customer Information
                    </h3>
                    <p className="text-sm text-black/80">
                      {details.customer || details.user?.name || "N/A"}
                    </p>
                    <p className="text-xs text-black/60 mt-1">
                      {details.user?.email || "N/A"}
                    </p>
                    <p className="text-xs text-black/60 mt-1">
                      {details.user?.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-black/40 mb-3">
                      Order Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-black/60">Date:</span>
                        <span className="text-black/80">
                          {new Date(
                            details.date || details.createdAt,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black/60">Items:</span>
                        <span className="text-black/80">
                          {Array.isArray(details.items)
                            ? details.items.length
                            : details.items || details.orderItems?.length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black/60">Total Amount:</span>
                        <span className="font-medium text-black">
                          ₦
                          {Number(
                            details.amount || details.totalPrice || 0,
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statuses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-black/40 mb-3">
                      Order Status
                    </h3>
                    <CustomSelect
                      value={details.status?.toLowerCase()}
                      onChange={handleStatusChange}
                      disabled={updateStatusMutation.isPending}
                      options={statusOptions}
                    />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-black/40 mb-3">
                      Payment Status
                    </h3>
                    <CustomSelect
                      value={details.paymentStatus?.toLowerCase()}
                      onChange={handlePaymentChange}
                      disabled={updatePaymentMutation.isPending}
                      options={paymentOptions}
                    />
                  </div>
                </div>

                {/* Order Items */}
                {details.items && Array.isArray(details.items) && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-black/40 mb-3">
                      Items
                    </h3>
                    <div className="border border-black/10 divide-y divide-black/5">
                      {details.items.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 flex justify-between items-center"
                        >
                          <div className="flex items-center gap-3">
                            {item.product?.images?.[0] && (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.title}
                                className="w-10 h-10 object-cover"
                              />
                            )}
                            <div>
                              <p className="text-sm text-black/80">
                                {item.product?.title || item.name || "Product"}
                              </p>
                              <p className="text-xs text-black/50">
                                Qty: {item.quantity || 1}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm font-medium">
                            ₦
                            {Number(
                              item.subtotal ||
                                item.unitPrice ||
                                item.price ||
                                item.amount ||
                                0,
                            ).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white border border-black/10 w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-light tracking-wide text-black">
                Delete Order
              </h3>
            </div>
            <p className="text-sm text-black/70 mb-6 font-light">
              Are you sure you want to permanently delete order{" "}
              <span className="font-medium text-black">{orderId}</span>? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-[11px] uppercase tracking-wider font-medium border border-black/10 hover:bg-black/5 transition-colors"
                disabled={deleteOrderMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteOrderMutation.isPending}
                className="px-4 py-2 text-[11px] uppercase tracking-wider font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteOrderMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetailsModal;
