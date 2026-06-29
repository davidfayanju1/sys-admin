interface NotificationsSectionProps {
  notifications: any;
  onNotificationsChange: (notifications: any) => void;
}

const Toggle = ({
  label,
  description,
  checked,
  onChange,
  last,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  last?: boolean;
}) => (
  <div
    className={`flex items-center justify-between py-3 ${!last ? "border-b border-gray-100" : ""}`}
  >
    <div>
      <p className="text-sm font-medium text-gray-900">{label}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
    <button
      type="button"
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className={`relative w-10 h-5 transition-colors shrink-0 ${checked ? "bg-black" : "bg-gray-300"}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 bg-white transition-all ${checked ? "right-0.5" : "left-0.5"}`}
      />
    </button>
  </div>
);

const TOGGLES = [
  {
    key: "newOrders",
    label: "New Orders",
    description: "Get notified when a new order is placed",
  },
  {
    key: "orderUpdates",
    label: "Order Status Updates",
    description: "Receive updates when order status changes",
  },
  {
    key: "lowStock",
    label: "Low Stock Alerts",
    description: "Alert when product stock is running low",
  },
  {
    key: "customerFeedback",
    label: "Customer Feedback",
    description: "Receive customer reviews and feedback",
  },
  {
    key: "marketingEmails",
    label: "Marketing Emails",
    description: "Weekly marketing insights and reports",
  },
  {
    key: "securityAlerts",
    label: "Security Alerts",
    description: "Important security notifications",
  },
] as const;

const NotificationsSection = ({
  notifications,
  onNotificationsChange,
}: NotificationsSectionProps) => (
  <div className="space-y-0">
    {TOGGLES.map((item, idx) => (
      <Toggle
        key={item.key}
        label={item.label}
        description={item.description}
        checked={!!notifications[item.key]}
        onChange={() =>
          onNotificationsChange({
            ...notifications,
            [item.key]: !notifications[item.key],
          })
        }
        last={idx === TOGGLES.length - 1}
      />
    ))}
  </div>
);

export default NotificationsSection;
