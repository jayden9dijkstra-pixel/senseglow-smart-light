/**
 * Klantreviews. Er zijn nog geen geverifieerde reviews van echte kopers,
 * dus er wordt bewust geen score, sterren of aantal getoond.
 */
export const ProductReviewsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-muted/20 to-background">
      <div className="container">
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
