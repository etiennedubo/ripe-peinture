# Design

<!-- impeccable:design-schema 1 -->

## Monde visuel : le panneau de chantier

Le site est construit comme l'objet le plus institutionnel du BTP français : le
panneau réglementaire planté devant chaque chantier. Information rangée en
champs normés (étiquette condensée en capitales, valeur en gras), cadres à
filets francs, blanc « salle propre », zéro décoration gratuite. La crédibilité
vient de la tenue documentaire, pas de l'emphase.

Refusé : le site-artisan générique (grande photo floue + 3 cartes à icônes),
le ton publicitaire, les superlatifs.

## Palette

- `--paper: #eef0ec` — fond de page (palissade claire, légèrement minérale)
- `--panel: #ffffff` — fond des panneaux (blanc panneau)
- `--ink: #2e3840` — ardoise foncée : texte courant, filets forts, bandes sombres
- `--slate: #46525c` — ardoise moyenne : texte secondaire
- `--rule: #c9cfc8` — filets internes fins
- `--green: #599c29` — vert RIPE (couleur exacte de la charte du graphiste,
  cf. assets/brand/) : graphique et grands textes uniquement (3,4:1 sur blanc —
  jamais en petit texte sur blanc).
- `--green-ink: #3e6b1a` — vert lisible : texte vert sur fond clair (5,8:1)
- `--green-bright: #8cc63f` — vert clair : accents et texte vert sur fond ardoise
- `--todo-bg: #fdf6e3` / `--todo-ink: #8a6d1c` — étiquettes « à compléter »
  (placeholders factuels, retirées à la mise en service)

Stratégie : fond clair retenu (lecture au bureau et sur mobile en plein jour),
blanc + ardoise dominants, le vert engage les structures (bandes de rive,
actifs, actions) — pas d'accent saupoudré.

## Typographie

Auto-hébergée (`assets/fonts/`, sous-ensembles latin + latin-ext — pas de
Google Fonts distant, conformité RGPD).

- **Barlow Condensed** (500/600/700) — la voix « panneau » : titres en
  capitales, étiquettes de champs (0.8rem, approche +0.08em), navigation.
- **Barlow** (400/500/600/700/800) — texte courant (1.0625rem), valeurs de
  champs (700), boutons.
- Display max ~5rem, chasse condensée. Chiffres tabulaires pour les valeurs.

## Composants

- **Panneau** : région cadrée d'un filet 2px `--ink`, fond `--panel`, coins
  droits (aucun arrondi nulle part).
- **Champ normé** : étiquette Barlow Condensed capitales `--slate` au-dessus,
  valeur Barlow 700 `--ink` en dessous ; champs séparés par filets 1px `--rule`.
- **Bande de rive** : le motif signature — deux biseaux parallèles ardoise +
  vert (les pans du toit du logo), en tête de section ou de panneau. Seule
  ornementation autorisée.
- **Lot** : rangée numérotée (LOT 01…) — la numérotation en lots est native au
  DCE du bâtiment et porte du sens (offre énumérée), ce n'est pas un décor.
- **Étiquette « à compléter »** : chip hachurée ambre pour toute donnée
  factuelle en attente (téléphone, SIRET…). Visible, honnête, listée à la
  livraison.
- **Plaque photo à fournir** : hachures 45° `--rule` + mention, dans le cadre
  du panneau — jamais de fausse photo.

## Mouvement

**Règle absolue : aucun texte ne dépend d'une animation pour être lisible.**
Les blocs de contenu ne s'animent qu'en translation (10-14 px), jamais en
opacité ; si le mouvement se fige (onglet en arrière-plan, JS en échec,
navigateur exotique), le pire résultat est un décalage de 10 px. Seuls les
éléments purement décoratifs — le motif du toit dans les têtes de section, le
repère vert de la frise — ont droit au fondu.

Moment signé : le panneau se pose à l'arrivée (cadre puis champs, décalés,
`cubic-bezier(0.16, 1, 0.3, 1)`, < 700 ms).
Mouvement d'accompagnement : les séries se posent dans l'ordre à l'approche
(frise chronologique, liste des prestations, fiches chantier ; décalage plafonné
à 4 × 70 ms), et les deux pans du toit se rejoignent dans les têtes de section.
Le déclenchement lit la position réelle des éléments (pas d'IntersectionObserver)
et un filet de sécurité à 6 s révèle tout ce qui resterait en attente.
La classe `motion` sur `<html>` n'est posée que si le visiteur n'a pas demandé
moins d'animations ; sans elle, ni masquage ni transition.

## Interdits propres au monde

- Coins arrondis, ombres portées décoratives, dégradés, verre dépoli.
- Hachures de signalisation rouge/blanc (registre travaux routiers, pas
  salle propre) — les biseaux du toit les remplacent.
- Toute donnée factuelle inventée (téléphone, SIRET, références clients,
  chiffres de chantiers) : placeholder étiqueté ou rien.
