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

**Livraison des e-mails.** Orange/Wanadoo classe les notifications Formspree en
indésirables tant que l'expéditeur n'est pas déclaré comme contact de confiance.
À faire une fois sur la boîte de l'artisan : marquer le message « pas
indésirable » et ajouter l'expéditeur aux contacts autorisés. Filet de sécurité
recommandé : déclarer un second destinataire dans Formspree (une adresse Gmail),
et se rappeler que **toutes les demandes restent consultables dans le tableau de
bord Formspree**, onglet « Submissions », même si un e-mail se perd.

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

Pour publier une modification, utilisez le script prévu : il tamponne les
fichiers CSS/JS d'une empreinte, ce qui force les navigateurs à prendre la
nouvelle version au lieu d'en garder une périmée pendant 10 minutes.

```bash
cd /Users/etienne/ripe-peinture && ./publier.sh "ce que j'ai changé"
```

Le nom de domaine (ripe-peinture.fr) pourra être branché dessus plus tard,
sans rien changer au site.
