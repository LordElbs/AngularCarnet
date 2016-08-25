myCarnetApp.config(['$routeProvider',
  function($routeProvider) {
    // Système de routage
    $routeProvider
    .when('/', {
      templateUrl: 'partials/home.html',
      controller: 'carnetCtrl'
    })
    .when('/infoUser/:idUser', {
      templateUrl: 'partials/infoUser.html',
      controller: 'infoCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
  }
]);
