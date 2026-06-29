interface StoreSectionProps {
  store: any;
  onStoreChange: (store: any) => void;
}

const StoreSection = ({ store, onStoreChange }: StoreSectionProps) => {
  const set = (key: string, value: any) =>
    onStoreChange({ ...store, [key]: value });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-500 mb-1">Store Name</label>
          <input
            type="text"
            value={store.storeName || ""}
            onChange={(e) => set("storeName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Store Email</label>
          <input
            type="email"
            value={store.storeEmail || ""}
            onChange={(e) => set("storeEmail", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Store Phone</label>
          <input
            type="tel"
            value={store.storePhone || ""}
            onChange={(e) => set("storePhone", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-500 mb-1">Address</label>
          <input
            type="text"
            value={store.address || ""}
            onChange={(e) => set("address", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">City</label>
          <input
            type="text"
            value={store.city || ""}
            onChange={(e) => set("city", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Postal Code</label>
          <input
            type="text"
            value={store.postalCode || ""}
            onChange={(e) => set("postalCode", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Country</label>
          <select
            value={store.country || "United Kingdom"}
            onChange={(e) => set("country", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm bg-white"
          >
            <option>Nigeria</option>
            <option>United Kingdom</option>
            <option>United States</option>
            <option>Canada</option>
            <option>Australia</option>
            <option>Germany</option>
            <option>France</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Currency</label>
          <select
            value={store.currency || "NGN"}
            onChange={(e) => set("currency", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm bg-white"
          >
            <option value="NGN">NGN (₦)</option>
            <option value="GBP">GBP (£)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Tax Rate (%)</label>
          <input
            type="number"
            value={store.taxRate || 0}
            onChange={(e) => set("taxRate", Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Shipping Fee</label>
          <input
            type="number"
            value={store.shippingFee || 0}
            onChange={(e) => set("shippingFee", Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Free Shipping Threshold
          </label>
          <input
            type="number"
            value={store.freeShippingThreshold || 0}
            onChange={(e) => set("freeShippingThreshold", Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>
    </div>
  );
};

export default StoreSection;
