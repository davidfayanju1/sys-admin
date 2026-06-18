import ImageUpload from "../UI/ImageUpload";
import MultiImageUpload from "../UI/MultiImageUpload";

interface ImageUploadSectionProps {
  primaryImage: string;
  onPrimaryImageChange: (url: string) => void;
  secondaryImages: string[];
  onSecondaryImagesChange: (images: string[]) => void;
}

const ImageUploadSection = ({
  primaryImage,
  onPrimaryImageChange,
  secondaryImages = [],
  onSecondaryImagesChange,
}: ImageUploadSectionProps) => (
  <div className="space-y-5">
    <ImageUpload
      label="Primary Image"
      hint="Main product photo — displayed first in all listings"
      value={primaryImage || ""}
      onChange={onPrimaryImageChange}
    />
    <MultiImageUpload
      label="Additional Images"
      hint="Extra angles, details, or lifestyle shots"
      values={secondaryImages || []}
      onChange={onSecondaryImagesChange}
    />
  </div>
);

export default ImageUploadSection;
