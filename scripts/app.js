angular.module('khe', ['ngRoute', 'ngCookies', 'btford.socket-io']);

angular
  .module('khe')
  .config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true);
  }]);