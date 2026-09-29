# Anachro

> Trouve l'objet qui n'a rien à faire là.

Une image d'époque (Moyen Âge, Égypte des pharaons, USA 1985). Un seul objet vient du futur.
Tu as 30 secondes et 3 vies pour le repérer.

Ce dépôt contient un **prototype jouable dans le navigateur** (HTML / CSS / JS, aucune dépendance).
Ce n'est **pas** une app iOS : il sert à tester si la boucle de jeu accroche avant d'investir dans le natif et dans le contenu.

## Lancer

Ouvre `index.html` dans un navigateur (idéalement en mode mobile), ou :

```bash
npm start        # sert le dossier avec `serve`
```

Pour l'essayer sur iPhone : héberge le dossier tel quel (GitHub Pages, Netlify, etc.), ouvre l'URL dans Safari,
puis « Partager → Sur l'écran d'accueil ».

## Ce qui est déjà là

- 3 époques, 9 niveaux, tous avec de vraies images (Moyen Âge, Égypte, USA 80).
  Un intrus par niveau, avec un bandeau « le saviez-vous » à la fin. Un niveau peut avoir plusieurs zones valides
  (`also`), par exemple deux baskets ou trois drones.
- 30 s, 3 vies, 3 indices, zoom avec déplacement au doigt, pause (la scène est masquée pour empêcher de tricher).
- Score et étoiles : 3 étoiles = trouvé en moins de 15 s **sans indice**, 2 étoiles = au moins 8 s restantes, sinon 1.
- Niveau du jour identique pour tous à une date donnée, avec série de jours consécutifs.
- Défi entre potes : « Défier un ami » partage un lien `#niveau=…&t=…` qui ouvre le même niveau avec ton temps à battre.
- Progression enregistrée dans le `localStorage` (mode privé ou stockage bloqué : le jeu fonctionne sans sauvegarde).
- Mascotte et icônes en SVG.

## Structure

```
index.html            page unique, les écrans sont rendus par js/app.js
css/style.css         thème, écrans, HUD, animations
js/levels.js          époques et niveaux (cible de l'intrus, texte final)
js/ui-kit.js          mascotte, icônes, étoiles, logo
js/store.js           progression, niveau du jour, série
js/app.js             navigation, boucle de jeu, zoom, tap, partage
tests/e2e.mjs         test de bout en bout (Playwright)
tools/editor.html     éditeur de niveaux : dépose une image, clique sur l'intrus, copie l'entrée pour levels.js
tools/check-targets   rend chaque niveau en PNG avec ses zones valides entourées, pour contrôler les coordonnées
docs/IMAGES.md        prompts, contrôle qualité et export pour produire de vraies images
docs/PROMPTS-LOT-2.md  12 nouveaux niveaux à générer (4 par époque), avec les textes de fin
docs/TEST-JOUEURS.md  protocole pour tester le jeu avec 10 à 15 joueurs et décider de la suite
levels/               (à créer) tes images 9:16 : JPG ou WebP
```

## Ajouter un niveau

Le plus simple : génère l'image avec les prompts de [`docs/IMAGES.md`](docs/IMAGES.md), ouvre `tools/editor.html`,
dépose l'image, clique sur l'intrus et copie l'entrée obtenue dans `js/levels.js`.

À la main, ajoute un objet à `levels`. Les coordonnées sont celles d'une image de **900 x 1600** (portrait 9:16),
quelle que soit la résolution réelle du fichier. Une image d'un autre ratio est recadrée en « cover » et les
coordonnées se lisent dans ce cadrage.

```js
{
  id: 'eg-nil', era: 'egypte', title: 'Les bords du Nil',
  image: 'levels/eg-nil.jpg',              // vraie image, à la place de `art`
  target: { x: 412, y: 1130, r: 40 },     // centre et rayon de clic de l'intrus
  object: 'Bouteille en plastique',
  fact: 'Bouteille en plastique — brevetée en 1973.'
}
```

`npm run check-targets` produit une capture par niveau avec ses zones valides entourées en vert :
utile pour vérifier qu'un intrus est bien à l'endroit annoncé.

## Tests

```bash
npm install
npm test
```

Le test joue un parcours complet sur un viewport d'iPhone (démarrage, mauvais tap, indice, zoom, pause, victoire,
défaite par vies et par temps, classement, profil, lien de défi, niveau du jour) et vérifie que **chaque niveau, et chacune
de ses zones valides, est gagnable** en touchant la cible. Si Chromium n'est pas installé au chemin par défaut de Playwright, définis `PW_CHROMIUM`.

## Ce que ce prototype ne fait pas (et ce qu'il faudrait pour aller plus loin)

- **Le catalogue est court** : 9 niveaux se jouent en quelques minutes. Il en faut beaucoup plus pour fidéliser (un niveau
  par jour demande une réserve d'au moins plusieurs semaines). Chaque image demande de vérifier qu'elle contient **un seul** anachronisme, ce que les générateurs respectent mal :
  l'image du désert est sortie avec trois drones au lieu d'un. C'est le vrai coût du projet, bien plus que le code.
  Le circuit de production est décrit dans [`docs/IMAGES.md`](docs/IMAGES.md).
- **Pas de classement mondial** ni de niveau du jour synchronisé côté serveur : il faut un backend. Aujourd'hui, le niveau du
  jour est calculé à partir de la date de l'appareil, et « Classement » montre tes propres records.
- **Pas d'abonnement.** La carte « Anachro+ » est une maquette sans paiement. Sur iOS : StoreKit 2, période d'essai,
  et respect des règles de l'App Store sur les abonnements.
- **Pas d'app iOS.** Deux voies : envelopper ce code avec Capacitor (le plus rapide), ou réécrire en SwiftUI.
  Rien n'a été compilé ni testé sous Xcode ici.
- **Faits à vérifier avant publication** : les textes de fin de niveau (dates d'invention) sont à recouper avec des sources.
- **Droits** : la mascotte est un dessin original ; pour les images générées, vérifie les conditions d'usage de l'outil utilisé.

### Ordre de grandeur pour les 10 000 € / mois

À 4,99 € TTC, en France, il reste environ 3,50 € par abonné et par mois après TVA (20 %) et commission Apple (15 % avec le
Small Business Program). Il faut donc **environ 2 850 abonnés payants** pour 10 000 € nets par mois. Avec 3 % de conversion
(hypothèse), cela suppose de l'ordre de **95 000 joueurs actifs**. Le chiffre dépend surtout de l'acquisition (TikTok) et de la
rétention, que ce prototype permet justement de tester avant de produire des centaines d'images.
