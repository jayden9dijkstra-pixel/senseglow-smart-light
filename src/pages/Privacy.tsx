import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

const Placeholder = ({ children }: { children: string }) => (
  <span className="px-2 py-0.5 bg-muted/40 border border-dashed border-foreground/20 rounded text-foreground/50 text-sm font-mono">
    {children}
  </span>
);

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="container py-12 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug naar home
        </Button>

        {/* Top banner */}
        <Card className="border-glow/40 bg-glow/5 mb-8">
          <CardContent className="p-5 flex gap-3">
            <AlertCircle className="h-5 w-5 text-glow flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/70">
              <strong>Template-versie.</strong> Deze privacyverklaring is geschreven volgens AVG-richtlijnen. Vóór live gaan: laat deze tekst nakijken door een NL-jurist of via een dienst als Ligo, ICTRecht, of vergelijkbaar. SenseGlow is verantwoordelijk voor de uiteindelijke inhoud.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-foreground">Privacyverklaring</h1>
            <p className="text-sm text-foreground/50">
              Laatst bijgewerkt: <Placeholder>[datum]</Placeholder>
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Inleiding</h2>
            <p className="text-foreground/70 leading-relaxed">
              SenseGlow verwerkt persoonsgegevens van bezoekers en klanten. In deze verklaring lees je welke gegevens we verwerken, waarom, hoe lang, en welke rechten je hebt. We houden ons aan de Algemene Verordening Gegevensbescherming (AVG/GDPR).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">1. Wie zijn wij?</h2>
            <div className="text-foreground/70 leading-relaxed space-y-1">
              <p>SenseGlow is gevestigd in Nederland.</p>
              <p>KvK-nummer: <Placeholder>[KvK-nummer]</Placeholder></p>
              <p>BTW-nummer: <Placeholder>[BTW-nummer]</Placeholder></p>
              <p>Vestigingsadres: <Placeholder>[Vestigingsadres]</Placeholder></p>
              <p>Contact: <a href="mailto:support@senseglow.shop" className="text-glow hover:underline">support@senseglow.shop</a></p>
              <p className="pt-2">Voor vragen over deze privacyverklaring of het uitoefenen van je rechten, mail support@senseglow.shop.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">2. Welke persoonsgegevens verwerken we?</h2>
            <p className="text-foreground/70">We verwerken de volgende gegevens, alleen wanneer je ze actief deelt of wanneer ze nodig zijn voor de uitvoering van onze dienst:</p>
            <ul className="space-y-2 text-foreground/70 list-disc pl-6">
              <li><strong>Bij een bestelling:</strong> voor- en achternaam, e-mailadres, bezorgadres, factuuradres, telefoonnummer (alleen voor bezorging), betaalgegevens (afgehandeld door betaalprovider).</li>
              <li><strong>Bij contact:</strong> naam, e-mailadres, inhoud van je bericht.</li>
              <li><strong>Bij websitegebruik:</strong> IP-adres, browsertype, bezochte pagina's, klikgedrag, verwijzende website (analytisch).</li>
              <li><strong>Bij marketing (alleen na opt-in):</strong> e-mailadres voor nieuwsbrief.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">3. Waarom verwerken we deze gegevens?</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-foreground/10">
                <thead className="bg-background-secondary">
                  <tr>
                    <th className="text-left p-3 border-b border-foreground/10">Doel</th>
                    <th className="text-left p-3 border-b border-foreground/10">Welke gegevens</th>
                    <th className="text-left p-3 border-b border-foreground/10">Rechtsgrondslag</th>
                  </tr>
                </thead>
                <tbody className="text-foreground/70">
                  {[
                    ["Uitvoeren bestelling", "NAW, e-mail, betaalgegevens", "Uitvoering overeenkomst"],
                    ["Klantenservice", "Contactgegevens + berichtinhoud", "Uitvoering overeenkomst"],
                    ["Verzending", "NAW + telefoonnummer", "Uitvoering overeenkomst"],
                    ["Boekhouding (factuur)", "NAW + bestelgegevens", "Wettelijke verplichting"],
                    ["Website-analyse", "IP, browsergegevens, gedrag", "Gerechtvaardigd belang"],
                    ["Marketing-e-mail", "E-mailadres", "Toestemming"],
                    ["Retargeting/advertenties", "Cookies, browsergedrag", "Toestemming"],
                  ].map(([a, b, c]) => (
                    <tr key={a} className="border-b border-foreground/10">
                      <td className="p-3">{a}</td>
                      <td className="p-3">{b}</td>
                      <td className="p-3">{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">4. Hoe lang bewaren we je gegevens?</h2>
            <ul className="space-y-1 text-foreground/70 list-disc pl-6">
              <li>Bestelgegevens (incl. factuur): 7 jaar (fiscale bewaarplicht)</li>
              <li>Klantenservice-correspondentie: 2 jaar na laatste contact</li>
              <li>Nieuwsbrief-data: tot je je uitschrijft</li>
              <li>Website-analytics: maximaal 26 maanden</li>
              <li>Cookies: zie ons cookie-statement</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">5. Met wie delen we je gegevens?</h2>
            <p className="text-foreground/70">Voor het uitvoeren van onze dienst werken we met de volgende verwerkers/partijen:</p>
            <ul className="space-y-2 text-foreground/70 list-disc pl-6">
              <li><strong>Shopify</strong> (Canada/VS) — onze webshop-platform en betaalverwerking. Waarborg: EU-Standard Contractual Clauses (SCC's).</li>
              <li><strong>DHL</strong> (Nederland/EU) — bezorging van pakketten. Ontvangt NAW + telefoonnummer.</li>
              <li><strong>17TRACK</strong> (China) — pakkettracking. Ontvangt alleen track-code, geen persoonsgegevens.</li>
              <li><strong>Betaalprovider</strong> (Mollie, Stripe, of vergelijkbaar — EU) — verwerkt betalingen.</li>
              <li><strong>E-mailprovider</strong> — ontvangt e-mailadres + naam voor transactionele en marketing-mails.</li>
              <li><strong>Meta (Facebook/Instagram)</strong> — alleen na cookie-toestemming.</li>
              <li><strong>TikTok</strong> — alleen na cookie-toestemming.</li>
            </ul>
            <p className="text-foreground/70">We verkopen geen persoonsgegevens aan derden.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">6. Doorgifte buiten de EU</h2>
            <p className="text-foreground/70 leading-relaxed">
              Sommige van onze verwerkers (Shopify, 17TRACK, Meta, TikTok) zijn gevestigd buiten de Europese Economische Ruimte (EER). We hebben passende waarborgen getroffen door middel van EU-Standard Contractual Clauses (SCC's) en/of bestaande adequaatheidsbesluiten.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">7. Cookies</h2>
            <p className="text-foreground/70 leading-relaxed">
              Onze website gebruikt cookies. Bij je eerste bezoek vragen we expliciete toestemming voor niet-functionele cookies (analytics, marketing). Functionele cookies (winkelwagen, sessie) zijn altijd actief.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">8. Jouw rechten</h2>
            <p className="text-foreground/70">Onder de AVG heb je de volgende rechten:</p>
            <ul className="space-y-1 text-foreground/70 list-disc pl-6">
              <li><strong>Recht op inzage</strong> — opvragen welke gegevens we van je hebben.</li>
              <li><strong>Recht op correctie</strong> — onjuiste gegevens laten aanpassen.</li>
              <li><strong>Recht op verwijdering</strong> — je gegevens laten wissen.</li>
              <li><strong>Recht op beperking</strong> — verwerking tijdelijk laten stoppen.</li>
              <li><strong>Recht op dataportabiliteit</strong> — je gegevens in een gangbaar formaat ontvangen.</li>
              <li><strong>Recht van bezwaar</strong> — bezwaar maken tegen verwerking.</li>
              <li><strong>Recht om toestemming in te trekken</strong> — bv. uitschrijven nieuwsbrief.</li>
            </ul>
            <p className="text-foreground/70">Een verzoek doe je via support@senseglow.shop. We reageren binnen 30 dagen.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">9. Klacht indienen</h2>
            <p className="text-foreground/70 leading-relaxed">
              Heb je een klacht over hoe wij met je gegevens omgaan? Probeer het eerst met ons op te lossen via support@senseglow.shop. Lukt dat niet, dan kun je een klacht indienen bij de Autoriteit Persoonsgegevens via autoriteitpersoonsgegevens.nl.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">10. Wijzigingen</h2>
            <p className="text-foreground/70 leading-relaxed">
              Deze privacyverklaring kan gewijzigd worden. De meest recente versie staat altijd op senseglow.shop/privacy met de datum van laatste wijziging bovenaan.
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default Privacy;
