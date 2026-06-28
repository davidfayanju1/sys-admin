// pages/Customers.tsx
import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { Search, UserPlus } from "lucide-react";
import {
  useCustomers,
  useCustomerSummary,
  useCustomerDetails,
} from "../hooks/useCustomer";
import CustomerStats from "../components/customers/CustomerStats";
import CustomerTable from "../components/customers/CustomerTable";
import CustomerDetailsModal from "../components/customers/CustomerDetailsModal";
import type { Customer } from "../types/customer";

const Customers = () => {
  // UI State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  // Queries
  const { data: customersData, isLoading: isLoadingCustomers } = useCustomers(
    currentPage,
    itemsPerPage,
    searchTerm,
    statusFilter,
  );
  const { data: summary, isLoading: isLoadingSummary } = useCustomerSummary();
  const { data: customerDetails, isLoading: isLoadingDetails } =
    useCustomerDetails(selectedCustomer?.id || null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (rowsPerPage: number) => {
    setItemsPerPage(rowsPerPage);
    setCurrentPage(1);
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const handleCloseModal = () => {
    setSelectedCustomer(null);
  };

  // Export functionality
  const handleExport = () => {
    if (!customersData?.data) return;

    const csvContent = [
      [
        "Name",
        "Email",
        "Phone",
        "City",
        "Total Spent",
        "Total Orders",
        "Status",
      ],
      ...customersData.data.map((customer) => [
        customer.name,
        customer.email,
        customer.phone,
        customer.city,
        customer.totalSpent,
        customer.totalOrders,
        customer.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customers_export_${new Date().getTime()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tight">Customers</h1>
            <div className="w-12 h-px bg-black/10 mt-2" />
            <p className="text-xs text-gray-500 mt-3">
              Manage your customer base, view profiles, and track engagement
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm hover:bg-black/90 transition"
          >
            <UserPlus className="w-4 h-4" />
            Export List
          </button>
        </div>

        {/* Stats Cards */}
        <CustomerStats summary={summary} isLoading={isLoadingSummary} />

        {/* Search Bar */}
        <div className="flex justify-between items-center bg-white border border-gray-200 p-4">
          <form onSubmit={handleSearch} className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black/30" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 focus:border-black outline-none text-sm font-light bg-transparent"
            />
            <button type="submit" className="hidden" />
          </form>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm bg-white"
          >
            <option value="all">All Customers</option>
            <option value="active">Active</option>
            <option value="vip">VIP</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Customers Table */}
        <div className="bg-white border border-gray-200 rounded-none overflow-hidden">
          <CustomerTable
            customers={customersData?.data || []}
            totalRows={customersData?.meta?.total || 0}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onPerRowsChange={handlePerRowsChange}
            onViewCustomer={handleViewCustomer}
            isLoading={isLoadingCustomers}
          />
        </div>

        {/* Customer Details Modal */}
        <CustomerDetailsModal
          customer={customerDetails || null}
          isLoading={isLoadingDetails}
          onClose={handleCloseModal}
        />
      </div>
    </DashboardLayout>
  );
};

export default Customers;
