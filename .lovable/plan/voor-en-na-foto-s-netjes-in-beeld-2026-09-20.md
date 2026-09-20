# Voor-en-na foto's netjes in beeld

Doel: bij elk product staat de voor-en-na schuif mooi in het kader, met dezelfde uitsnede links en rechts, en een realistische "lamp uit".

## Wat er nu misgaat

- De foto's van Wave, Flex, Wall Lamp en Solar Lantern zijn vierkant, maar het kader op de productpagina is breed (16:10 op desktop). Daardoor wordt boven en onder ongeveer een kwart weggesneden: het beeld lijkt sterk ingezoomd. Bij de Solar Lantern valt dat niet op omdat de lamp precies in het midden staat, bij Wave en Flex wel.
- De "lamp uit" foto van de Flex laat de losse ledpuntjes onder de kap zien. In het echt blijft het gewoon een witte balk, alleen zonder licht.
- Het Ambient-paar heeft twee net iets verschillende formaten, waardoor de twee helften bij het schuiven minimaal kunnen verspringen.

## Wat ik ga doen

1. Voor Wave, Flex, Wall Lamp en Solar Lantern nieuwe brede versies maken van dezelfde scènes, zodat het hele beeld in het kader past zonder strakke uitsnede. Het onderwerp blijft hetzelfde: dezelfde ruimte, dezelfde lamp, dezelfde sfeer.
2. De "lamp uit" foto van de Flex vervangen door exact dezelfde scène als de "lamp aan", maar met de balk uit: gesloten witte kap, geen zichtbare ledpuntjes.
3. Beide helften van elk paar precies even groot maken, zodat de schuif naadloos over hetzelfde beeld loopt.
4. Het Ambient-paar op één formaat zetten.
5. Per product controleren, op desktop en mobiel, of de lamp goed in beeld staat aan beide kanten van de schuif.

## Technisch

- Beelden in `src/assets/ba/` vervangen door 1536x960 (16:10) varianten; nieuwe "uit" beelden worden afgeleid van de bijbehorende "aan" foto zodat de scène identiek blijft.
- `BeforeAfterSection.tsx` houdt `aspect-[4/3] md:aspect-[16/10]`; met bronbeelden in 16:10 blijft de crop op mobiel beperkt en verdwijnt de zoom op desktop.
- Geen wijzigingen in teksten, vertalingen, prijzen, bundels of checkout.
