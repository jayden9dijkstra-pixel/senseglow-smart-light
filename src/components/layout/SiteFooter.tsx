export const SiteFooter = () => {
  return (
    <footer className="bg-background text-foreground border-t border-foreground/6">
      <div className="container py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.25em] font-medium mb-6 text-foreground/70">Klantenservice</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="/contact" className="text-foreground/50 hover:text-glow transition-colors duration-500">Contact</a></li>
                <li><a href="/verzending" className="text-foreground/50 hover:text-glow transition-colors duration-500">Verzending</a></li>
                <li><a href="/retourneren" className="text-foreground/50 hover:text-glow transition-colors duration-500">Retourneren</a></li>
                <li><a href="/bestelling-volgen" className="text-foreground/50 hover:text-glow transition-colors duration-500">Bestelling volgen</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.25em] font-medium mb-6 text-foreground/70">Over ons</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/over" className="text-foreground/50 hover:text-glow transition-colors duration-500">Over SenseGlow</a></li>
                <li><a href="/duurzaamheid" className="text-foreground/50 hover:text-glow transition-colors duration-500">Duurzaamheid</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.25em] font-medium mb-6 text-foreground/70">Juridisch</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/privacy" className="text-foreground/50 hover:text-glow transition-colors duration-500">Privacybeleid</a></li>
                <li><a href="/voorwaarden" className="text-foreground/50 hover:text-glow transition-colors duration-500">Algemene voorwaarden</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.25em] font-medium mb-6 text-foreground/70">Blijf op de hoogte</h4>
              <p className="text-sm text-foreground/50">
                Onze socials komen binnenkort. Stuur een mail naar <a href="mailto:hello@senseglow.shop" className="text-glow hover:underline">hello@senseglow.shop</a> als je geen launch wilt missen.
              </p>
            </div>
          </div>
          <div className="text-[11px] text-foreground/30 pt-12 border-t border-foreground/6">
            <p>© 2026 Jayden Ecom (SenseGlow™). Alle rechten voorbehouden. KvK 99634929 · BTW NL005399692B39</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
