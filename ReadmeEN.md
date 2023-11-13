# RadioKing Simple Player
PWA player for Radioking Webradios.

[![HTML5](https://img.shields.io/badge/HTML-FF4500?style=for-the-badge&logo=html5&logoColor=white)](#) [![HTML5](https://img.shields.io/badge/CSS-0077B5?&style=for-the-badge&logo=css3&logoColor=white)](#) [![HTML5](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)](#)
## Getting started
To use the player with your webradio, start by creating a repository using the template on GitHub.
### Create a repository from the template
You can click on the following link to generate a repository using the template : [Create a new repository](https://github.com/lunar-d/PWA-RadioKing-Player/generate "Create a new repository").
> For more details on how to create repositories using templates, read the article on the GitHub website : [Creating a repository from a template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template "Creating a repository from a template").

### Update the player configuration
The file `js\settings.js` is used as main configuration file. In this file, you can configure the informations about your Webradio.

You can start by adding your radio info :
```javascript
	'radio_name': 'Antithèse Radio', // Name your Radio Station.
	'url_streaming': 'https://www.radioking.com/play/antithesecvl',  // URL of the feed, ex: https://www.radioking.com/play/IDRADIO
	'radio_id': 'antithesecvl', //Radio ID.
	'default_cover_art': 'img/defaultArt.webp',  // Default path to the cover.
```
> What I call `IDRADIO` is simply the name in the url of your radio page on RadioKing
( https://fr.radioking.com/radio/ `radio id`) available from https://fr.radioking.com/ecouter-radio

Then, your page can be hosted on https://user.github.io/repo/ thanks to GitHub Page, where `user` is your GitHub username and `repo` is the name of your repository.
> For more details on GitHub Pages, read the article on the GitHub website : [GitHub Pages Documentation](https://docs.github.com/en/pages "GitHub Pages Documentation").

### Update the PWA configuration
The web application manifest `manifest.json` contains by default some parameters (icons/orientation/display/start_url). You are free to change them with your information.
