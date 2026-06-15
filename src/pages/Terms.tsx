import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";


const Article = ({ n, title, children }: { n: number; title: string; children: React.ReactNode }) => (
  <section className="space-y-3">
    <h2 className="text-xl font-semibold">Artikel {n}, {title}</h2>
    <div className="text-foreground/70 leading-relaxed space-y-3">{children}</div>
  </section>
);

const Terms = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="container py-12 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug naar home
        </Button>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-foreground">Algemene Voorwaarden</h1>
            <p className="text-sm text-foreground/50">
              Laatst bijgewerkt: 15 juni 2026
            </p>
          </div>

          <Article n={1} title="Identiteit van de ondernemer">
            <p>Jayden Ecom (handelend onder de naam SenseGlow™)</p>
            <p>Vestigingsadres: Tolheksleane 4 A, 8821 MD Kimswerd</p>
            <p>KvK-nummer: 99634929</p>
            <p>BTW-nummer: NL005399692B39</p>
            <p>E-mail: support@senseglow.shop</p>
            <p>Website: senseglow.shop</p>
          </Article>


          <Article n={2} title="Toepasselijkheid">
            <p>Deze algemene voorwaarden zijn van toepassing op elk aanbod van SenseGlow en op elke tot stand gekomen overeenkomst tussen SenseGlow en de consument. De tekst van deze voorwaarden is vóór het sluiten van de overeenkomst voor de consument beschikbaar op senseglow.shop/voorwaarden.</p>
          </Article>

          <Article n={3} title="Het aanbod">
            <p>Alle producten op senseglow.shop zijn met zorg samengesteld. Aanbiedingen bevatten een omschrijving, productfoto's, en prijs (incl. BTW, in euro's). Kennelijke vergissingen of fouten binden SenseGlow niet.</p>
          </Article>

          <Article n={4} title="De overeenkomst">
            <p>De overeenkomst komt tot stand op het moment dat de consument een bestelling plaatst en SenseGlow deze elektronisch bevestigt per e-mail. Tot dat moment kan SenseGlow de bestelling weigeren of aanvullende voorwaarden stellen.</p>
          </Article>

          <Article n={5} title="Prijzen en betaling">
            <p>Alle prijzen zijn in euro's en inclusief 21% BTW, exclusief verzendkosten (verzending is gratis binnen Nederland). Betaling vindt plaats via de op de website aangeboden betaalmethoden. SenseGlow gebruikt erkende betaalproviders; betaalgegevens worden niet door SenseGlow zelf opgeslagen.</p>
          </Article>

          <Article n={6} title="Levering">
            <p>SenseGlow verzendt bestellingen binnen 1-3 werkdagen na ontvangst. De gemiddelde bezorgtijd is 7-14 werkdagen via DHL. SenseGlow levert binnen Nederland; verzending naar het buitenland is op dit moment niet beschikbaar.</p>
            <p>Het risico van beschadiging of vermissing van producten berust bij SenseGlow tot het moment van bezorging aan de consument.</p>
          </Article>

          <Article n={7} title="Herroepingsrecht">
            <p>De consument heeft het recht om de overeenkomst binnen <strong>30 dagen</strong> zonder opgave van redenen te ontbinden, dit is langer dan de wettelijke 14 dagen termijn. Deze periode gaat in op de dag na ontvangst van het product.</p>
            <p>Tijdens de bedenktijd zal de consument zorgvuldig omgaan met het product en de verpakking. Hij/zij mag het product slechts uitpakken en gebruiken voor zover dat nodig is om de aard en het functioneren ervan vast te stellen.</p>
            <p>Om gebruik te maken van het herroepingsrecht, stuurt de consument een ondubbelzinnige verklaring per e-mail naar support@senseglow.shop, of gebruikt het modelformulier voor herroeping (beschikbaar op senseglow.shop/retourneren).</p>
          </Article>

          <Article n={8} title="Kosten van retournering">
            <p>De directe kosten van het retourneren komen voor rekening van de consument, tenzij het product defect is of niet conform de overeenkomst is geleverd. In dat geval vergoedt SenseGlow ook de retourkosten.</p>
          </Article>

          <Article n={9} title="Terugbetaling">
            <p>SenseGlow vergoedt de van de consument ontvangen betalingen (inclusief eventuele leveringskosten) binnen 14 dagen na ontvangst van de retourzending, mits het product onbeschadigd retour is. Terugbetaling vindt plaats via dezelfde betaalmethode als waarmee de oorspronkelijke transactie is verricht.</p>
          </Article>

          <Article n={10} title="Garantie">
            <p>SenseGlow biedt <strong>bovenop de wettelijke conformiteitsrechten</strong> een additionele functionele garantie van <strong>één jaar</strong> op alle producten. Deze garantie laat de wettelijke rechten van de consument uit hoofde van non-conformiteit onverlet, de consument behoudt te allen tijde zijn wettelijke rechten.</p>
            <p>De garantie geldt voor defecten bij normaal gebruik. Schade door val, water (uitgezonderd IP65-gecertificeerde producten zoals de Solar Lantern), of opzettelijke beschadiging vallen niet onder de garantie.</p>
          </Article>

          <Article n={11} title="Klachtenregeling">
            <p>Klachten over de uitvoering van de overeenkomst moeten binnen redelijke tijd nadat de consument de gebreken heeft geconstateerd, volledig en duidelijk omschreven worden ingediend bij SenseGlow via support@senseglow.shop.</p>
            <p>Bij SenseGlow ingediende klachten worden binnen 14 dagen vanaf de datum van ontvangst beantwoord. Als een klacht een voorzienbaar langere verwerkingstijd vraagt, wordt door SenseGlow binnen 14 dagen geantwoord met een bericht van ontvangst en een indicatie wanneer de consument een meer uitvoerig antwoord kan verwachten.</p>
          </Article>

          <Article n={12} title="Geschillen">
            <p>Op overeenkomsten tussen SenseGlow en de consument waarop deze algemene voorwaarden betrekking hebben, is uitsluitend Nederlands recht van toepassing.</p>
            <p>Conform de Europese ODR-Verordening kunnen consumenten ook gebruikmaken van het Europees ODR-platform om geschillen online op te lossen: ec.europa.eu/consumers/odr.</p>
          </Article>

          <Article n={13} title="Wijzigingen">
            <p>SenseGlow behoudt zich het recht voor deze algemene voorwaarden te wijzigen. De meest recente versie staat altijd op senseglow.shop/voorwaarden met de datum van laatste wijziging bovenaan.</p>
          </Article>
        </div>
      </div>
    </PageLayout>
  );
};

export default Terms;
