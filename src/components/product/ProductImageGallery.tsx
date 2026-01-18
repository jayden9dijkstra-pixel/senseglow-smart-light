import { useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Grid2X2 } from "lucide-react";
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  // Touch/swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
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

  const handlePrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Touch events for main gallery
  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
    isDragging.current = false;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
    if (touchStartX.current && Math.abs(touchStartX.current - e.targetTouches[0].clientX) > 10) {
      isDragging.current = true;
    }
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && images.length > 1) handleNext();
    if (isRightSwipe && images.length > 1) handlePrevious();
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Mouse drag for desktop (trackpad support)
  const onMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
    isDragging.current = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (touchStartX.current === null) return;
    touchEndX.current = e.clientX;
    if (Math.abs(touchStartX.current - e.clientX) > 10) {
      isDragging.current = true;
    }
  };

  const onMouseUp = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const distance = touchStartX.current - touchEndX.current;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;
      
      if (isLeftSwipe && images.length > 1) handleNext();
      if (isRightSwipe && images.length > 1) handlePrevious();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const onMouseLeave = () => {
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Lightbox navigation
  const lightboxPrevious = () => {
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const lightboxNext = () => {
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const openLightbox = (index: number = selectedIndex) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <>
      {/* Main Gallery Container */}
      <div className="space-y-4">
        {/* Main Image with swipe */}
        <div 
          ref={containerRef}
          className="relative group cursor-grab active:cursor-grabbing select-none"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
        >
          <div className="relative aspect-square overflow-hidden">
            {/* Image with smooth transition */}
            <div 
              className="absolute inset-0 transition-opacity duration-500 ease-out"
              onClick={() => !isDragging.current && openLightbox()}
            >
              <img
                src={currentImage.url}
                alt={currentImage.altText || productTitle}
                className="w-full h-full object-contain"
                draggable={false}
              />
            </div>

            {/* Desktop navigation arrows - subtle, minimal */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                  className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 
                    items-center justify-center w-10 h-10 
                    opacity-0 group-hover:opacity-100 transition-all duration-300
                    hover:text-primary"
                  aria-label="Vorige afbeelding"
                >
                  <ChevronLeft className="h-6 w-6 text-foreground/30 hover:text-primary transition-colors" strokeWidth={1.5} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 
                    items-center justify-center w-10 h-10 
                    opacity-0 group-hover:opacity-100 transition-all duration-300
                    hover:text-primary"
                  aria-label="Volgende afbeelding"
                >
                  <ChevronRight className="h-6 w-6 text-foreground/30 hover:text-primary transition-colors" strokeWidth={1.5} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Dot indicators - minimal, always visible on mobile */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  selectedIndex === index 
                    ? 'w-6 h-1.5 bg-primary' 
                    : 'w-1.5 h-1.5 bg-foreground/20 hover:bg-foreground/40'
                }`}
                aria-label={`Ga naar afbeelding ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* "View all images" button - clean, architectural */}
        {images.length > 1 && (
          <button
            onClick={() => openLightbox(0)}
            className="flex items-center justify-center gap-2 w-full py-3 
              text-xs font-medium text-foreground/50 
              hover:text-primary transition-colors duration-300
              tracking-wide uppercase"
          >
            <Grid2X2 className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>Bekijk alle beelden</span>
          </button>
        )}
      </div>

      {/* Fullscreen Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-none w-screen h-screen p-0 bg-background border-none [&>button]:hidden">
          <div 
            className="relative w-full h-full flex flex-col"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={() => {
              if (!touchStartX.current || !touchEndX.current) return;
              const distance = touchStartX.current - touchEndX.current;
              if (distance > minSwipeDistance) lightboxNext();
              if (distance < -minSwipeDistance) lightboxPrevious();
              touchStartX.current = null;
              touchEndX.current = null;
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 text-foreground/50 hover:text-foreground transition-colors"
              aria-label="Sluiten"
            >
              <X className="h-6 w-6" strokeWidth={1.5} />
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 z-50 text-xs text-foreground/40 font-medium tracking-wide">
              {lightboxIndex + 1} / {images.length}
            </div>

            {/* Main lightbox image - proper sizing */}
            <div className="flex-1 flex items-center justify-center px-12 md:px-20 py-16 md:py-20 min-h-0">
              <img
                src={images[lightboxIndex].url}
                alt={images[lightboxIndex].altText || productTitle}
                className="max-w-full max-h-full w-auto h-auto object-contain"
                draggable={false}
              />
            </div>

            {/* Lightbox navigation arrows - visible on all devices */}
            {images.length > 1 && (
              <>
                <button
                  onClick={lightboxPrevious}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 z-50
                    text-foreground/30 hover:text-primary transition-colors duration-300"
                  aria-label="Vorige afbeelding"
                >
                  <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" strokeWidth={1.5} />
                </button>
                <button
                  onClick={lightboxNext}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 z-50
                    text-foreground/30 hover:text-primary transition-colors duration-300"
                  aria-label="Volgende afbeelding"
                >
                  <ChevronRight className="h-6 w-6 md:h-8 md:w-8" strokeWidth={1.5} />
                </button>
              </>
            )}

            {/* Thumbnail strip at bottom of lightbox */}
            {images.length > 1 && (
              <div className="flex-shrink-0 flex items-center justify-center gap-2 py-3 md:py-4 px-4 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setLightboxIndex(index)}
                    className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 overflow-hidden transition-all duration-300 ${
                      lightboxIndex === index 
                        ? 'ring-1 ring-primary' 
                        : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.altText || `${productTitle} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
