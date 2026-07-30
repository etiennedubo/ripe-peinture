#!/bin/bash
# Publie le site : recalcule l'empreinte des fichiers CSS/JS pour que les
# navigateurs prennent la nouvelle version tout de suite, puis met en ligne.
#
#   ./publier.sh "ce que j'ai changé"

set -e
cd "$(dirname "$0")"

python3 - <<'PY'
import pathlib, re, hashlib

v = hashlib.sha1(
    pathlib.Path('css/styles.css').read_bytes() + pathlib.Path('js/site.js').read_bytes()
).hexdigest()[:8]

for name in ['index.html', 'entreprise.html', 'prestations.html',
             'realisations.html', 'contact.html', 'mentions-legales.html']:
    p = pathlib.Path(name)
    t = p.read_text()
    t = re.sub(r'href="css/styles\.css(\?v=[a-f0-9]+)?"', f'href="css/styles.css?v={v}"', t)
    t = re.sub(r'src="js/site\.js(\?v=[a-f0-9]+)?"', f'src="js/site.js?v={v}"', t)
    p.write_text(t)

print(f'Version des fichiers : {v}')
PY

git add -A
git commit -q -m "${1:-Mise à jour du site}" || echo "Rien de nouveau à publier."
git push -q origin main

echo "En ligne dans une minute : https://etiennedubo.github.io/ripe-peinture/"
