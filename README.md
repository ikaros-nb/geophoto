
## Développez une application mobile avec Angular et Ionic

Ceci est le dépôt associé au projet [_Développez une application mobile avec Angular et Ionic_](https://openclassrooms.com/projects/developpez-une-application-mobile-avec-angular-et-ionic)
sur [_OpenClassrooms_](https://www.openclassrooms.com).


### Technologies

- HTML5
- SCSS
- Angular
- TypeScript
- RxJS
- Ionic
- Firebase

### Fonctionnement

Se positionner dans le dossier du projet, à sa racine.

Pour lancer l'application sur un navigateur Web, utiliser la commande suivante : 
- `ionic serve` afin de lancer un serveur en ouvrant automatiquement une fenêtre dans le navigateur par défaut
- `npm start` afin de lancer un serveur sans ouvrir de fenêtre et accéder à l'application manuellement via l'URL `http://localhost:8100/`

### Déploiement

Pour un déploiement sur un périphérique sans construction de l'exécutable de l'application, exécuter la commande suivante : `ionic cordova run [<platform>]` avec au choix comme plateformes `android`ou `ios`.

### Publication sur le Play Store

Se positionner dans le dossier du projet, à sa racine.

Génération de l'apk :
`ionic cordova build --release android`

Se déplacer dans le dossier de l'apk générée :
`cd platforms/android/build/outputs/apk`

Utiliser la commande suivante pour générer un keystore :
`keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000`

Utiliser la commande suivante pour signer l'apk à l'aide du keystore précédemment généré :
`jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore app-release-unsigned.apk alias_name`

Finaliser le processus à l'aide de la commande suivante afin d'optimiser l'application :
`zipalign -v 4 HelloWorld-release-unsigned.apk app-release-unsigned.apk`

Maintenant, nous avons le fichier `app-release.apk` prêt à être déployé sur le Play Store.

Se créer un compte sur [_Google Play Store Developer Console_](https://play.google.com/apps/publish/), cela coûte $25.

Ensuite, cliquer sur “Publish an Android App on Google Play” et suivre le processus pour envoyer votre application sur le store de Google.

Pour la mise à jour de votre application, il faut au préalable modifier le fichier `config.xml` du projet afin d'en incrémenter la version.

### Publication sur l'Apple Store

Suivre la procédure via la documentation officielle de Ionic : [_iOS Publishing_](https://ionicframework.com/docs/v1/guide/publishing.html)