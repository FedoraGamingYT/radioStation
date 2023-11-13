# Lecteur Simple RadioKing
[Readme in English](ReadmeEN.md "Because French sucks :P")

Simple lecteur PWA pour les webradio de la plateforme RadioKing.

[![HTML5](https://img.shields.io/badge/HTML-FF4500?style=for-the-badge&logo=html5&logoColor=white)](#) [![HTML5](https://img.shields.io/badge/CSS-0077B5?&style=for-the-badge&logo=css3&logoColor=white)](#) [![HTML5](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)](#)
## Mise en route
Pour utiliser le lecteur avec votre Webradio, vous commencez par créer un dépôt en utilisant le modèle sur GitHub.
### Créer un dépôt à partir du template
Vous pouvez cliquer sur le lien suivant pour générer un dépôt en utilisant le template : [Créer un dépôt](pas mis en place "Créer un dépôt")
> Pour plus de détails sur la façon de créer des dépôts à l'aide de templates, lisez l'article sur le site de GitHub : [Creating a repository from a template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template "Creating a repository from a template").

### Mettre à jour la configuration du lecteur
Le fichier `js\settings.js` est utilisé comme fichier principal de configuration. Dans ce fichier, vous pouvez configurer les information sur votre Webradio.

Vous pouvez commencer en ajoutant vos infos radio :
```javascript
	'radio_name': 'Antithèse Radio', // Nom de la Radio.
	'url_streaming': 'https://www.radioking.com/play/antithesecvl',  // URL du flux, eg: https://www.radioking.com/play/IDRADIO
	'radio_id': 'antithesecvl', //ID de la radio.
	'default_cover_art': 'img/defaultArt.webp',  // Chemin d'accès à la couverture par défaut.
```
> Ce que je nomme `IDRADIO` est simplement le nom dans l'url de la page de votre radio sur RadioKing
( https://fr.radioking.com/radio/ `id de la radio`) trouvable depuis https://fr.radioking.com/ecouter-radio

Ensuite, votre page peut être hébergée sur https://user.github.io/repo/ grace a GitHub Page, où `user` est votre nom d'utilisateur GitHub et `repo` est le nom de votre dépôt.
> Pour plus de détails GitHub Pages, lisez l'article sur le site de GitHub : [GitHub Pages Documentation](https://docs.github.com/en/pages "GitHub Pages Documentation").

### Mettre à jour la configuration PWA
Le manifeste des applications web `manifest.json` contient par defaut certains paramétrés (icons/orientation/display/start_url). Libre a vous de changer par vos informations.
