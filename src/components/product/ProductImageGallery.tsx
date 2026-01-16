import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ProductImage {
  url: string;
  altText: string | null;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productTitle: string;
}

export const ProductImageGallery = ({ images, productTitle }: ProductImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50;

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square bg-background flex items-center justify-center">
        <div className="text-center space-y-2 p-8">
          <div className="text-4xl">💡</div>
          <p className="text-xs text-muted-foreground">Product foto</p>
        </div>
      </div>
    );
  }

  const currentImage = images[selectedIndex];

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && images.length > 1) handleNext();
    if (isRightSwipe && images.length > 1) handlePrevious();
  };

  return (
    <>
      <div className="flex gap-4">
        {/* Main Image */}
        <div className="relative group flex-1">
          <div 
            className="relative aspect-square"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <img
              src={currentImage.url}
              alt={currentImage.altText || productTitle}
              className="absolute inset-0 w-full h-full object-contain cursor-pointer"
              onClick={() => setIsZoomed(true)}
            />

            {/* Zoom hint */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ZoomIn className="h-4 w-4 text-foreground/40" />
            </div>

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-foreground/50">
                {selectedIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>

        {/* Thumbnails - right side, vertical */}
        {images.length > 1 && (
          <div className="flex flex-col gap-2 w-16">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`relative w-16 h-16 transition-all duration-300 ${
                  selectedIndex === index
                    ? "ring-1 ring-glow"
                    : "opacity-50 hover:opacity-100"
                }`}
              >
                <img
                  src={image.url}
                  alt={`${productTitle} ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoomed Modal */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-[95vw] w-full max-h-[95vh] p-0 bg-neutral-950/98 border-none">
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 h-10 w-10 text-white"
              onClick={() => setIsZoomed(false)}
            >
              <X className="h-5 w-5" />
            </Button>

            {images.length > 1 && (
              <>
                <Button variant="ghost" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 z-50 h-10 w-10 text-white" onClick={handlePrevious}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 z-50 h-10 w-10 text-white" onClick={handleNext}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            <img
              src={currentImage.url}
              alt={currentImage.altText || productTitle}
              className="max-w-[90vw] max-h-[85vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};