angular.module('player',[])

.controller('audioController', [ '$scope', function($scope){
  $scope.audios = [];

  $scope.stopOldAudios = function(){
    $scope.audios.forEach(function(audio, index, array){
      audio.pause();
    })

    $scope.audios = []
  }

}])
	
.directive('video', function(){  
  return{
    restrict:'E',
    link: function(scope, element){
      scope.audios.push(element[0]);
    }
  }
})	

.directive('player', function(){
	return{
		restrict:'E',
		scope:{},
		bindToController:{
			src: '@' 
		},
		controller: function(){
			this.src = '';
			this.state = false;
		},
		controllerAs: 'ctrl',
		templateUrl: 'components/player/player.html'
	}
})

;

