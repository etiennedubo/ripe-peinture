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
site — rien n'a été inventé.

1. **Coordonnées** : téléphone, e-mail, adresse (pages contact + pied de page).
2. **Photos de chantiers** : les trois « fiches chantier » de la page
   réalisations sont des gabarits marqués « Exemple » ; on y mettra les vrais
   chantiers (photo + lieu + nature des travaux).
3. **Le fichier original du logo** : le logo actuel est une reconstitution
   vectorielle fidèle ; le fichier source de l'artisan la remplacera.
4. **Formulaire de contact** : créer un compte gratuit sur formspree.io avec
   l'adresse e-mail de l'artisan, puis reporter l'identifiant du formulaire
   dans `js/site.js` (constante `FORM_ENDPOINT`). Tant que ce n'est pas fait,
   le formulaire explique au visiteur comment joindre l'entreprise directement.
5. **Mentions légales** : SIRET, forme juridique, hébergeur.
6. **Nom de domaine** : proposition retenue à confirmer — `ripe-peinture.fr`.

## Voir le site en local

```bash
cd /Users/etienne/ripe-peinture && python3 -m http.server 8642
```

puis ouvrir http://localhost:8642

## Mise en ligne

Hébergement statique gratuit prévu (Netlify ou Vercel) : on glisse le dossier,
on branche le nom de domaine. Aucun serveur à entretenir.
