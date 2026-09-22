# Cookiebalk in alle talen

## Wat ik gecontroleerd heb

**GitHub-koppeling: in orde.** De laatste wijziging staat op GitHub (`fe5146f`, "Cookiebeleid aangepast", vandaag 15:58) en de geschiedenis op GitHub komt regel voor regel overeen met die van Lovable. Ook de eerdere aanpassingen die via VS Code binnenkwamen staan erin: de flex-variantlabels, het retourbeleid (14 vs 30 dagen) en de productspecificaties. De werkmap is schoon, er staat niets open.

**Cookiebalk: werkt, maar staat overal in het Nederlands.** De balk zelf verschijnt nu goed (hij wacht niet meer op Shopify), maar de teksten zijn nieuw en staan nog niet in de Engelse en Franse woordenlijst. Op `/en/` en `/fr/` ziet een bezoeker dus Nederlandse zinnen en knoppen.

## Wat ik ga doen

De vier teksten van de balk toevoegen aan de Engelse en Franse vertalingen:

| Nederlands | Engels | Frans |
| --- | --- | --- |
| Deze site gebruikt cookies om een betere browsingervaring aan u te geven. Voor meer informatie lees ons | This site uses cookies to give you a better browsing experience. For more information, read our | Ce site utilise des cookies pour vous offrir une meilleure expérience de navigation. Pour en savoir plus, consultez notre |
| privacybeleid | privacy policy | politique de confidentialité |
| Alles accepteren | Accept all | Tout accepter |
| Alleen noodzakelijke | Necessary only | Uniquement nécessaires |

De link naar het privacybeleid krijgt automatisch de juiste taalversie (`/en/privacy`, `/fr/privacy`); dat regelt de site al zelf, ik controleer alleen of dat klopt.

## Controle achteraf

Met een browsertest in alle drie de talen, telkens in een verse sessie:
- de balk verschijnt en staat in de taal van de pagina;
- de link gaat naar het privacybeleid in diezelfde taal;
- "Alles accepteren" zet de meting aan en de balk komt na herladen niet terug;
- "Alleen noodzakelijke" laat de meting uit en wordt ook onthouden;
- geen foutmeldingen.

## Technisch

Alleen `src/i18n/en.json` en `src/i18n/fr.json` krijgen nieuwe sleutels. De `DomTranslator` vertaalt per tekstnode op de Nederlandse brontekst, dus de sleutels moeten exact overeenkomen met de losse tekstfragmenten in `CookieConsentBanner.tsx` (de zin vóór de link, het woord "privacybeleid", en de twee knoplabels). Aan de component zelf verandert niets.
