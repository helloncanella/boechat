angular.module('player',[])	

.directive('player', function(){
	return{
		restrict:'E',
		scope:{},
		bindToController:{
			src: '@',
			oldAudios: '=audios' 
		},
		controller: function(){
			this.state = false;
			this.registerAudio = function(audio){
				this.oldAudios.push(audio[0]);		
			}
		},
		link: function(scope, element, attr, ctrl){
			var audio = element.find('audio');
			ctrl.registerAudio(audio);				
		},
		controllerAs: 'ctrl',
		templateUrl: 'components/player/player.html'
	}
})

;

