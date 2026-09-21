import { useState, useRef, useCallback, useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X, Grid2X2, Play, Volume2, VolumeX } from "lucide-react";
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProductImage {
  url: string;
  altText: string | null;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productTitle: string;
  videoUrl?: string;
  imageClassName?: string;
}

export const ProductImageGallery = ({
  images,
  productTitle,
  videoUrl = "",
  imageClassName = "w-full h-full object-contain",
}: ProductImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  // Bijhouden welke afbeeldings-URL's niet laden, zodat een kapotte CDN-link
  // een nette placeholder toont in plaats van het browsereigen broken-image-icoon.
  const [brokenImages, setBrokenImages] = useState<Set<number>>(new Set());
  const markImageBroken = useCallback((idx: number) => {
    setBrokenImages((prev) => (prev.has(idx) ? prev : new Set(prev).add(idx)));
  }, []);

  // Touch/swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const minSwipeDistance = 50;

  const hasImages = images && images.length > 0;

  const handlePrevious = useCallback(() => {
    setSelectedIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => Math.min(images.length - 1, prev + 1));
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

  // Lightbox navigation (no wrap)
  const lightboxPrevious = () => {
    setLightboxIndex((prev) => Math.max(0, prev - 1));
  };

  const lightboxNext = () => {
    setLightboxIndex((prev) => Math.min(images.length - 1, prev + 1));
  };

  const openLightbox = (index: number = selectedIndex) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  // Pijltjestoetsen door de lightbox; Escape sluit al via Radix' eigen Dialog.
  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") lightboxPrevious();
      if (e.key === "ArrowRight") lightboxNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLightboxOpen, lightboxIndex, images.length]);

  if (!hasImages) {
    return (
      <div className="relative aspect-square bg-background flex items-center justify-center">
        <div className="text-center space-y-2 p-8">
          <div className="text-4xl">💡</div>
          <p className="text-xs text-muted-foreground">Product foto</p>
        </div>
      </div>
    );
  }

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
          <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-background border-2 border-primary/40 shadow-[0_24px_48px_-12px_rgba(93,64,55,0.08)]">
            {/* Sliding track for smooth horizontal scroll */}
            <div
              className="flex h-full w-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
              onClick={() => !isDragging.current && openLightbox()}
            >
              {images.map((image, idx) => (
                <div key={idx} className="relative flex-shrink-0 w-full h-full">
                  {brokenImages.has(idx) ? (
                    <div className="flex h-full w-full items-center justify-center bg-foreground/[0.03] text-4xl">
                      💡
                    </div>
                  ) : (
                    <img
                      src={image.url}
                      alt={image.altText || productTitle}
                      className={imageClassName}
                      draggable={false}
                      loading={idx === 0 ? "eager" : "lazy"}
                      onError={() => markImageBroken(idx)}
                    />
                  )}
                </div>
              ))}
            </div>

            {videoUrl && (
              <Button
                type="button"
                size="icon"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsVideoOpen(true);
                }}
                className="absolute bottom-4 left-4 h-12 w-12 rounded-sm bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                aria-label="Bekijk productvideo"
              >
                <Play className="h-5 w-5 fill-current" />
              </Button>
            )}

            {/* Desktop navigation arrows - subtle, minimal */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                  disabled={selectedIndex === 0}
                  className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 
                    items-center justify-center w-10 h-10 
                    opacity-0 group-hover:opacity-100 transition-all duration-300
                    hover:text-primary disabled:opacity-0 disabled:pointer-events-none"
                  aria-label="Vorige afbeelding"
                >
                  <ChevronLeft className="h-6 w-6 text-foreground/30 hover:text-primary transition-colors" strokeWidth={1.5} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  disabled={selectedIndex === images.length - 1}
                  className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 
                    items-center justify-center w-10 h-10 
                    opacity-0 group-hover:opacity-100 transition-all duration-300
                    hover:text-primary disabled:opacity-0 disabled:pointer-events-none"
                  aria-label="Volgende afbeelding"
                >
                  <ChevronRight className="h-6 w-6 text-foreground/30 hover:text-primary transition-colors" strokeWidth={1.5} />
                </button>
              </>
            )}

            {/* "View all images" button — floating pill inside the frame */}
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); openLightbox(0); }}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 
                  bg-background/95 backdrop-blur-md text-foreground px-5 py-2.5 
                  rounded-full text-xs font-semibold border border-foreground/10 
                  shadow-sm hover:bg-background transition-all duration-300 whitespace-nowrap z-10"
              >
                <Grid2X2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span>Bekijk alle beelden</span>
              </button>
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
      </div>

      {/* Fullscreen Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogPrimitive.Content
            className="fixed inset-0 z-50 h-[100dvh] w-[100dvw] max-h-[100dvh] max-w-[100dvw] bg-background p-0 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          >
            <div
              className="flex h-full w-full flex-col overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
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
              {/* Top bar */}
              <div className="flex flex-shrink-0 items-center justify-between px-4 py-3">
                <span className="text-xs font-medium tracking-wide text-foreground/40">
                  {lightboxIndex + 1} / {images.length}
                </span>
                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="p-2 text-foreground/50 transition-colors hover:text-foreground"
                  aria-label="Sluiten"
                >
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>

              {/* Main image area */}
              <div className="relative flex-1 min-h-0 px-3 md:px-10 overflow-hidden">
                {images.length > 1 && (
                  <>
                    <button
                      onClick={lightboxPrevious}
                      disabled={lightboxIndex === 0}
                      className="absolute left-1 md:left-4 top-1/2 -translate-y-1/2 p-3 z-20 text-foreground/30 transition-all duration-300 hover:text-primary disabled:opacity-0 disabled:pointer-events-none"
                      aria-label="Vorige afbeelding"
                    >
                      <ChevronLeft className="h-7 w-7 md:h-9 md:w-9" strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={lightboxNext}
                      disabled={lightboxIndex === images.length - 1}
                      className="absolute right-1 md:right-4 top-1/2 -translate-y-1/2 p-3 z-20 text-foreground/30 transition-all duration-300 hover:text-primary disabled:opacity-0 disabled:pointer-events-none"
                      aria-label="Volgende afbeelding"
                    >
                      <ChevronRight className="h-7 w-7 md:h-9 md:w-9" strokeWidth={1.5} />
                    </button>
                  </>
                )}

                <div
                  className="flex h-full w-full transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${lightboxIndex * 100}%)` }}
                >
                  {images.map((image, idx) => (
                    <div key={idx} className="flex-shrink-0 w-full h-full flex items-center justify-center px-2">
                      {brokenImages.has(idx) ? (
                        <div className="flex h-1/2 w-1/2 items-center justify-center text-5xl">💡</div>
                      ) : (
                        <img
                          src={image.url}
                          alt={image.altText || productTitle}
                          className="max-h-full max-w-full object-contain"
                          draggable={false}
                          loading="lazy"
                          onError={() => markImageBroken(idx)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>


              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex-shrink-0 border-t border-foreground/5 px-4 py-3">
                  <div className="flex items-center justify-center gap-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setLightboxIndex(index)}
                        className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 overflow-hidden transition-all duration-300 ${
                          lightboxIndex === index ? "ring-1 ring-primary opacity-100" : "opacity-40 hover:opacity-80"
                        }`}
                        aria-label={`Bekijk afbeelding ${index + 1}`}
                      >
                        {brokenImages.has(index) ? (
                          <div className="flex h-full w-full items-center justify-center bg-foreground/[0.03] text-lg">
                            💡
                          </div>
                        ) : (
                          <img
                            src={image.url}
                            alt={image.altText || `${productTitle} ${index + 1}`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            onError={() => markImageBroken(index)}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>

      {videoUrl && (
        <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
          <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Content className="fixed inset-0 z-50 flex h-[100dvh] w-[100dvw] items-center justify-center bg-foreground p-0 outline-none">
              <DialogPrimitive.Title className="sr-only">Productvideo van {productTitle}</DialogPrimitive.Title>
              <video
                src={videoUrl}
                autoPlay
                muted={isMuted}
                loop
                playsInline
                className="h-full w-full object-contain"
              />
              <Button
                type="button"
                size="icon"
                variant="secondary"
                onClick={() => setIsVideoOpen(false)}
                className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] h-11 w-11 rounded-sm"
                aria-label="Video sluiten"
              >
                <X className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsMuted((value) => !value)}
                className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 min-h-11 -translate-x-1/2 rounded-sm px-5"
              >
                {isMuted ? <VolumeX className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
                {isMuted ? "Geluid aan" : "Geluid uit"}
              </Button>
            </DialogPrimitive.Content>
          </DialogPortal>
        </Dialog>
      )}
    </>
  );
};
