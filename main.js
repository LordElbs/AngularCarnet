/**
* Les evenements et directives sous AngularJS
*/

/*
  Application "Carnet d'Adresses"

  + Créer un tableau de 8 utilisateurs avec nom, prénom, age,photo,  date de naissances(dd/mm/YYYY),noteBac (de 1 à 20), sexe(boolean), ville (Paris ou Lyon ou Marseille), biographie, langue(fr,en,it ou es),
	+ Afficher tous ces utilisateurs et leurs informations dans des Collections sous Materialize (http://materializecss.com/collections.html)
  + Afficher le nombre d'utilisateur ainsi que la moyenne d'age des utilisateurs
  + Afficher à coté du nombre utilisateurs le mot "utilisateurs" avec un "s" ou pas selon le nombre d'utilisateur avec la directive "ng-show"
  + Afficher le mots "Il y a que des mineurs" si la moyenne des ages est inférieur à 18 ans avec la directive "ng-show" ou "ng-if"
  + Créer un bouton "remove" à chaque utilisateur permettant au click de supprimer l'utilisateur
  + Si il n'y a plus aucuns utilisateurs, afficher "Plus aucun utilisateurs" et cacher la moyenne d'age
  + Créer des boutons radios Lyon, Paris, Marseille pour filtrer les utilisatur au click de ces bouttons radios
  + Créer des checkbox de tranches d'age permettant de filtrer par age les utilisateurs incluant les tranches de prix suivantes: -10, 10-18, 18-30 , 30-45 , + de 45
   Bonus: Les checkbox de tranches d'age prendra en compte le 1ere filtre sur lesboutons radios
  + Créer un Datepicker pour filtrer par date de naissances les utilisateurs à partir de cette date : avec Materializecss http://materializecss.com/forms.html#date-picker
  + Créer un input range pour filtrer selon la note au bac de 1 à 20 avec Materialize http://materializecss.com/forms.html#range
  + Créer un formulaire d'ajout d'utilisateurs avec l'ensemble de ces données (on fera la validation plus tard, vous piuvez prendre de l'avance et voir comment on valide un formulaire sous ANgular ici https://openclassrooms.com/courses/validation-de-formulaire-simplifiee-avec-angularjs)
  + Bonus: Externaliser les users dans un fichier json et chargé ce fichier en AJAX à l'aide de l'opérateur $http
*/

/**
 * Déclaration de l'application MyCarnetApp
 */
var myCarnetApp = angular.module('myCarnetApp', []);

  // Tri par date de naissance
  myCarnetApp.filter('triDateNaissance', function() {
    return function(tab, date){
      // Si la date est indefini ou null, on retourne le tableau entré
      if (date === undefined || date === null) {
        return tab;
      }
      // Sinon on retourne un tableau filtré ou la date du user est sup à la date choisi
      else {
        return _.filter(tab, function(num) {
          return moment(num.dob,'DD/MM/YYYY') > moment(date);
        });
      }
    };
  });

  // Tri par ville
  myCarnetApp.filter('triVille', function() {

    return function(tab, ville){
      // Si la ville est indefini ou vide, on retourne le tableau entré
      if (ville === undefined || ville === "") {
        return tab;
      }
      // Sinon on retourne un tableau filtré ou la ville correspond à la ville choisi
      else {
        return _.filter(tab, function(num) {
          return num.ville == ville;
        });
      }
    };
  });

  // Tri par notes de bac
  myCarnetApp.filter('triNoteBac',function(){

    return function(tab, note){
      // Si la note est indefini ou null, on retourne le tableau entré
      if(note === undefined || note === null){
        return tab;
      }
      // Sinon on retourne un tableau filtré ou la note est sup à la note choisi
      return  _.filter(tab, function(user){
        return user.noteBac >= note;
      });
    };
  });

  // Tri par tranche d'age
  myCarnetApp.filter('triAge', function(){
    return function(tab, tranches){
      // Si toutes les tranhes sont false (=décoché) alors on retourne le tab
      if (_.every(tranches, function(num) { return num === false;})) {
        return tab;
      }

      var tabFilter =  [];
      // si la tranche 1 est vrai (coché), on retourne un tab filtré avec l'age entre 10-18
      if(tranches[0] === true){
        tabFilter.push(_.filter(tab, function(elt){
          return elt.age >= 10 && elt.age < 18;
        }));
      }
      // si la tranche 2 est vrai (coché), on retourne un tab filtré avec l'age entre 18-30
      if(tranches[1] === true){
        tabFilter.push(_.filter(tab, function(elt){
          return elt.age >= 18 && elt.age < 30;
        }));
      }
      // si la tranche 3 est vrai (coché), on retourne un tab filtré avec l'age entre 30-45
      if(tranches[2] === true){
        tabFilter.push(_.filter(tab, function(elt){
          return elt.age >= 30 && elt.age <= 45;
        }));
      }
      // si la tranche 4 est vrai (coché), on retourne un tab filtré avec l'age +45
      if(tranches[3] === true){
        tabFilter.push(_.filter(tab, function(elt){
          return elt.age > 45;
        }));
      }
      //tabFilter est un tableau de tableau d'objet. concat va permettre de retourné un tableau d'objet.
      tabFilter = [].concat.apply([], tabFilter);

      return tabFilter;
    };
  });

  // Tri les langues et affiche un drapeau à la place
  myCarnetApp.filter('triLangue', function(){
    return function(langue) {
      switch (langue) {
        case "fr":
          return "http://www.icône.com/images/icones/3/8/flag-fr.png";
        case "en":
          return "http://www.icône.com/images/icones/5/4/flag-us.png";
        case "it":
          return "http://www.icône.com/images/icones/4/1/flag-it.png";
        case "es":
          return "http://www.icône.com/images/icones/3/7/flag-es.png";
      }
    };
  });

  // Tri majeur / mineur en fonction du switch
  myCarnetApp.filter('triSwitch', function(){
    return function(tab, switchPosition) {
      // le switch est une checkbox. Au chargement de la page undefined (retourne tab) puis cliqué vrai (age>=18) ou faux (age<18)
      if (switchPosition === true) {
        return _.filter(tab, function(user){
          return user.age >= 18;
        });
      }
      else if (switchPosition === false){
        return _.filter(tab, function(user){
          return user.age < 18;
        });
      }
      else {
        return tab;
      }
    };
  });

  // Tri par bar de recherche utilisateur
  myCarnetApp.filter('triSearchBar', function(){
    return function(tab, string) {
      //Si la barre de recherche est vide ou non definie, retourne tout le tab.
      if (string === '' || string === undefined) {
        return tab;
      }
      else {
        return _.filter(tab, function(user){
          var str = user.nom.toLowerCase() + ' ' + user.prenom.toLowerCase();
          var strInverse = user.prenom.toLowerCase() + ' ' + user.nom.toLowerCase();
          var recherche = string.toLowerCase();
          // Retourne l'utilisateur incluant ce qui est dans la barre de recherche par rapport à un "nom prénom" ou un "prénom nom",
          if (str.includes(recherche) || strInverse.includes(recherche)) {
            return user;
          }
        });
      }
    };
  });

  // Tri par département
  myCarnetApp.filter('triDepartement',function(){

    return function(tab, elmt){
      if(elmt === undefined || elmt === ''){
        return tab;
      }
      return  _.filter(tab, function(user){
        return user.cp.substr(0,2) === elmt.substr(0,2);
      });
    };
  });

  myCarnetApp.controller('carnetCtrl', ['$scope','$filter', '$http',function($scope, $filter, $http) {

  $scope.title = "Carnet d'adresses";

  $scope.selectedAge = [false, false, false, false];

  // + Créer un tableau de 8 utilisateurs avec nom, prénom, age,photo,  date de naissances(dd/mm/YYYY),noteBac (de 1 à 20), sexe(boolean), ville (Paris ou Lyon ou Marseille), biographie, langue(fr,en,it ou es),

  // requette HTTP en GET (via l'url)
  // pour récupérer mon tableau en JSON format
  // 57ab4069e4b0dc55a4ebdcec est l'identifiant de sauvegarde
  $http.get('https://jsonblob.com/api/57ab4069e4b0dc55a4ebdcec').success(function(response) {
    $scope.users = users = response;
  });

  // Tableau pour les ID (de base = nombre utilisateur)
  var tabId = [0,1,2,3,4,5,6,7,];
  // + Afficher le nombre d'utilisateur ainsi que la moyenne d'age des utilisateurs
  $scope.nbUser = function() {
    return  $scope.users.length;
  };

  $scope.moyenneAgeUsers = function() {

    var triDateNaissanceFilter = $filter('triDateNaissance');
    var triVilleFilter = $filter('triVille');
    var triNoteBacFilter = $filter('triNoteBac');
    var triSwitchFilter = $filter('triSwitch');
    var triSearchBarFilter = $filter('triSearchBar');
    var triDepartementFilter = $filter('triDepartement');
    var triAgeFilter = $filter('triAge');


    var naissanceFilter = triDateNaissanceFilter($scope.users,$scope.selectedDate);
    var noteBacFilter = triNoteBacFilter(naissanceFilter, $scope.selectedNote);
    var villeFilter = triVilleFilter(noteBacFilter, $scope.selectedVille);
    var switchFilter = triSwitchFilter(villeFilter, $scope.selectedSwitch);
    var searchFilter = triSearchBarFilter(switchFilter, $scope.selectedSearch);
    var departementFilter = triDepartementFilter(searchFilter, $scope.selectedDepartement);
    var ageFilter = triAgeFilter(departementFilter, $scope.selectedAge);

    if(ageFilter !== undefined){
      return _.reduce(ageFilter, function(memo, num){
        return memo + num.age;
      },0) / (ageFilter.length === 0 ? 1 : ageFilter.length);
    }
  };

  // + Afficher à coté du nombre utilisateurs le mot "utilisateurs" avec un "s" ou pas selon le nombre d'utilisateur avec la directive "ng-show"
  // Voir dans le html le ng-show

  // + Afficher le mots "Il n'y a que des mineurs" si l'age de tous les utilisateurs est inférieur à 18 ans avec la directive "ng-show" ou "ng-if"
  $scope.mineur = function() {
    return _.every($scope.users, function(num) { return num.age < 18;});
  };

  // + Créer un bouton "remove" à chaque utilisateur permettant au click de supprimer l'utilisateur
  $scope.removeUser = function(object) {

    var indexUser = $scope.users.indexOf(object);
    $scope.users.splice(indexUser, 1);

    // Supprime du sessionStorage
    var idUser = object.id;
    if (sessionStorage.getItem("wishList") !== null) {
      var liste = JSON.parse(sessionStorage.getItem("wishList"));
      for (user of liste) {
        if (user.id == idUser) {
          liste.splice(liste.indexOf(user),1);
        }
      }
      sessionStorage.setItem("wishList",JSON.stringify(liste));
    }


    Materialize.toast(object.prenom + ' ' + ' définitivement supprimé !', 2000, 'rounded');
  };
  // + Si il n'y a plus aucuns utilisateurs, afficher "Plus aucun utilisateurs" et cacher la moyenne d'age
  // Voir dans le HTML les ng-hide et ng-show lié à la taille du tableau users.length

  // + Créer des boutons radios Lyon, Paris, Marseille pour filtrer les utilisateur au click de ces bouttons radios
  // Voir dans le HTML le <li class="collection-item avatar" ng-repeat="user in users | filter:selectedVille"> utilisant filter:selectedVille associé aux boutons radios ayant ng-model="selectedVille" ainsi qu'une value d'attribué

  // + Créer des checkbox de tranches d'age permettant de filtrer par age les utilisateurs incluant les tranches de prix suivantes: -10, 10-18, 18-30 , 30-45 , + de 45
  //  Bonus: Les checkbox de tranches d'age prendra en compte le 1ere filtre sur lesboutons radios

  // + Créer un Datepicker pour filtrer par date de naissances les utilisateurs à partir de cette date : avec Materializecss http://materializecss.com/forms.html#date-picker
  // Voir le filtre triDateNaissance

  // + Créer un input range pour filtrer selon la note au bac de 1 à 20 avec Materialize http://materializecss.com/forms.html#range
  // Voir le filtre triNoteBac ci-dessus

  // + Créer un formulaire d'ajout d'utilisateurs avec l'ensemble de ces données (on fera la validation plus tard, vous piuvez prendre de l'avance et voir comment on valide un formulaire sous ANgular ici https://openclassrooms.com/courses/validation-de-formulaire-simplifiee-avec-angularjs)
  $scope.addUser = function() {
    tabId.push(tabId.length);
    var type = function() {
      if($scope.addSexe === "true") {
        return true;
      } else {
        return false;
      }
    }();
    $scope.users.splice($scope.users.length, 0, {
      id: tabId[tabId.length-1],
      nom : $scope.addNom,
      prenom : $scope.addPrenom,
      age : parseInt($scope.addAge),
      photo : $scope.addPhoto,
      dob : moment($scope.addDate).format('DD/MM/YYYY'),
      noteBac: parseInt($scope.addNote),
      sexe: type,
      ville: $scope.addVille,
      biographie: $scope.addBiography,
      langue: $scope.addLangue,
      cp: $scope.addDptm,
    });

    if (type) {
      // Materialize.toast(message, displayLength, className, completeCallback);
      Materialize.toast('Utilisateur ajouté', 3000, 'rounded'); // 4000 is the duration of the toast
      // 'rounded' and 'notif' is the class I'm applying to the toast
    }
    else {
      Materialize.toast('Utilisatrice ajouté', 3000, 'rounded');
    }
    $scope.addNom = $scope.addPrenom = $scope.addAge = $scope.addPhoto = $scope.addDate = $scope.addNote = $scope.addDptm = $scope.addSexe = $scope.addVille = $scope.addBiography = $scope.addLangue = "";

  };

  // + Bonus: Externaliser les users dans un fichier json et chargé ce fichier en AJAX à l'aide de l'opérateur $http


  /**
  *  Application "Carnet d'Adresses" Partie 2
  */

/**
	+ Cacher les cards des users quand il y en a pas et y mettre un petite message en rouge: Aucun utilisateurs trouvé :( (attention aux filtres!!)
  + Ajouter 1 classe css "warning" si l'utilisateur n'a pas eu la moyenne au bac: Directive "ng-class"
  + Créer un filtre qui selon la langue affiche le drapeau du pays pour chaque utilisateurs
	+ Créer un bouton Switch permettant de filtrer les utilisateurs majeurs ou les utilisateurs mineurs
 	+ Créer un moteur de recherche instantanée de recherche de d'utilisateurs sur le nom et le prénom
 	+ Ajouter aux utilisateurs le code postal
  + Ajouter un champ département permettant de filtrer les utilisateurs par départements
  + Bonus : Afficher le nom du département juste en dessus des utilisateurs à chaque changement de département filtré
  + Ajouter un icon "access_time" a coté de chaque utilisateur si ce mois courant est le mois d'anniversaire de l'utilisateur <i class="material-icons">access_time</i> (utiliser moment)
  + Créer une liste déroulante me permettant de trier par nom, par prénom, par age, par note au bac ou par ville
  + Créer une notification (Toast) quand un utilisateurs se crée http://materializecss.com/dialogs.html#toast
  + Ajouter des id "1", "2" , "3" etc... à chaque utilisateurs.
  + Créer un bouton "like" sur chacun utilisateur qui permet de le mémoriser avec la session locale du navigateur sessionStorage par leur id http://www.alsacreations.com/article/lire/1402-web-storage-localstorage-sessionstorage.html
  + Créer une petite liste des utilistaur mise en mémoire restituer dès le chargementd es elements par la session du naviguateur (whishliste)
  + Créer un bouton "+1" qui permet d'ajouter un "+1" à un utilisateur et l'état du bouton change à un icon "check"
  + Avec bower récupérer ngCookie pour créer des cookies et stocker les "+1" des utilisatreurs selon leur id

*/

// + Cacher les cards des users quand il y en a pas et y mettre un petite message en rouge: Aucun utilisateurs trouvé :( (attention aux filtres!!)
// voir directement dans le HTML ng-hide et ng-show avec le message : error 404: users not found

// + Ajouter 1 classe css "warning" si l'utilisateur n'a pas eu la moyenne au bac: Directive "ng-class"
// Voir dans le HTML l'attribut nng-class="{'warning' : {{user.noteBac}}<10}" entourant la note de l'utilisateur

// + Créer un filtre qui selon la langue affiche le drapeau du pays pour chaque utilisateurs
//Voir le filtre triLangue tout en haut ainsi que l'image dans le HTML <img src="{{ user.langue | triLangue }}" class="imgLangue"/>

// + Créer un bouton Switch permettant de filtrer les utilisateurs majeurs ou les utilisateurs mineurs
// Voir le filtre triSwitch ainsi que le ng-model="selectedSwitch" dans le HTML

// + Créer un moteur de recherche instantanée de recherche de d'utilisateurs sur le nom et le prénom
// Voir le filtre triSearchBar ainsi que le ng-model'selectedSearch" dans le HTML

// + Ajouter aux utilisateurs le code postal
// Rajouté dans le tableau des users.

// + Ajouter un champ département permettant de filtrer les utilisateurs par départements
// Voir le filtre triDepartement ainsi que le ng-model'selectedDepartement" dans le HTML


// + AJouter un icon "access_time" a coté de chaque utilisateur si ce mois courant est le mois d'anniversaire de l'utilisateur <i class="material-icons">access_time</i> (utiliser moment)
  $scope.anniv = function(dateUser) {
    var now = moment().format("MM");
    var userMonth = moment(dateUser,"DD/MM/YYYY").format("MM");

    if (now === userMonth) {
      return true;
    }
  };
 // Voir dans HTML <i class="large material-icons swing animated" ng-show="anniv(user.dob)">access_time</i>

// + Créer une liste déroulante me permettant de trier par nom, par prénom, par age, par note au bac ou par ville
// Voir dans HTML ng-model sur le select ainsi que le orderBy:selectedDeroulante

// + Créer une notification (Toast) quand un utilisateurs se crée http://materializecss.com/dialogs.html#toast
// Voir dans la fonction addUSer ci-dessus Materialize.toast('I am a toast!', 4000, 'rounded');

// + Ajouter des id "1", "2" , "3" etc... à chaque utilisateurs.
// Voir id dans le tableau et dans la fonction ajout d'utilisateur

// + Créer un bouton "like" sur chacun utilisateur qui permet de le mémoriser avec la session locale du navigateur sessionStorage par leur id http://www.alsacreations.com/article/lire/1402-web-storage-localstorage-sessionstorage.html
  $scope.likeUser = function(object) {

    var liste = [];
    var drapeau = false;
    var userSimple =
      {
        id: object.id,
        nom: object.nom,
        prenom: object.prenom,
        photo: object.photo,
      };

    if (sessionStorage.getItem("wishList") !== null) {
      liste = JSON.parse(sessionStorage.getItem("wishList"));
    }

    for (user of liste) {

      if (userSimple.id == user.id) {
        liste.splice(liste.indexOf(user),1);
        drapeau = true;
        break;
      }
    }
    if (drapeau === false || sessionStorage.getItem("wishList") === null) {
      liste.push(userSimple);
      Materialize.toast(object.prenom + ' ajouté à la Wish List', 2000, 'rounded');
    }
    else if (drapeau === true) {
      Materialize.toast(object.prenom + ' supprimé de la Wish List', 2000, 'rounded');
    }
    sessionStorage.setItem("wishList",JSON.stringify(liste));
  };

  $scope.coeurUser = function(object) {
    var tab = [];
    var liste = JSON.parse(sessionStorage.getItem("wishList"));
    var userId = object.id;
    if (liste === null || liste.length === tab.length) {
      return false;
    }
    else {

      for (user of liste) {
        if (userId == user.id) {
          return true;
        }
      }
      return false;
    }
  };

// + Créer une petite liste des utilisteurs mise en mémoire restituer dès le chargement des elements par la session du naviguateur (whishliste)
  $scope.actualiseWishList = function() {
      $scope.master = JSON.parse(sessionStorage.getItem("wishList"));
  };

  $scope.verifWishList = function() {
    var tab = [];

    if (JSON.parse(sessionStorage.getItem("wishList")) === null || JSON.parse(sessionStorage.getItem("wishList")).length === tab.length) {
      return false;
    }
    else {
      return true;
    }
  };

// + Créer un bouton "+1" qui permet d'ajouter un "+1" à un utilisateur
  $scope.addPlusUn = function(object) {

    var liste = [];
    var drapeau = false;
    if (sessionStorage.getItem("plusUn") !== null) {
      liste = JSON.parse(sessionStorage.getItem("plusUn"));
    }

    for (user of liste) {
      if (object.id === user.id) {
        user.plus += 1;
        drapeau = true;
      }
    }

    if (drapeau !== true) {
      liste.push({id: object.id, plus: 1,});
    }

    sessionStorage.setItem("plusUn",JSON.stringify(liste));
  };

  $scope.possedePlusUn = function(object) {
    var tab = [];
    var liste = JSON.parse(sessionStorage.getItem("plusUn"));
    var userId = object.id;
    if (liste === null || liste.length === tab.length) {
      return false;
    }
    else {
      for (user of liste) {
        if (userId == user.id) {
          return true;
        }
      }
      return false;
    }
  };

  $scope.qttPlusUn = function(object) {

    var liste = JSON.parse(sessionStorage.getItem("plusUn"));
    var userId = object.id;

    for (user of liste) {
      if (userId == user.id) {
        return user.plus;
      }
    }
  };

  /**
  * Carnet D'Adresse Partie 3 (Maitrise de Module Installer et Environement)
  **/


/**
  + Créer un bouton permettant de vider le panier des favoris des utilisateurs
  + Créer un bouton dans le panier permettant de supprimer un item du panier des favoris
  + Affiher le nombre d'element dans le panier
  + Créer une liste déroulante qui permettra d'afficher 5 / 10 / 15 / 20 utilisateurs
  + Initialiser une note à 0 pour tous les utilisateurs
  + Installer ng-stats pour mesurer les stats de watchers dans votre application https://github.com/kentcdodds/ng-stats
  + AJout d'un module avec Bower: Ajouter à l'application le module Angular Load bar disponible ici http://chieffancypants.github.io/angular-loading-bar/
  + Ajout d'un module avec Bower: Ajouter à lapplication des animations de transitions sur els card avec angular-animate https://docs.angularjs.org/api/ngAnimate
  + Ajout d'un module sous angular: Ajouter la possibilité de noter de 0 à 5 les utilisateurs avec le module Angular Input Star disponible sous bower ici https://github.com/melloc01/angular-input-stars
  + Ajouter 5 commentaires par utilisateurs avec pour chaque commentaires le contenu,la note(sur 5) et la date
  + Afficher le nb. de commentaires sur notre liste d'utilisateurs et un bouton "Voir les commentaires"  où quand je clique sur ce bouton, nous affichons une modal qui affiche les commentaires de cet tilisateur
  + Créer un nouvelle page petrmettant de visualiser le détail d'un utilisateur quand je clique sur sa loupe.
  Pour cela, je vous conseille de regarder ce liens vers le systeme de route et parametres dans la route http://www.tutoriel-angularjs.fr/tutoriel/2-utilisation-complete-d-angularjs/1-le-routage
  + Créer une nouvelle page permettant de visualiser des commentaires de la série GOT derriere l'URL https://jsonplaceholder.typicode.com/comments
  + Bonus: Créer une formulaire perettant l'ajout des commentaires en POST ($http.post) derriere l'url https://jsonplaceholder.typicode.com/comments
  + Bonus 2: Permettre à l'utilisateur de de supprimer un commentaire
*/

// + Créer un bouton permettant de vider le panier des favoris des utilisateurs
  $scope.deleteWishList = function() {
    sessionStorage.removeItem("wishList");
  };

// + Créer un bouton dans le panier permettant de supprimer un item du panier des favoris






// + Affiher le nombre d'element dans le panier






// + Créer une liste déroulante qui permettra d'afficher 5 / 10 / 15 / 20 utilisateurs





// + Initialiser une note à 0 pour tous les utilisateurs





// + Installer ng-stats pour mesurer les stats de watchers dans votre application https://github.com/kentcdodds/ng-stats






// + AJout d'un module avec Bower: Ajouter à l'application le module Angular Load bar disponible ici http://chieffancypants.github.io/angular-loading-bar/





// + Ajout d'un module avec Bower: Ajouter à lapplication des animations de transitions sur els card avec angular-animate https://docs.angularjs.org/api/ngAnimate





// + Ajout d'un module sous angular: Ajouter la possibilité de noter de 0 à 5 les utilisateurs avec le module Angular Input Star disponible sous bower ici https://github.com/melloc01/angular-input-stars






// + Ajouter 5 commentaires par utilisateurs avec pour chaque commentaires le contenu,la note(sur 5) et la date





// + Afficher le nb. de commentaires sur notre liste d'utilisateurs et un bouton "Voir les commentaires"  où quand je clique sur ce bouton, nous affichons une modal qui affiche les commentaires de cet tilisateur





// + Créer un nouvelle page petrmettant de visualiser le détail d'un utilisateur quand je clique sur sa loupe.






// Pour cela, je vous conseille de regarder ce liens vers le systeme de route et parametres dans la route http://www.tutoriel-angularjs.fr/tutoriel/2-utilisation-complete-d-angularjs/1-le-routage





// + Créer une nouvelle page permettant de visualiser des commentaires de la série GOT derriere l'URL https://jsonplaceholder.typicode.com/comments





// + Bonus: Créer une formulaire perettant l'ajout des commentaires en POST ($http.post) derriere l'url https://jsonplaceholder.typicode.com/comments




// + Bonus 2: Permettre à l'utilisateur de de supprimer un commentaire


// Fin du controller carnetCtrl de myCarnetApp
}]);
