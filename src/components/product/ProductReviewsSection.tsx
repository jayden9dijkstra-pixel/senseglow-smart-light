/**
 * Klantreviews. Er zijn nog geen geverifieerde reviews van echte kopers,
 * dus er wordt bewust geen score, sterren of aantal getoond.
 */
export const ProductReviewsSection = () => {
  return (
    <section id="reviews" className="w-full scroll-mt-24 overflow-hidden bg-background py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Klantreviews
          </h2>
          <p className="text-base text-foreground/60">
            Nog geen klantreviews. We plaatsen hier uitsluitend beoordelingen van
            mensen die het product daadwerkelijk hebben gekocht, positief of negatief.
          </p>
        </div>
      </div>
    </section>
  );
};
