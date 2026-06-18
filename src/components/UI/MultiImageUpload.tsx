import { useRef } from "react";
import { Plus, X, RefreshCw, ImageIcon, Upload } from "lucide-react";
import { toast } from "sonner";
import { useUploadManyMedia, useUploadMedia } from "../../hooks/useMedia";

const MAX_TOTAL = 10;
const ACCEPTED = "image/*";
const MAX_MB = 10;

interface Props {
  values: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  hint?: string;
}

const MultiImageUpload = ({ values, onChange, label, hint }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadMany = useUploadManyMedia();
  const uploadSingle = useUploadMedia();

  const isPending = uploadMany.isPending || uploadSingle.isPending;

  const remaining = MAX_TOTAL - values.length;

  const handleFiles = (files: FileList) => {
    const valid = Array.from(files).filter((f) => {
      if (!f.type.startsWith("image/")) {
        toast.error(`"${f.name}" is not an image — skipped`);
        return false;
      }
      if (f.size > MAX_MB * 1024 * 1024) {
        toast.error(`"${f.name}" exceeds ${MAX_MB} MB — skipped`);
        return false;
      }
      return true;
    });

    if (valid.length === 0) return;

    const allowed = valid.slice(0, remaining);
    if (valid.length > remaining) {
      toast.warning(`Only ${remaining} more image${remaining === 1 ? "" : "s"} allowed. Extra files were skipped.`);
    }

    if (allowed.length === 0) {
      toast.warning(`You've reached the maximum of ${MAX_TOTAL} images.`);
      return;
    }

    if (allowed.length === 1) {
      const fd = new FormData();
      fd.append("file", allowed[0]);
      uploadSingle.mutate(fd, {
        onSuccess: (res) => {
          onChange([...values, res.data.url]);
          toast.success("Image uploaded");
        },
        onError: () => toast.error("Upload failed"),
      });
    } else {
      const fd = new FormData();
      allowed.forEach((f) => fd.append("files", f));
      uploadMany.mutate(fd, {
        onSuccess: (res) => {
          const newUrls = res.data.map((a) => a.url);
          onChange([...values, ...newUrls]);
          toast.success(`${newUrls.length} image${newUrls.length === 1 ? "" : "s"} uploaded`);
        },
        onError: () => toast.error("Upload failed"),
      });
    }
  };

  const remove = (index: number) =>
    onChange(values.filter((_, i) => i !== index));

  return (
    <div>
      {label && (
        <label className="block text-[9px] uppercase tracking-[0.15em] text-black/40 mb-1.5">
          {label}
        </label>
      )}
      {hint && <p className="text-[9px] text-black/30 mb-2">{hint}</p>}

      <div className="grid grid-cols-3 gap-2">
        {/* Existing images */}
        {values.map((url, i) => (
          <div key={i} className="relative group aspect-square bg-black/4 overflow-hidden">
            {url ? (
              <img
                src={url}
                alt={`Image ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-black/20" />
              </div>
            )}
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-1 right-1 w-5 h-5 bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-500"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Upload slot */}
        {values.length < MAX_TOTAL && (
          <button
            type="button"
            onClick={() => !isPending && inputRef.current?.click()}
            disabled={isPending}
            className="aspect-square border-2 border-dashed border-black/15 flex flex-col items-center justify-center text-black/30 hover:border-black/30 hover:text-black/50 hover:bg-black/2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5 mb-1" />
                <span className="text-[9px] uppercase tracking-wider">Add</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Info row */}
      <div className="flex items-center justify-between mt-2">
        <p className="text-[9px] text-black/30 font-light">
          {values.length} / {MAX_TOTAL} images · JPEG, PNG, WebP · Max {MAX_MB} MB each
        </p>
        {values.length < MAX_TOTAL && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
            className="flex items-center gap-1 text-[9px] uppercase tracking-[0.1em] text-black/40 hover:text-black transition disabled:opacity-40"
          >
            <Upload className="w-2.5 h-2.5" />
            Browse files
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
};

export default MultiImageUpload;
