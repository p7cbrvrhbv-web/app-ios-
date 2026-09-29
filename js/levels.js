/* Données des époques et des niveaux.
   Ajouter un niveau = ajouter un objet dans `levels` :
   - image  : chemin de l'image du niveau, au format 9:16 (photo, rendu IA…)
   - target : intrus, en coordonnées 900 x 1600 (x, y, rayon de clic). Sert aussi à placer l'infobulle et l'indice.
   - also   : (facultatif) autres zones qui valident le clic, quand l'intrus est en plusieurs exemplaires
   - fact   : texte du bandeau affiché à la fin du niveau
   L'ordre du tableau fixe la numérotation et le déblocage dans chaque époque.
   `shift` (époques) : décalage vertical du bandeau d'illustration de la carte d'accueil. */
(function (A) {
  'use strict';

  const eras = [
    { id: 'moyen-age', name: 'Moyen Âge', period: 'XIVe siècle', accent: '#c1392b', shift: -13 },
    { id: 'egypte', name: 'Égypte des Pharaons', period: 'Vers 1300 av. J.-C.', accent: '#d9a441', shift: -22 },
    { id: 'usa-80', name: 'USA années 80', period: '1985', accent: '#d63384', shift: -31 }
  ];

  const levels = [
    {
      id: 'ma-marche', era: 'moyen-age', title: 'Le marché',
      image: 'levels/ma-marche.jpg',
      target: { x: 166, y: 1108, r: 62 },
      object: 'Smartphone',
      fact: 'Smartphone — le premier iPhone date de 2007 !'
    },
    {
      id: 'ma-cour', era: 'moyen-age', title: 'La cour du château',
      image: 'levels/ma-cour.jpg',
      target: { x: 710, y: 924, r: 45 },
      object: 'Gobelet de café',
      fact: 'Gobelet à emporter — les gobelets en carton jetables datent du XXe siècle.'
    },
    {
      id: 'ma-chevalier', era: 'moyen-age', title: 'Le tournoi',
      image: 'levels/ma-chevalier.jpg',
      target: { x: 449, y: 1007, r: 42 },
      object: 'Montre connectée',
      fact: 'Montre connectée — les premières montres connectées grand public arrivent dans les années 2010.'
    },
    {
      id: 'eg-cortege', era: 'egypte', title: 'Le cortège royal',
      image: 'levels/eg-cortege.jpg',
      target: { x: 385, y: 1180, r: 42 },
      also: [{ x: 469, y: 1212, r: 42 }], // la deuxième basket
      object: 'Baskets',
      fact: 'Baskets — les Converse All Star sortent en 1917 !'
    },
    {
      id: 'eg-desert', era: 'egypte', title: 'La caravane',
      image: 'levels/eg-desert.jpg',
      target: { x: 775, y: 234, r: 40 },
      also: [{ x: 815, y: 166, r: 40 }, { x: 676, y: 266, r: 40 }], // l'image contient trois drones
      object: 'Drone',
      fact: 'Drone — les drones grand public arrivent dans les années 2010.'
    },
    {
      id: 'eg-bouteille', era: 'egypte', title: 'Le chantier',
      image: 'levels/eg-bouteille.jpg',
      target: { x: 726, y: 1187, r: 48 },
      object: 'Bouteille en plastique',
      fact: 'Bouteille en plastique — la bouteille PET est brevetée en 1973.'
    },
    {
      id: 'us-banquette', era: 'usa-80', title: 'Le diner',
      image: 'levels/us-banquette.jpg',
      target: { x: 421, y: 638, r: 26 },
      object: 'Écouteurs sans fil',
      fact: 'Écouteurs sans fil — les AirPods sont sortis en 2016 !'
    },
    {
      id: 'us-comptoir', era: 'usa-80', title: 'Le comptoir',
      image: 'levels/us-comptoir.jpg',
      target: { x: 676, y: 862, r: 50 },
      also: [{ x: 674, y: 1005, r: 40 }], // son reflet dans le comptoir
      object: 'QR code',
      fact: 'QR code — inventé en 1994, au Japon.'
    },
    {
      id: 'us-scroll', era: 'usa-80', title: 'La promenade',
      image: 'levels/us-scroll.jpg',
      target: { x: 440, y: 708, r: 42 },
      object: 'Smartphone',
      fact: 'Smartphone — le premier iPhone date de 2007, 22 ans plus tard !'
    }
  ];

  const byId = Object.fromEntries(levels.map(l => [l.id, l]));
  const inEra = id => levels.filter(l => l.era === id);
  const zones = level => [level.target, ...(level.also || [])];

  /* HTML de l'image d'un niveau ; le CSS règle le cadrage (jeu : cover, cartes d'accueil : bandeau) */
  const artHTML = level => `<img src="${level.image}" alt="" draggable="false">`;

  A.data = { eras, levels, byId, inEra, zones, artHTML, SCENE_W: 900, SCENE_H: 1600, TIME_LIMIT: 30, LIVES: 3, HINTS: 3 };
})(window.Anachro = window.Anachro || {});
