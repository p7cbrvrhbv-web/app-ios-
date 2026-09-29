# Tester Anachro avec de vrais joueurs

But : savoir si le jeu accroche avant de payer pour des centaines d'images, un backend et l'App Store.
Ce test ne dit rien sur le paiement ni sur la rétention à 30 jours. Il dit seulement si le concept fonctionne.

## 1. Mettre le jeu en ligne

Le jeu est un dossier statique : n'importe quel hébergeur de fichiers statiques convient (GitHub Pages, Netlify,
Cloudflare Pages). Il faut ensuite un lien que les testeurs ouvrent sur iPhone. Le lien fourni pendant le développement
est privé : seuls les comptes que tu invites peuvent l'ouvrir.

Le dossier fait environ 2,7 Mo et n'a besoin d'aucun serveur.

## 2. Qui tester

- **10 à 15 personnes**, dont au moins 5 qui ne te connaissent pas (contacts TikTok, Instagram, Discord). Les amis proches
  disent que c'est bien.
- Surtout sur **iPhone**, puisque c'est la cible.
- Des profils variés : moins de 25 ans, 25 à 40 ans, et au moins 2 personnes qui ne jouent jamais sur mobile.

## 3. Comment

1. Envoie le lien **sans expliquer** le jeu. Si la page d'accueil ne suffit pas à comprendre, c'est un résultat.
2. Pour 3 à 5 personnes, regarde-les jouer en visio ou en face à face, sans intervenir. Note où elles regardent, ce qui les
   fait sourire, ce qui les agace.
3. Pour les autres, envoie 5 questions (voir plus bas) le lendemain.
4. Le lendemain matin, un message : « Il y a un nouveau niveau du jour. Tu veux le faire ? » Compte qui revient.

## 4. Ce qu'il faut noter

| Question | Signal |
|---|---|
| Comprend le but sans aide ? | Le nombre de personnes qui jouent le niveau 1 sans poser de question |
| Le jeu est-il juste ? | Des phrases comme « il y avait un autre truc bizarre » : l'image contient un deuxième anachronisme |
| Difficulté | Taux de réussite par niveau, à demander ou à observer. Un bon niveau se rate 30 à 60 % du temps |
| 30 secondes suffisent ? | Ceux qui perdent par le temps plutôt que par les vies |
| Envie de continuer | « Encore un » à la fin du dernier niveau |
| Partage | Qui envoie spontanément le lien à quelqu'un |

## 5. Les 5 questions du lendemain

1. En une phrase, c'est quoi ce jeu ?
2. Quel niveau as-tu préféré, lequel t'a énervé ?
3. As-tu trouvé un niveau injuste ? Pourquoi ?
4. Tu y rejouerais demain ? Combien de niveaux par jour ?
5. À qui l'enverrais-tu, et pourquoi ?

Ne pose **pas** la question du prix à ce stade : les gens répondent ce qu'ils imaginent que tu veux entendre.

## 6. Seuils pour décider

Ces seuils sont des repères de bon sens, pas des statistiques : avec 10 personnes, on ne mesure que de très gros écarts.

- **Continuer** : au moins 7 sur 10 terminent les 3 premiers niveaux sans aide, et au moins 3 sur 10 reviennent d'eux-mêmes
  le lendemain.
- **Ajuster** : beaucoup abandonnent au même niveau (image injuste ou trop difficile), ou perdent tous au temps.
- **Repenser** : personne ne demande « encore un », ou la moitié ne comprend pas le but.

## 7. Réglages faciles

Dans `js/levels.js` : `TIME_LIMIT` (30 s), `LIVES` (3), `HINTS` (3). Le rayon `r` de chaque cible règle la tolérance du
clic. Après un changement, `npm test` vérifie que tous les niveaux restent gagnables.

## 8. Et après ?

Si le test est bon, l'ordre habituel est : 1) plus de niveaux (lot 2), 2) un serveur pour le classement et le niveau du jour
communs à tous, 3) l'emballage iOS (nécessite un Mac avec Xcode et un compte Apple Developer), 4) l'abonnement.
