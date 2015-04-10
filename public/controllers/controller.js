var myApp = angular.module('serviceApp', []);
myApp.controller('serviceController', ['$scope', '$http','$location', function($scope, $http, $location) {

$scope.model = {
		serviceClients: [{}],
		selected: {},
		statusFilter:''
};

var refresh = function() {
	$http.get('/serviceClients').success(function(response) {
		$scope.model.serviceClients = response;
		$scope.serviceClientField = "";
		$scope.CustomErrorMsg = false;
		$scope.isDisabled = false;
	});
};

refresh();

$scope.addService = function() {
	console.log("Post value is" + JSON.stringify($scope.serviceClientField));
	$http.post('/serviceClients', $scope.serviceClientField).success(function(response) {
		refresh();
	}).
	error(function(data, status, headers, config) {
		console.log("Failed to post");
		$scope.CustomErrorMsg = true;
	});
};

$scope.remove = function(id) {
	$http.delete('/serviceClients/' + id).success(function(response) {
		refresh();
	});
};

$scope.edit = function(id) {
	$scope.isDisabled = true;
	$http.get('/serviceClients/' + id).success(function(response) {
		$scope.model.selected = angular.copy(response);
	});
};  

$scope.update = function(idx) {
	$scope.model.serviceClients[idx] = angular.copy($scope.model.selected);
	$http.put('/serviceClients/' + $scope.model.serviceClients[idx]._id, $scope.model.serviceClients[idx]).success(function(response) {
		refresh();
		$scope.reset();
  });
};

$scope.deselect = function() {
  $scope.serviceClientField = "";
};

$scope.getTemplate = function (contact) {
    if (contact._id && (contact._id === $scope.model.selected._id)) {
    	return 'edit';
    }
    else { 
    	return 'display';
    }
};

$scope.reset = function () {
    $scope.model.selected = {};
    $scope.isDisabled = false;
};

$scope.updateToDoState = function(id,idx) {
	$http.put('/serviceClients/'+id, $scope.model.serviceClients[idx]).success(function(response) {
		refresh();
		$scope.reset();
	});	
};

$scope.$on('$locationChangeSuccess', function () {
	var status = $location.absUrl().split('=')[1] || '';
	$scope.statusFilter = (status === 'active')?{ completed: false } : (status === 'completed') ?{ completed: true } : null;
});

$scope.clearCompletedTodos = function () {
    var remainingTodos = [];
    angular.forEach($scope.model.serviceClients, function (todo) {
        if (todo.completed) {
        	$scope.remove(todo._id);
        } else {
            remainingTodos.push(todo);
        }
    });
    $scope.model.serviceClients = remainingTodos;
};
}]);
