// components/products/ImageUploadSection.tsx
import { PlusCircle, X } from "lucide-react";

interface ImageUploadSectionProps {
  primaryImage: string;
  onPrimaryImageChange: (url: string) => void;
  secondaryImages: string[];
  onSecondaryImagesChange: (images: string[]) => void;
}

const ImageUploadSection = ({
  primaryImage,
  onPrimaryImageChange,
  secondaryImages = [], // Add default value
  onSecondaryImagesChange,
}: ImageUploadSectionProps) => {
  const addSecondaryImage = () => {
    onSecondaryImagesChange([...(secondaryImages || []), ""]);
  };

  const updateSecondaryImage = (index: number, value: string) => {
    const updated = [...(secondaryImages || [])];
    updated[index] = value;
    onSecondaryImagesChange(updated);
  };

  const removeSecondaryImage = (index: number) => {
    onSecondaryImagesChange(
      (secondaryImages || []).filter((_, i) => i !== index),
    );
  };

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-4">Images</h4>
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Primary Image URL
          </label>
          <input
            type="text"
            value={primaryImage || ""}
            onChange={(e) => onPrimaryImageChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Secondary Images
          </label>
          {(secondaryImages || []).map((img, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                value={img || ""}
                onChange={(e) => updateSecondaryImage(idx, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                placeholder="https://example.com/image.jpg"
              />
              <button
                onClick={() => removeSecondaryImage(idx)}
                className="px-3 border border-gray-200 hover:border-red-500 transition"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
              </button>
            </div>
          ))}
          <button
            onClick={addSecondaryImage}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition mt-2"
          >
            <PlusCircle className="w-4 h-4" />
            Add Secondary Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadSection;
