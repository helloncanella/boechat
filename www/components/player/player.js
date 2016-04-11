angular.module('player',[])	

.directive('player', function(){
	return{
		restrict:'E',
		scope:{},
		bindToController:{
			src: '@',
			oldAudios: '=audios' 
		},
		controller: ['$scope', function($scope){
			this.paused = false;
			
			this.registerAudio = function(audio){
				this.oldAudios.push(audio[0]);		
			};

			this.updateTime = function(rangeValue){
				$scope.$broadcast('updateTime', {rangeValue: rangeValue})
			};

			this.pauseAudio = function(){
				$scope.$broadcast('pauseAudio');
			};

			this.updatePausedState = function(){
				this.paused = ! this.paused;
			};	
		}],
				
		link: function(scope, element, attr, ctrl){

			var audio = element.find('audio');
			ctrl.registerAudio(audio);

			var button = element.find('button');

			button.on('click', function(){
				if(ctrl.paused){
					audio[0].play();	
				}else{
					audio[0].pause();
				}
				ctrl.updatePausedState();	
				scope.$apply();
			})
		},
		controllerAs: 'ctrl',
		templateUrl: 'components/player/player.html'
	}
})

.directive('audio', function(){
	return{
		restrict:'E',
		require:'^^player',
		link: function(scope, audio, attr, playerCtrl){
			var duration;

			audio.on('canplay', function(){
				duration = audio[0].duration;
			})

			audio.on('timeupdate', function(){
				scope.rangeValue = audio[0].currentTime/duration*100;
				scope.$apply();
			})

			scope.$on('pauseAudio', function(){
				audio[0].pause();
				playerCtrl.updatePausedState();	
			})

			scope.$on('updateTime', function(event, data){
				audio[0].currentTime = data.rangeValue/100 * duration;
				audio[0].play();
				playerCtrl.updatePausedState();			
			})
		}
	}
})

;

