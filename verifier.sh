#!/bin/bash
# Vérifie que le site en ligne est en bon état. À lancer une fois par mois,
# ou après chaque publication.
#
#   ./verifier.sh
#
# Ce script ne modifie rien : il regarde et il rapporte. Il ne remplace pas une
# surveillance automatique, il permet de faire le tour en dix secondes.

SITE="https://ripe-peinture.fr"
PAGES=(/ /entreprise.html /prestations.html /realisations.html /contact.html /mentions-legales.html)
ok=0
ko=0

dire_ok()  { printf '  \033[32m✓\033[0m %s\n' "$1"; ok=$((ok+1)); }
dire_ko()  { printf '  \033[31m✗\033[0m %s\n' "$1"; ko=$((ko+1)); }

echo
echo "Pages"
for p in "${PAGES[@]}"; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$SITE$p")
  duree=$(curl -s -o /dev/null -w '%{time_total}' --max-time 15 "$SITE$p")
  if [ "$code" = "200" ]; then
    dire_ok "$p — ${duree}s"
  else
    dire_ko "$p — code $code"
  fi
done

echo
echo "Page d'erreur"
titre=$(curl -s --max-time 15 "$SITE/adresse-qui-nexiste-pas" | grep -o '<title>[^<]*' | head -1)
case "$titre" in
  *RIPE*) dire_ok "une adresse inconnue affiche bien la page du site" ;;
  *)      dire_ko "une adresse inconnue n'affiche pas la page du site ($titre)" ;;
esac

echo
echo "Photos des chantiers"
manquantes=0
for img in $(curl -s --max-time 15 "$SITE/realisations.html" | grep -o 'assets/photos/[a-z0-9-]*\.jpg' | sort -u); do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$SITE/$img")
  [ "$code" = "200" ] || { dire_ko "$img — code $code"; manquantes=1; }
done
[ "$manquantes" = "0" ] && dire_ok "toutes les photos répondent"

echo
echo "Certificat"
fin=$(echo | openssl s_client -servername ripe-peinture.fr -connect ripe-peinture.fr:443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
[ -n "$fin" ] && dire_ok "valide jusqu'au $fin" || dire_ko "certificat illisible"

# Le www a son propre certificat, servi par Cloudflare depuis le 06/08/2026.
# Vérifié à part : c'est l'adresse que les clients tapent quand on la leur dicte
# au téléphone, et une alerte de sécurité y coûte cher.
code_www=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "https://www.ripe-peinture.fr")
if [ "$code_www" = "000" ]; then
  dire_ko "https://www.ripe-peinture.fr : connexion sécurisée impossible — vérifier le certificat Cloudflare"
else
  dire_ok "https://www.ripe-peinture.fr répond (code $code_www)"
fi

echo
echo "Formulaire"
echo "  → à tester à la main une fois par trimestre : envoyez-vous une demande"
echo "    depuis $SITE/contact.html et vérifiez qu'elle arrive bien."

echo
echo "Bilan : $ok correct(s), $ko problème(s)."
echo
[ "$ko" -eq 0 ]
