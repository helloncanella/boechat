// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ngCordova','player'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)


    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider,$urlRouterProvider, $sceDelegateProvider, $ionicConfigProvider) {



  //Whitelisting audios's url
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    '*://www.bandnewsfm.com.br/**',
    '*://bandnewsfm.com.br/**',
    '*://bandnewsfm.band.com.br/**',
  ])

  //limiting the number of cached audios
  $ionicConfigProvider.views.maxCache(1);

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  
  .state('podcasts', {
    abstract:true,
    url:'/podcasts',
    templateUrl:'components/podcasts/podcasts.html',
    controller: [ '$http', '$scope', 'xmlToJson', function($http, $scope, xmlToJson){

      //Proxying in order to bypass CORS - impossible to use JSONp when the response is xml
      var url = 'http://proxy-helloncanella.c9users.io/';

      $http({
        method: 'get',
        url: url,
        transformResponse: function(xml){
          // transforming xml into json
          var json = xmlToJson.X2JS().xml_str2json(xml);
          return json;
        }
      }).success(function(response){
        var podcasts = response.rss.channel.item;

        podcasts.forEach(function(item, index, array){
          item.id=index;
        });

        $scope.podcasts = podcasts;
        console.log($scope.podcasts[0])

      })



      ;

    }]
  })

  .state('podcasts.list',{
    url:"/list",
    views:{
      'list-tab':{
        templateUrl:"components/podcasts/podcasts-list.html",
      }
    }
  })

  .state('podcasts.listen', {
    url:"/listen/:id",
    views:{
      'listen-tab':{
        templateUrl:"components/podcasts/podcasts-listen.html",
        controller:['$scope', '$stateParams', function($scope, $stateParams){
          var podcast = $scope.podcasts[$stateParams.id] 
 
          $scope.src = podcast.enclosure._url;
          $scope.length = podcast.enclosure._length;
          $scope.title = podcast.title;
        }]
      }
    }
  })

  

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/podcasts/list');

})

.factory('xmlToJson', function(){
  return {
     X2JS: function(){
        return new window.X2JS()
     } 
  }
})






;
