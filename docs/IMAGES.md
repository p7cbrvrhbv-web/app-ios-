# Produire les images d'Anachro

Le jeu affiche n'importe quelle image de ratio **9:16** (idéal : 1080 × 1920). Ce guide décrit le circuit pour produire
de nouveaux niveaux avec des images réalistes comme sur la maquette. Les 9 niveaux actuels sont déjà faits de cette façon.

## Le circuit, par niveau

1. **Générer** l'image avec le prompt ci-dessous (générateur d'images de ton choix, format 9:16). Fais 4 variantes.
2. **Contrôler** (voir la liste plus bas) et garder la meilleure.
3. **Exporter** en JPG (qualité 80, moins de 400 Ko) ou WebP, dans `levels/`.
4. **Placer l'intrus** avec `tools/editor.html` : dépose l'image, clique sur l'intrus, copie l'entrée.
5. **Coller** l'entrée dans `js/levels.js`, puis lancer `npm test` : le test vérifie que chaque niveau est gagnable.

Tu peux aussi m'envoyer les images dans la conversation : je peux repérer l'intrus, placer la cible, vérifier le
résultat sur capture d'écran et ajouter les niveaux au projet.

## Style commun (à coller au début de chaque prompt)

```
Hyper-realistic cinematic photograph, vertical 9:16, 35mm lens, warm natural light, shallow depth of field on the
edges but sharp in the center, rich detail, lively crowded scene with many props and people as visual camouflage,
photorealistic textures, no watermark, no logo, no readable text.
```

Pourquoi « crowded » : plus la scène est chargée, plus l'intrus est difficile à trouver, ce qui fait le jeu.

## Les prompts

Chaque prompt décrit **un seul** anachronisme, sa position et sa taille. C'est ce qui rend le placement fiable.

### `ma-marche` : Moyen Âge, le marché
```
[style commun] A busy medieval market square in France, 14th century. Wooden stalls with striped cloth awnings,
vendors selling apples, bread and vegetables, a knight in full plate armor walking through the crowd, chickens in the
mud, barrels and wicker baskets in the foreground, a stone castle with banners on a hill in the background.
Exactly ONE out-of-time object: a modern black smartphone lying on top of a wooden barrel in the lower-left third of
the image, small (about 5% of the image width) but clearly visible. Everything else strictly historically accurate.
```
Intrus : smartphone. Texte de fin : « Smartphone : le premier iPhone date de 2007 ! »

### `ma-cour` : Moyen Âge, la cour du château
```
[style commun] The courtyard of a medieval castle at golden hour, cobblestones, stone walls with red banners, a stone
well with a wooden roof on the right, two knights sparring, hay bales, chickens. Exactly ONE out-of-time object: a
white paper takeaway coffee cup with a black lid and a brown cardboard sleeve, standing on the rim of the stone well,
small (about 4% of the image width) but clearly visible. Everything else strictly historically accurate.
```
Intrus : gobelet de café à emporter.

### `ma-chevalier` : Moyen Âge, le tournoi (idée de ton pitch)
```
[style commun] A medieval jousting tournament field, spectators in colorful period clothes, heraldic banners, a knight
in polished armor holding a lance in the foreground. Exactly ONE out-of-time object: a modern black smartwatch with a
plain digital display on the knight's left wrist, visible between the gauntlet and the sleeve, small (about 3% of the
image width) but clearly visible. No brand logo. Everything else strictly historically accurate.
```
Intrus : montre connectée.

### `eg-cortege` : Égypte, le cortège royal
```
[style commun] Ancient Egypt, New Kingdom. A pharaoh in a striped blue and gold nemes headdress and a white linen
kilt, surrounded by attendants holding large feather fans, palm trees, the Nile in the background and the pyramids of
Giza under a hazy golden sun. Exactly ONE out-of-time object: the pharaoh wears modern white running sneakers with a
red stripe instead of sandals, clearly visible at the bottom center of the image. No brand logo.
Everything else strictly historically accurate.
```
Intrus : baskets.

### `eg-desert` : Égypte, la caravane
```
[style commun] The Giza pyramids at midday, a caravan of camels with riders crossing the dunes in the foreground, a
flock of birds high in a blue sky on the right side. Exactly ONE out-of-time object: a small grey consumer quadcopter
drone with four rotors, flying among the birds, roughly the same size as a bird, clearly recognizable.
Everything else strictly historically accurate.
```
Intrus : drone.

### `eg-bouteille` : Égypte, le chantier (variante)
```
[style commun] Ancient Egyptian workers hauling limestone blocks on a construction site next to a half-built pyramid,
ropes, wooden sledges, clay water jars, dusty golden light. Exactly ONE out-of-time object: a modern transparent
plastic water bottle with a blue cap lying in the sand near the workers' feet in the lower-right third, small (about
4% of the image width) but clearly visible. No label text. Everything else strictly historically accurate.
```
Intrus : bouteille en plastique.

### `us-banquette` : USA 1985, le diner
```
[style commun] An American diner at night in 1985, glowing neon sign reading "DINER" (the only text in the image),
red vinyl booth, checkerboard floor, jukebox, teenagers with big 80s hairstyles and denim jackets sharing milkshakes,
a waitress on roller skates. Exactly ONE out-of-time object: a young man in a denim jacket wears a single small white
wireless earbud in his ear, small (about 2% of the image width) but clearly visible in the middle of the image.
No brand logo. Everything else strictly consistent with 1985.
```
Intrus : écouteurs sans fil.

### `us-comptoir` : USA 1985, le comptoir
```
[style commun] The counter of an American diner in 1985: chrome stools with red tops, a cook in a paper hat behind the
counter, pie display, retro wall clock, neon "OPEN" sign, several small table-tent menu stands on the counter.
Exactly ONE out-of-time object: on one of the menu stands, a black and white QR code printed on the card, small
(about 4% of the image width), among the other stands which show ordinary menu drawings. Everything else strictly
consistent with 1985.
```
Intrus : QR code.

### `us-scroll` : USA 1985, la rue (idée de ton pitch)
```
[style commun] A sunny Miami street in 1985, pastel art deco buildings, palm trees, a red convertible, teenagers with
neon clothes, leg warmers and a boombox. Exactly ONE out-of-time object: a teenage girl in the middle of the image
looks down at a modern smartphone with a lit screen in her hand. No brand logo. Everything else strictly consistent
with 1985.
```
Intrus : smartphone.

## Contrôle qualité (à faire pour chaque image)

- **Un seul anachronisme.** Zoome sur chaque zone de l'image : un deuxième objet moderne, une pancarte, un tissu trop
  parfait rendent le niveau injuste. En cas de doute, régénère. Les générateurs ignorent souvent « exactly ONE » :
  le premier lot a produit trois drones au lieu d'un. Si l'image te plaît malgré tout, déclare chaque exemplaire
  dans `also` (voir `eg-desert` dans `js/levels.js`) : taper n'importe lequel fait gagner. Pour insister, ajoute
  « Only one drone. There are no other drones and no other modern objects in the image. »
- **Visible sans zoom** pour quelqu'un qui le cherche, sur un écran de téléphone, mais pas au centre de l'image.
- **Aucun texte ni logo lisible** (sauf l'enseigne demandée). Les générateurs déforment le texte.
- **Mains, visages, pieds** : vérifie les déformations, surtout autour de l'intrus.
- **Ratio 9:16 exact.** Sinon l'image est recadrée : l'éditeur montre le recadrage réel.

## Mascotte (optionnelle)

Le jeu utilise une mascotte SVG originale. Pour une version 3D comme sur la maquette :

```
3D animated-film style character, friendly bearded explorer with a wide-brim brown hat and a khaki jacket, holding a
large magnifying glass in front of one oversized eye, big expressive eyes, soft studio lighting, plain background.
```

N'y mets pas le nom d'un personnage ou d'un film existant : garde un design original, sans ressemblance trop proche
avec un personnage connu, pour éviter tout problème de droits.

## Textes de fin de niveau

Les dates suivantes sont à recouper avec des sources fiables avant publication :
iPhone (2007), gobelet en carton jetable (XXe siècle), montre connectée grand public (2015), baskets Converse All Star
(1917), drones grand public (années 2010), bouteille PET (brevet de 1973), AirPods (2016), QR code (1994).

## Droits

Vérifie les conditions d'usage commercial de l'outil de génération. La protection par le droit d'auteur d'images
entièrement générées par IA est incertaine dans plusieurs pays : ta mise en scène, ton code et ta sélection restent à toi,
mais les images seules peuvent être plus difficiles à défendre.
