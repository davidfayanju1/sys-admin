import { useRef, useState } from "react";
import { Upload, X, RefreshCw, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useUploadMedia } from "../../hooks/useMedia";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
}

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_MB = 10;

const ImageUpload = ({ value, onChange, label, hint }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const upload = useUploadMedia();

  const handleFile = (file: File) => {
    if (!ACCEPTED.includes(file.type)) {
      toast.error("Only image files are allowed (JPEG, PNG, WebP, GIF, SVG)");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`Image must be under ${MAX_MB} MB`);
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    upload.mutate(fd, {
      onSuccess: (res) => {
        onChange(res.data.url);
        toast.success("Image uploaded");
      },
      onError: () => toast.error("Upload failed. Please try again."),
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      {label && (
        <label className="block text-[9px] uppercase tracking-[0.15em] text-black/40 mb-1.5">
          {label}
        </label>
      )}
      {hint && <p className="text-[9px] text-black/30 mb-1.5">{hint}</p>}

      {value ? (
        /* ── Preview state ── */
        <div className="relative group">
          <div className="w-full aspect-video bg-black/4 overflow-hidden">
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          {/* Overlay actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={upload.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-[10px] uppercase tracking-wider hover:bg-white/90 transition"
            >
              {upload.isPending ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <Upload className="w-3 h-3" />
              )}
              Change
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-red-500 text-[10px] uppercase tracking-wider hover:bg-white/90 transition"
            >
              <X className="w-3 h-3" />
              Remove
            </button>
          </div>
          {upload.isPending && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-black/60 animate-spin" />
            </div>
          )}
        </div>
      ) : (
        /* ── Upload zone ── */
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragEnter={() => setDragging(true)}
          onDragLeave={() => setDragging(false)}
          className={`w-full aspect-video border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition select-none ${
            dragging
              ? "border-black bg-black/4"
              : "border-black/15 bg-black/2 hover:border-black/30 hover:bg-black/4"
          }`}
        >
          {upload.isPending ? (
            <>
              <RefreshCw className="w-6 h-6 text-black/30 animate-spin mb-2" />
              <p className="text-xs text-black/40 font-light">Uploading…</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 bg-black/5 flex items-center justify-center mb-3">
                <Upload className="w-4 h-4 text-black/30" />
              </div>
              <p className="text-xs text-black/60 font-light">
                Drop image here or{" "}
                <span className="underline underline-offset-2">browse</span>
              </p>
              <p className="text-[10px] text-black/30 font-light mt-1">
                JPEG, PNG, WebP, GIF · Max {MAX_MB} MB
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
};

/* ── Placeholder for display-only slots (tables, drawers, etc.) ── */
export const ImagePlaceholder = ({
  className = "w-full aspect-video",
}: {
  className?: string;
}) => (
  <div className={`bg-black/4 flex flex-col items-center justify-center ${className}`}>
    <ImageIcon className="w-6 h-6 text-black/15" />
    <p className="text-[9px] text-black/25 mt-1.5 tracking-wide">No image</p>
  </div>
);

export default ImageUpload;
