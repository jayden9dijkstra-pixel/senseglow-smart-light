import { useState, useRef, useCallback, useEffect, type ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X, Play, Volume2, VolumeX } from "lucide-react";
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { preloadImage, responsiveImg, shopifySized } from "@/lib/shopifyImage";

interface ProductImage {
  url: string;
  altText: string | null;
  width?: number | null;
  height?: number | null;
}

const MAIN_SIZES = "(min-width: 768px) 50vw, 100vw";

interface ProductImageGalleryProps {
  images: ProductImage[];
  productTitle: string;
  videoUrl?: string;
  imageClassName?: string;
  /** Eigen Shopify-foto van de gekozen variant; de galerij springt erheen. */
  activeImageUrl?: string | null;
  /** Eerste dia vóór de foto's, bijvoorbeeld de voor/na-schuif. */
  leadSlide?: ReactNode;
}

export const ProductImageGallery = ({
  images,
  productTitle,
  videoUrl = "",
  imageClassName = "h-full w-full object-contain",
  activeImageUrl,
  leadSlide,
}: ProductImageGalleryProps) => {
  const offset = leadSlide ? 1 : 0;
  const total = images.length + offset;
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    if (!activeImageUrl) return;
    const idx = images.findIndex((img) => img.url === activeImageUrl);
    if (idx >= 0) setSelectedIndex(idx + offset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeImageUrl, images.length]);
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
  const firstUrl = images[0]?.url;
  useEffect(() => {
    if (firstUrl && !leadSlide) preloadImage(firstUrl, MAIN_SIZES);
  }, [firstUrl, leadSlide]);
  // Mobiel: elke foto in zijn eigen verhouding, nooit bijgesneden (max. 70% schermhoogte).
  const current = images[selectedIndex - offset];
  const ratio = current?.width && current?.height ? current.width / current.height : 1;

  const handlePrevious = useCallback(() => {
    setSelectedIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => Math.min(total - 1, prev + 1));
  }, [total]);

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
    
    if (isLeftSwipe && total > 1) handleNext();
    if (isRightSwipe && total > 1) handlePrevious();
    
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
      
      if (isLeftSwipe && total > 1) handleNext();
      if (isRightSwipe && total > 1) handlePrevious();
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

  const openLightbox = (index: number = selectedIndex - offset) => {
    if (index < 0) return;
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
      <div className="space-y-2 md:space-y-4">
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
          <div style={{ ["--ar" as string]: ratio }} className="relative -mx-6 h-[min(calc(100vw/var(--ar)),70svh)] overflow-hidden bg-secondary/60 transition-[height] duration-300 md:mx-0 md:h-auto md:aspect-square md:rounded-[2rem] md:border md:border-foreground/10">
            <div
              className="flex h-full w-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
              onClick={() => !isDragging.current && openLightbox()}
            >
              {leadSlide && (
                <div
                  className="relative h-full w-full flex-shrink-0"
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  {leadSlide}
                </div>
              )}
              {images.map((image, idx) => (
                <div key={idx} className="relative flex-shrink-0 w-full h-full">
                  {brokenImages.has(idx) ? (
                    <div className="flex h-full w-full items-center justify-center bg-foreground/[0.03] text-4xl">
                      💡
                    </div>
                  ) : (
                    <img
                      {...responsiveImg(image.url, MAIN_SIZES)}
                      width={image.width ?? undefined}
                      height={image.height ?? undefined}
                      alt={image.altText || productTitle}
                      className={imageClassName}
                      draggable={false}
                      decoding="async"
                      loading={Math.abs(idx + offset - selectedIndex) <= 1 ? "eager" : "lazy"}
                      {...(idx === 0 && !leadSlide ? { fetchpriority: "high" } : {})}
                      onError={() => markImageBroken(idx)}
                    />
                  )}
                </div>
              ))}
            </div>

            {videoUrl && selectedIndex === offset && (
              <Button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsVideoOpen(true);
                }}
                className="absolute bottom-4 left-4 h-12 gap-2 rounded-full bg-primary px-5 text-base text-primary-foreground shadow-lg hover:bg-primary/90"
              >
                <Play className="h-5 w-5 fill-current" aria-hidden /> Bekijk video
              </Button>
            )}

            {total > 1 && (
              <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-background/90 px-3 py-1 text-sm font-medium text-foreground" aria-live="polite">
                {selectedIndex + 1}/{total}
              </span>
            )}

            {total > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                  disabled={selectedIndex === 0}
                  className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none"
                  aria-label="Vorige afbeelding"
                >
                  <ChevronLeft className="h-6 w-6 text-foreground/40 hover:text-primary transition-colors" strokeWidth={1.5} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  disabled={selectedIndex === total - 1}
                  className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none"
                  aria-label="Volgende afbeelding"
                >
                  <ChevronRight className="h-6 w-6 text-foreground/40 hover:text-primary transition-colors" strokeWidth={1.5} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Kleine thumbnails onder de foto, in de Shopify-volgorde */}
        {images.length > 1 && (
          <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 md:mx-0 md:px-0" aria-label="Alle foto's">
            {images.map((image, idx) => (
              <button
                key={image.url}
                type="button"
                onClick={() => setSelectedIndex(idx + offset)}
                aria-label={`Foto ${idx + 1}`}
                aria-current={selectedIndex === idx + offset}
                className={`h-14 w-14 flex-none overflow-hidden rounded-lg border-2 bg-secondary md:h-16 md:w-16 ${selectedIndex === idx + offset ? "border-primary" : "border-transparent"}`}
              >
                <img src={shopifySized(image.url, 160)} alt="" width={56} height={56} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </button>
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
                          src={shopifySized(image.url, 1200)}
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
                            src={shopifySized(image.url, 200)}
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
