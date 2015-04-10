var myApp = angular.module('todoApp', []);
myApp.controller('todoController', ['$scope', '$http','$location', function($scope, $http, $location) {

$scope.model = {
		todos: [{}],
		selected: {},
		statusFilter:''
};

var refresh = function() {
	$http.get('/todos').success(function(response) {
		$scope.model.todos = response;
		$scope.todoAddField = "";
		$scope.isDisabled = false;
	});
};

refresh();

$scope.addService = function() {
	console.log("Post value is" + JSON.stringify($scope.todoAddField));
	$http.post('/todos', $scope.todoAddField).success(function(response) {
		refresh();
	}).
	error(function(data, status, headers, config) {
		console.log("Failed to post");
	});
};

$scope.remove = function(id) {
	$http.delete('/todos/' + id).success(function(response) {
		refresh();
	});
};

$scope.edit = function(id) {
	$scope.isDisabled = true;
	$http.get('/todos/' + id).success(function(response) {
		$scope.model.selected = angular.copy(response);
	});
};  

$scope.update = function(idx) {
	$scope.model.todos[idx] = angular.copy($scope.model.selected);
	$http.put('/todos/' + $scope.model.todos[idx]._id, $scope.model.todos[idx]).success(function(response) {
		refresh();
		$scope.reset();
  });
};

$scope.deselect = function() {
  $scope.todoAddField = "";
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
	$http.put('/todos/'+id, $scope.model.todos[idx]).success(function(response) {
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
    angular.forEach($scope.model.todos, function (todo) {
        if (todo.completed) {
        	$scope.remove(todo._id);
        } else {
            remainingTodos.push(todo);
        }
    });
    $scope.model.todos = remainingTodos;
};
}]);
