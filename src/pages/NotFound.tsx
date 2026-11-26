import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PageTransition } from "@/components/PageTransition";
import { Seo } from "@/components/seo/Seo";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  useEffect(() => {
    document.body.dataset.notFound = "true";
    return () => {
      delete document.body.dataset.notFound;
    };
  }, []);

  return (
    <PageTransition>
      <Seo
        title="Pagina niet gevonden | SenseGlow"
        description="Deze pagina bestaat niet of is verplaatst. Ga terug naar de homepage van SenseGlow."
        path="/404"
        noindex
      />
      <main className="flex min-h-[70vh] items-center justify-center bg-background px-6 py-20">
        <div className="max-w-md text-center">
          <h1 className="mb-4 text-3xl font-semibold text-foreground">Deze pagina bestaat niet (meer)</h1>
          <p className="mb-8 text-foreground/75">De link klopt niet of de pagina is verplaatst. Kies hieronder waar je verder wilt.</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="min-h-12 rounded-full px-6 bg-cta text-cta-foreground hover:bg-cta-hover">
              <Link to="/">Naar de homepage</Link>
            </Button>
            <Button asChild variant="outline" className="min-h-12 rounded-full px-6">
              <Link to="/producten">Bekijk alle producten</Link>
            </Button>
          </div>
          <p className="mt-8 text-sm text-foreground/75">
            Of ga naar <Link to="/trapverlichting" className="underline">trapverlichting</Link> of <Link to="/contact" className="underline">contact</Link>.
          </p>
        </div>
      </main>
    </PageTransition>
  );
};

export default NotFound;
