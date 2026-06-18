import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface RowAction {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  destructive?: boolean;
  disabled?: boolean;
  hidden?: boolean;
}

interface RowActionMenuProps {
  actions: RowAction[];
}

const RowActionMenu = ({ actions }: RowActionMenuProps) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const visible = actions.filter((a) => !a.hidden);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (open) {
      setOpen(false);
      return;
    }
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuH = visible.length * 40 + 10;
    const spaceBelow = window.innerHeight - rect.bottom;
    const top =
      spaceBelow < menuH + 8 ? rect.top - menuH - 4 : rect.bottom + 4;
    const left = Math.max(
      4,
      Math.min(rect.right - 176, window.innerWidth - 184)
    );
    setPos({ top, left });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      // Don't close if clicking the trigger or inside the menu itself
      if (triggerRef.current?.contains(e.target as Node)) return;
      if (menuRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  if (visible.length === 0) return null;

  return (
    <>
      <button
        ref={triggerRef}
        onClick={handleToggle}
        className="p-1.5 hover:bg-black/5 transition text-black/40 hover:text-black"
        title="More actions"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              zIndex: 9999,
            }}
            className="w-44 bg-white border border-black/10 shadow-xl py-1"
          >
            {visible.map((action, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                  setOpen(false);
                }}
                disabled={action.disabled}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-[11px] tracking-wide text-left transition disabled:opacity-40 disabled:cursor-not-allowed ${
                  action.destructive
                    ? "text-red-500 hover:bg-red-50"
                    : "text-black/70 hover:bg-black/5"
                }`}
              >
                <action.icon className="w-3.5 h-3.5 shrink-0" />
                {action.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
};

export default RowActionMenu;
