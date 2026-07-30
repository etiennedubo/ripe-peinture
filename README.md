# Site RIPE — Rhône Isère Peinture Entretien

Site vitrine statique (HTML/CSS/JS, sans base de données), entièrement
indépendant de tout autre projet.

## Pages

| Fichier | Page |
|---|---|
| `index.html` | Accueil |
| `entreprise.html` | Qui sommes-nous |
| `prestations.html` | Prestations |
| `realisations.html` | Nos réalisations |
| `contact.html` | Contact & devis |
| `mentions-legales.html` | Mentions légales |

## Ce qu'il reste à fournir avant la mise en ligne

Tout ce qui est en attente porte une étiquette jaune « À COMPLÉTER » sur le
site — rien n'a été inventé. Les fichiers originaux du logo (graphiste) sont
archivés dans `assets/brand/`.

Le formulaire de contact est actif : il envoie vers `ripe2@wanadoo.fr` via
Formspree (`FORM_ENDPOINT` dans `js/site.js`), 50 demandes par mois en gratuit.

1. **Photos de chantiers** : les trois « fiches chantier » de la page
   réalisations sont des gabarits marqués « Exemple » ; on y mettra les vrais
   chantiers (photo + lieu + nature des travaux).
2. **Mentions légales** : forme juridique, directeur de la publication, hébergeur.
3. **Nom de domaine** : proposition retenue à confirmer — `ripe-peinture.fr`.

## Voir le site en local

```bash
cd /Users/etienne/ripe-peinture && python3 -m http.server 8642
```

puis ouvrir http://localhost:8642

## Le site en ligne

**https://etiennedubo.github.io/ripe-peinture/**

Hébergé gratuitement par GitHub Pages, dépôt `etiennedubo/ripe-peinture`.
Toute modification poussée sur la branche `main` est en ligne en une minute :

```bash
cd /Users/etienne/ripe-peinture && git push
```

Le nom de domaine (ripe-peinture.fr) pourra être branché dessus plus tard,
sans rien changer au site.
