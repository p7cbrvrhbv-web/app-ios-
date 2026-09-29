# Lot 2 : 12 nouveaux niveaux

Même méthode que [`IMAGES.md`](IMAGES.md) : colle le **style commun** au début de chaque prompt, génère 4 variantes,
contrôle qu'il n'y a **qu'un seul** anachronisme, puis envoie-moi les images (ou place-les avec `tools/editor.html`).

Leçon du premier lot : les générateurs ajoutent souvent des exemplaires en trop (trois drones au lieu d'un).
Chaque prompt se termine donc par une phrase qui insiste. Si un exemplaire en trop reste, on le déclare dans `also`.

**Style commun**
```
Hyper-realistic cinematic photograph, vertical 9:16, 35mm lens, warm natural light, shallow depth of field on the
edges but sharp in the center, rich detail, lively crowded scene with many props and people as visual camouflage,
photorealistic textures, no watermark, no logo, no readable text.
```

**Difficulté** : la taille de l'intrus en % de la largeur de l'image. Grand (8 % et plus) = facile, moyen (4 à 6 %), petit
(2 à 3 %) = difficile. Le jeu marche mieux avec une courbe : faciles en premier, difficiles ensuite.

## Moyen Âge (4)

### `ma-scriptorium` : Le scriptorium (moyen)
```
[style commun] The scriptorium of a medieval monastery, 13th century: monks in brown habits copying illuminated
manuscripts at wooden desks, ink pots, quills, candles, parchment, colored light falling through arched windows.
Exactly ONE out-of-time object: a modern blue plastic ballpoint pen lying on a desk next to an inkwell, in the lower
right third of the image, about 4% of the image width, clearly visible. There is only one modern object in the whole
image and no other pen of this kind.
```
Texte : « Stylo à bille : breveté par László Bíró en 1938. »

### `ma-taverne` : La taverne (facile)
```
[style commun] A crowded medieval tavern, 14th century: timber beams, long wooden tables, pewter mugs, roast meat,
candlelight and a big fireplace, travelers laughing. Exactly ONE out-of-time object: a modern incandescent light bulb
hanging on a cord from a ceiling beam among the candle lanterns, in the upper center of the image, about 6% of the
image width. There is only one modern object in the whole image.
```
Texte : « Ampoule électrique : l'ampoule à filament d'Edison date de 1879. »

### `ma-forge` : La forge (moyen)
```
[style commun] A medieval blacksmith's forge: glowing embers, anvil, hammers, tongs, sparks, a sweating smith and his
apprentice, iron horseshoes hanging on the wall. Exactly ONE out-of-time object: a plain red aluminium soda can with no
logo and no text, standing on the workbench among the tools, about 4% of the image width, clearly visible. There is only
one modern object in the whole image.
```
Texte : « Canette en aluminium : elle se répand à partir des années 1960. »

### `ma-camp` : Le camp du siège (difficile)
```
[style commun] A medieval army camp outside a castle at dawn: tents with pennants, archers, squires sharpening swords,
horses, campfires and smoke, a besieged stone castle in the background. Exactly ONE out-of-time object: a squire in the
middle ground wears modern black over-ear headphones around his neck, about 3% of the image width, clearly recognizable.
There is only one modern object in the whole image.
```
Texte : « Casque audio : le Walkman de Sony sort en 1979. »

## Égypte (4)

### `eg-scribe` : Le scribe (moyen)
```
[style commun] An Egyptian scribe sitting cross-legged on a temple floor writing on papyrus, walls covered with painted
hieroglyphs, tall columns, oil lamps, apprentices around him. Exactly ONE out-of-time object: the scribe wears modern
round wire-frame glasses on his nose, clearly visible, about 3% of the image width. There is only one modern object in
the whole image.
```
Texte : « Lunettes : elles apparaissent en Italie vers 1286. »

### `eg-marche` : Le marché de Thèbes (difficile)
```
[style commun] A busy Egyptian riverside market in Thebes: vendors with baskets of dates, fish, clay jars, linen cloth,
donkeys, children playing, palm trees. Exactly ONE out-of-time object: a small printed black and white barcode label
(bars only, no digits, no text) stuck on the side of a clay jar in the lower half of the image, about 3% of the image
width. There is only one modern object in the whole image.
```
Texte : « Code-barres : le premier produit scanné en caisse l'est en 1974. »

### `eg-banquet` : Le banquet (facile)
```
[style commun] A pharaonic banquet in a palace: musicians with harps, lutes and flutes, dancers, guests in white linen
wearing lotus flowers, servants pouring wine, golden vessels, torchlight. Exactly ONE out-of-time object: one of the
musicians plays a modern electric guitar in the middle of the image, about 12% of the image width. There is only one
modern object in the whole image.
```
Texte : « Guitare électrique : les premières datent des années 1930. »

### `eg-cour` : La cour du temple (facile)
```
[style commun] The courtyard of an Egyptian temple: massive painted columns, priests in white linen, offering tables
with bread and fruit, incense smoke, sunbeams, an obelisk. Exactly ONE out-of-time object: a white molded plastic chair
standing between two columns on the left half of the image, about 8% of the image width. There is only one modern object
in the whole image.
```
Texte : « Chaise en plastique moulé : les premières datent des années 1960. »

## USA années 80 (4)

### `us-arcade` : La salle d'arcade (facile)
```
[style commun] A crowded 1985 video arcade at night, lit by screens and neon: rows of upright arcade cabinets with glowing pixel screens,
neon lights, geometric patterned carpet, teenagers with big hair and jean jackets. Exactly ONE out-of-time object: one
teenager wears a modern virtual reality headset over his eyes, in the lower left third of the image, about 8% of the
image width. There is only one modern object in the whole image.
```
Texte : « Casque de réalité virtuelle : les modèles grand public arrivent en 2016. »

### `us-salon` : Le salon (difficile)
```
[style commun] A 1985 American family living room: wood-paneled walls, floral sofa, a CRT television with rabbit-ear
antenna on a wooden stand, VHS tapes, shag carpet, a family of four watching TV. Exactly ONE out-of-time object: a small
white modern Wi-Fi router with two antennas standing on a bookshelf in the background, about 3% of the image width. There
is only one modern object in the whole image.
```
Texte : « Routeur Wi-Fi : la première norme Wi-Fi apparaît en 1997. »

### `us-station` : La station-service (moyen)
```
[style commun] A 1985 American gas station at dusk, warm low light: analog pumps, a red pickup truck and a station wagon, neon
signs, an attendant in a cap, long shadows. Exactly ONE out-of-time object: a modern white electric-vehicle charging
station with a green cable, standing next to the pumps, about 6% of the image width. There is only one modern object in
the whole image.
```
Texte : « Borne de recharge : elles se répandent dans les années 2010. »

### `us-mall` : Le centre commercial (moyen)
```
[style commun] A 1985 American shopping mall: neon signs, a fountain, planters with palms, pastel storefronts, teenagers
with hairspray hair and cassette players. Exactly ONE out-of-time object: a small round robot vacuum cleaner moving on
the floor in the lower half of the image, about 5% of the image width. There is only one modern object in the whole image.
```
Texte : « Aspirateur robot : le Roomba sort en 2002. »

## Avant de publier

- Recoupe chaque date avec une source fiable : je les ai écrites de mémoire.
- Évite les objets qui ressemblent trop à un produit de marque identifiable : la montre du niveau « Le tournoi » ressemble
  déjà beaucoup à un modèle célèbre. Préfère les formes génériques.
- Idées d'époques suivantes : Rome antique, Far West, années 20, Renaissance. Chacune demande 8 à 10 niveaux avant d'être
  proposée aux joueurs.
