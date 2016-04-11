angular.module('player',['ionic'])	

.factory('formatTime', ['$filter',function($filter){
	return function(time){

		//converting seconds to milliseconds
		var milliseconds = time * 1000;
		
		var format = milliseconds < 3600000 ? 'mm:ss' : 'HH:mm:ss';

		return $filter('date')(milliseconds,format);
	}
}])

.directive('player', function(){
	return{
		restrict:'E',
		scope:{},
		bindToController:{
			src: '@',
			oldAudios: '=audios' 
		},
		controller: ['$scope', '$ionicLoading', function($scope, $ionicLoading){

			var self = this;

			this.count = 0;

			this.paused = false;

			this.loading = {
				show:function(){
					$ionicLoading.show({
						template:'Carregando...'
					});	
				},
				hide: function(){
					$ionicLoading.hide();
					self.show = true;
					$scope.$apply();
				}
			} 	

			this.show = false;

			this.updateTouchCount = function(){
				this.count = (this.count === 0) ? ++this.count: 0;
			}
			
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

			ctrl.loading.show();

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

.directive('audio', ['formatTime', function(formatTime){
	return{
		restrict:'E',
		require:'^^player',
		link: function(scope, audio, attr, playerCtrl){
			var duration;

			audio.on('canplay', function(){
				duration = audio[0].duration;

				playerCtrl.duration = formatTime(duration);
				
				playerCtrl.loading.hide();
			})

			audio.on('timeupdate', function(){

				var currentTime = audio[0].currentTime;	

				scope.rangeValue = currentTime/duration*100;
				playerCtrl.time = formatTime(currentTime);
				
				scope.$apply();
			})

			scope.$on('pauseAudio', function(){
				audio[0].pause();
				playerCtrl.updatePausedState();	
			})

			scope.$on('updateTime', function(event, data){

				var currentTime = audio[0].currentTime = data.rangeValue/100 * duration;
				playerCtrl.time = formatTime(currentTime);

				audio[0].play();

				playerCtrl.updatePausedState();			
			})
		}
	}
}])



;

