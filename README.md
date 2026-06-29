# XENEON CS2 Dashboard

Dashboard Counter-Strike 2 pour **Corsair XENEON EDGE** via **iCUE iFrame widget**.

Le projet utilise la fonctionnalité officielle **Game State Integration** de CS2 : le jeu envoie ses données à un petit serveur local Node.js, puis iCUE affiche le dashboard dans un widget iFrame.

## Aperçu

- HUD optimisé 2560 × 720
- Compatible iCUE via widget iFrame
- Mode démo automatique hors partie
- Données live CS2 via GSI
- Score, timer, bombe, HP, armure, argent, arme, stats
- Base prête pour ajouter vraies minimaps, armes et utilitaires

## Installation rapide

1. Installer Node.js 18 ou plus récent.
2. Télécharger ou cloner ce dépôt.
3. Copier le fichier CS2 GSI :

```txt
cs2/gamestate_integration_xeneon.cfg
```

vers :

```txt
Steam\steamapps\common\Counter-Strike Global Offensive\game\csgo\cfg\
```

4. Lancer :

```powershell
npm start
```

ou double-cliquer sur :

```txt
START_XENEON_DASHBOARD.bat
```

5. Dans iCUE, ajouter un widget **iFrame** et coller :

```html
<iframe src="http://localhost:31982/" width="100%" height="100%" frameborder="0"></iframe>
```

## Pourquoi iFrame et pas URL Web ?

Sur le XENEON EDGE, le widget **URL Web** peut bloquer les serveurs HTTP locaux avec `ERR_SSL_PROTOCOL_ERROR`. Le widget **iFrame** fonctionne mieux avec les dashboards locaux.

## Sécurité / anti-cheat

Ce projet ne lit pas la mémoire du jeu, n'injecte rien, ne modifie pas le client et n'interagit pas avec CS2. Il reçoit uniquement les données envoyées officiellement par CS2 via Game State Integration.

## Roadmap

- [ ] Vraies minimaps CS2
- [ ] Icônes d'armes
- [ ] Icônes de grenades
- [ ] Meilleur radar joueur/coéquipiers
- [ ] Thèmes ESL / BLAST / minimal
- [ ] Installateur Windows
