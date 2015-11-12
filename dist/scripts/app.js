(function() {

  angular
    .module('app', [
      'ui.router',
      'app.controllers'
    ])
    .config([
      '$stateProvider',
      '$locationProvider',
      MainConfig
    ]);

  function MainConfig($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(
      {
        enabled: true,
        requireBase: false
      }
    );

    $stateProvider.state('main',
      {
        url: '/',
        controller: 'BlocPongController',
        templateUrl: 'templates/home.html'
      }
    );
  }

})();