export const SiteFooter = () => {
  return (
    <footer className="bg-background border-t border-foreground/10">
      <div className="container py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-medium mb-6 text-foreground">KLANTENSERVICE</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/contact" className="text-foreground/60 hover:text-glow transition-colors">Contact</a></li>
              <li><a href="/verzending" className="text-foreground/60 hover:text-glow transition-colors">Verzending</a></li>
              <li><a href="/retourneren" className="text-foreground/60 hover:text-glow transition-colors">Retourneren</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-medium mb-6 text-foreground">OVER ONS</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/over" className="text-foreground/60 hover:text-glow transition-colors">Over SenseGlow</a></li>
              <li><a href="/duurzaamheid" className="text-foreground/60 hover:text-glow transition-colors">Duurzaamheid</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-medium mb-6 text-foreground">JURIDISCH</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/privacy" className="text-foreground/60 hover:text-glow transition-colors">Privacybeleid</a></li>
              <li><a href="/voorwaarden" className="text-foreground/60 hover:text-glow transition-colors">Algemene voorwaarden</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-medium mb-6 text-foreground">VOLG ONS</h4>
            <p className="text-sm text-foreground/60">
              Instagram | Facebook | Pinterest
            </p>
          </div>
        </div>
        <div className="text-center text-xs text-foreground/40 pt-8 border-t border-foreground/10">
          <p>© 2025 SenseGlow™. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  );
};
