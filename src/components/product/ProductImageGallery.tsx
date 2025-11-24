import { useState } from "react";
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

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative group">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-square bg-gradient-to-br from-muted to-background flex items-center justify-center p-4">
            <img
              src={currentImage.url}
              alt={currentImage.altText || productTitle}
              className="max-w-full max-h-full object-contain cursor-pointer transition-transform duration-300 group-hover:scale-105"
              onClick={() => setIsZoomed(true)}
            />

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-orange/30 via-transparent to-transparent pointer-events-none" />

            {/* Zoom hint */}
            <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ZoomIn className="h-5 w-5 text-foreground" />
            </div>

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                {selectedIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Outer glow */}
          <div className="absolute inset-0 bg-brand-orange/10 blur-3xl -z-10 scale-95" />
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedIndex === index
                    ? "border-brand-orange shadow-lg scale-105"
                    : "border-transparent hover:border-muted-foreground/30"
                }`}
              >
                <img
                  src={image.url}
                  alt={`${productTitle} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {selectedIndex === index && (
                  <div className="absolute inset-0 bg-brand-orange/10" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoomed Modal */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-background/95 backdrop-blur-sm">
          <div className="relative w-full h-full flex items-center justify-center p-8">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-background/80 hover:bg-background backdrop-blur-sm rounded-full z-50"
              onClick={() => setIsZoomed(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation in zoom */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background backdrop-blur-sm rounded-full shadow-lg z-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background backdrop-blur-sm rounded-full shadow-lg z-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Counter in zoom */}
            {images.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium z-50">
                {selectedIndex + 1} / {images.length}
              </div>
            )}

            {/* Zoomed image */}
            <img
              src={currentImage.url}
              alt={currentImage.altText || productTitle}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
