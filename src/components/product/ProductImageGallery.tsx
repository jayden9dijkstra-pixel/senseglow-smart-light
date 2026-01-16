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
      <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-square bg-gradient-to-br from-muted to-background">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <div className="text-6xl">💡</div>
            <p className="text-sm text-muted-foreground">
              [Product foto op warme donkere achtergrond]
            </p>
          </div>
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
    
    if (isLeftSwipe && images.length > 1) {
      handleNext();
    }
    if (isRightSwipe && images.length > 1) {
      handlePrevious();
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image - No card, floats in page background */}
        <div className="relative group">
          <div 
            className="relative aspect-square"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <img
              src={currentImage.url}
              alt={currentImage.altText || productTitle}
              className="absolute inset-0 w-full h-full object-contain cursor-pointer transition-transform duration-500 group-hover:scale-[1.01]"
              onClick={() => setIsZoomed(true)}
            />

            {/* Zoom hint - subtle */}
            <div className="absolute top-4 right-4 bg-background/60 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <ZoomIn className="h-4 w-4 text-foreground/70" />
            </div>

            {/* Navigation arrows - minimal */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/60 hover:bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 h-10 w-10"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/60 hover:bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 h-10 w-10"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            {/* Image counter - subtle */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-foreground/70">
                {selectedIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>

        {/* Thumbnails - no borders, same bg as page, subtle amber outline on active */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1 pt-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden transition-all duration-300 ${
                  selectedIndex === index
                    ? "ring-1 ring-glow"
                    : "opacity-60 hover:opacity-100"
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

      {/* Zoomed Modal - Full screen clean view */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-[95vw] w-full max-h-[95vh] p-0 bg-neutral-950/98 backdrop-blur-md border-none">
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full z-50 h-10 w-10"
              onClick={() => setIsZoomed(false)}
            >
              <X className="h-5 w-5 text-white" />
            </Button>

            {/* Navigation in zoom */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full shadow-lg z-50 h-12 w-12"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full shadow-lg z-50 h-12 w-12"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </Button>
              </>
            )}

            {/* Counter in zoom */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium z-50 text-white">
                {selectedIndex + 1} / {images.length}
              </div>
            )}

            {/* Zoomed image - true to size */}
            <img
              src={currentImage.url}
              alt={currentImage.altText || productTitle}
              className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
