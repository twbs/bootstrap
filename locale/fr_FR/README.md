# [Bootstrap](http://getbootstrap.com)
[![Slack](https://bootstrap-slack.herokuapp.com/badge.svg)](https://bootstrap-slack.herokuapp.com)
![Bower version](https://img.shields.io/bower/v/bootstrap.svg)
[![npm version](https://img.shields.io/npm/v/bootstrap.svg)](https://www.npmjs.com/package/bootstrap)
[![Build Status](https://img.shields.io/travis/twbs/bootstrap/master.svg)](https://travis-ci.org/twbs/bootstrap)
[![devDependency Status](https://img.shields.io/david/dev/twbs/bootstrap.svg)](https://david-dm.org/twbs/bootstrap#info=devDependencies)
[![Selenium Test Status](https://saucelabs.com/browser-matrix/bootstrap.svg)](https://saucelabs.com/u/bootstrap)




*Traduit par [GlobalHelp](https://github.com/GlobalHelp)*
Bootstrap est un intuitif et puissant framework  front-end pour un dévelopement rapide et facile d'un site web, crée par [Mark Otto](https://twitter.com/mdo) et [Jacob Thornton](https://twitter.com/fat), and mise à jour par la [core team](https://github.com/orgs/twbs/people) avec le massif soutien de la communautée.

Pour commencer, Allez voir <http://getbootstrap.com>!

## Sommaire

- [Début](#Début)
- [Bugs et requêtes](#Bugs-et-Requêtes)
- [Documentations](#Documentations)
- [Contributions](#Contributions)
- [Communauté](#Communautée)
- [Versions](#Versions)
- [Créateurs](#créateurs)
- [Copyright et license](#copyright-and-license)

## Début

Plusieurs options sont disponibles:

- [Télécharger la dernière version](https://github.com/twbs/bootstrap/archive/v3.3.5.zip).
- Clone the repo: `git clone https://github.com/twbs/bootstrap.git`.
- Installer avec [Bower](http://bower.io): `bower install bootstrap`.
- Installer avec [npm](https://www.npmjs.com): `npm install bootstrap`.
- Installer avec [Meteor](https://www.meteor.com): `meteor add twbs:bootstrap`.
- Installer avec [Composer](https://getcomposer.org): `composer require twbs/bootstrap`.

Lire la [page de départ](http://getbootstrap.com/getting-started/) pour les informations ,les exemples etc...

### Que contient le projet

Les fichiers que vous allez télécharger seront ceci:

```
bootstrap/
├── css/
│   ├── bootstrap.css
│   ├── bootstrap.css.map
│   ├── bootstrap.min.css
│   ├── bootstrap.min.css.map
│   ├── bootstrap-theme.css
│   ├── bootstrap-theme.css.map
│   ├── bootstrap-theme.min.css
│   └── bootstrap-theme.min.css.map
├── js/
│   ├── bootstrap.js
│   └── bootstrap.min.js
└── fonts/
    ├── glyphicons-halflings-regular.eot
    ├── glyphicons-halflings-regular.svg
    ├── glyphicons-halflings-regular.ttf
    ├── glyphicons-halflings-regular.woff
    └── glyphicons-halflings-regular.woff2
```

Nous vous fournissons (`bootstrap.*`), comme un version compiler et miminifier de la version JS et CSS (`bootstrap.min.*`). CSS [source maps](https://developer.chrome.com/devtools/docs/css-preprocessors) (`bootstrap.*.map`) sont disponible pour certains navigateurs. Les polices sont inclues.



## Bugs et Requêtes

Vous avez un bug, merci de lire [ceci](https://github.com/twbs/bootstrap/blob/master/CONTRIBUTING.md#using-the-issue-tracker) et de chercher si vous problème n'est pas en cours de traitement. Si vous avez besoin d'aide ou vous voulez proposer une nouvelle idée , [allez ici](https://github.com/twbs/bootstrap/issues/new).


## Documentations

La documentation Bootstrap est incluse dans le répertoire à la racine, et est construite grâce à  [Jekyll](http://jekyllrb.com). Les documents peuvent être lancés localement.

### Lire les documents localement

1. Si necessaire, [installer Jekyll](http://jekyllrb.com/docs/installation) (requires v2.5.x).
  - **Utilisateurs de Windows:** lisez [ce guide non-officiel](http://jekyll-windows.juthilo.com/) pour obtenir Jekyll.
2. Installer le 'Ruby-based syntax highlighter', [Rouge](https://github.com/jneen/rouge), avec `gem install rouge`.
3. A partir du répertoire racine `/bootstrap` , lancer `jekyll serve` grâce à une ligne de commande.
4. Ouvrer <http://localhost:9001> dans votre navigateur, et voilà.

Pour en apprendre plus sur Jekyll [documentation](http://jekyllrb.com/docs/home/).

### Documentation pour les versions précedentes

Documentation pour la v2.3.2 et disponible à <http://getbootstrap.com/2.3.2/> .

[Anciennes Versions](https://github.com/twbs/bootstrap/releases) avec leurs documentations à télécharger.



## Contributions

Veuillez lire [les consignes de contribution](https://github.com/twbs/bootstrap/blob/master/CONTRIBUTING.md). Inclus les directions de dévelopement.

En outre, si votre demande contient des correctifs JavaScript ou nouvelles fonctionnalités de JavaScript, vous devez inclure [tests unitaires pertinents](https://github.com/twbs/bootstrap/tree/master/js/tests). 	Toutes les modification d'html et de CSS doivent être conforme au [Guide de programmation](https://github.com/mdo/code-guide), mise à jour par [Mark Otto](https://github.com/mdo).

Préferences d'éditions disponibles à[editor config](https://github.com/twbs/bootstrap/blob/master/.editorconfig) pour un usage plus facile avec les éditeurs de texte utilisez les plugins <http://editorconfig.org>.



## Communautée

Obtenez les mises de jours de Bootstrap et parlez au membres grâce au chat.

- Follow [@getbootstrap on Twitter](https://twitter.com/getbootstrap).
- Read and subscribe to [The Official Bootstrap Blog](http://blog.getbootstrap.com).
- Join [the official Slack room](https://bootstrap-slack.herokuapp.com).
- Chat with fellow Bootstrappers in IRC. On the `irc.freenode.net` server, in the `##bootstrap` channel.
- Implementation help may be found at Stack Overflow (tagged [`twitter-bootstrap-3`](https://stackoverflow.com/questions/tagged/twitter-bootstrap-3)).
- Developers should use the keyword `bootstrap` on packages which modify or add to the functionality of Bootstrap when distributing through [npm](https://www.npmjs.com/browse/keyword/bootstrap) or similar delivery mechanisms for maximum discoverability.



## Versions

For transparency into our release cycle and in striving to maintain backward compatibility, Bootstrap is maintained under [the Semantic Versioning guidelines](http://semver.org/). Sometimes we screw up, but we'll adhere to those rules whenever possible.



## Créateurs

**Mark Otto**

- <https://twitter.com/mdo>
- <https://github.com/mdo>

**Jacob Thornton**

- <https://twitter.com/fat>
- <https://github.com/fat>



## Copyright and license

Code and documentation appartiennent à Twitter,Inc 2011-2015 et maintenus sous la [the MIT license](https://github.com/twbs/bootstrap/blob/master/LICENSE). Docs publiés sous [Creative Commons](https://github.com/twbs/bootstrap/blob/master/docs/LICENSE).
