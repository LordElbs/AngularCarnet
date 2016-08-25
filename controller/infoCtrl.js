  myCarnetApp.controller('infoCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

  // requette HTTP en GET (via l'url)
  // pour récupérer mon tableau en JSON format
  // 57ab4069e4b0dc55a4ebdcec est l'identifiant de sauvegarde
  $http.get('https://jsonblob.com/api/57ad80bbe4b0dc55a4ec6341').success(function(response) {
    $scope.users = users = response;
    for (user of users) {
      if (user.id === $routeParams.idUser) {
        $scope.currentUser = user;
      }
    }
  });

// + AJouter un icon "access_time" a coté de chaque utilisateur si ce mois courant est le mois d'anniversaire de l'utilisateur <i class="material-icons">access_time</i> (utiliser moment)
  $scope.anniv = function(dateUser) {
    var now = moment().format("MM");
    var userMonth = moment(dateUser,"DD/MM/YYYY").format("MM");

    if (now === userMonth) {
      return true;
    }
  };
 // Voir dans HTML <i class="large material-icons swing animated" ng-show="anniv(user.dob)">access_time</i>

// + Afficher le nb. de commentaires sur notre liste d'utilisateurs et un bouton "Voir les commentaires"  où quand je clique sur ce bouton, nous affichons une modal qui affiche les commentaires de cet tilisateur
  // Moyenne des commentaires de l'utilisateur (object)
  $scope.moyenneCommentaires = function(object) {

      return _.reduce(object.commentaire, function(memo, num){
        return memo + parseInt(num.etoile);
      },0) / (object.commentaire.length === 0 ? 1 : object.commentaire.length);
  };

  $scope.modalTrigger = function (id) {
    console.log(id, $('#' +  id));
    $('#modal' + id).openModal();
   };

// + Créer un nouvelle page permettant de visualiser le détail d'un utilisateur quand je clique sur sa loupe. Pour cela, je vous conseille de regarder ce liens vers le systeme de route et parametres dans la route http://www.tutoriel-angularjs.fr/tutoriel/2-utilisation-complete-d-angularjs/1-le-routage


// + Créer une nouvelle page permettant de visualiser des commentaires de la série GOT derriere l'URL https://jsonplaceholder.typicode.com/comments





// + Bonus: Créer une formulaire perettant l'ajout des commentaires en POST ($http.post) derriere l'url https://jsonplaceholder.typicode.com/comments




// + Bonus 2: Permettre à l'utilisateur de de supprimer un commentaire


// Fin du controller carnetCtrl de myCarnetApp
}]);
