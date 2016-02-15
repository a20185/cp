'use strict';
var isLogin = false;
var isRegister = false;
var currentUser = 'null';

/* Controllers */

function mainCtrl($scope) {
  $scope.currentUser = "Guest";
  $scope.showAuth = function() {
    if (currentUser != 'null') {
      $scope.currentUser = currentUser;
    }
    if (isLogin || isRegister) {
      return true;
    } else {
      return false;
    }
  }
  $scope.hello = function() {
    console.log('HELLO');
    console.log(isLogin);
  }
}

function IndexCtrl($scope, $http , $location) {
  $http.get('/onlineStatus').
      success(function(data) {
        if (data.status == true) {
          isLogin = true;
          currentUser = data.username;
        } else {
          isLogin = false;
          isRegister = false;
          currentUser = 'null';
        }
      });
  if (isLogin == false && isRegister == false) {
    $location.path('/login');
  } else {
    $location.path('/assignments');
  }
}

function AddPostCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.submitPost = function () {
    $http.post('/api/post', $scope.form).
      success(function(data) {
        $location.path('/');
      });
  };
}


function LoginCtrl($scope, $http, $location , $window) {
  console.log("Login");
  $scope.form = {};
  $scope.warning = {};
  console.log($scope.form);
  console.log($scope.warning);
  $scope.getLogin = function() {
      console.log('Button Clicked!');
      console.log($scope.form.username);
      console.log($scope.form.passwd);
      $http.post('/api/login' , $scope.form).
        success(function(data) {
          console.log(data);
          if (data.status == true) {
            isLogin = true;
            currentUser = data.user;
            $location.path('/');
          } else {
            $window.alert(data.why);
            // $scope.warning.user = 'Login Failed!';
          }
      });
  };
  $scope.validate = {user: false , passwd : false};
  $scope.userCheck = function() {
    $scope.validate.user = false;
    if (!$scope.form.username) {
      return '';
    } else if ($scope.form.username == '') {
      return '请输入用户名';
    } else if ($scope.form.username.length < 6) {
      return '用户名太短(至少6位)';
    } else if ($scope.form.username.length > 8) {
      return '用户名太长(至多8位)';
    } else {
      var pattern = /\b(^[A-Za-z]['_A-Za-z0-9]{5,7}$)\b/;
      if (pattern.test($scope.form.username)) {
        $scope.validate.user = true;
        return 'OK!';
      } else {
        return '用户名应用字母开头';
      }
    }
  };

  $scope.passCheck = function() {
    $scope.validate.passwd = false;
    if (!$scope.form.passwd) {
      return '';
    } else if ($scope.form.passwd == '') {
      return '请输入密码';
    } else if ($scope.form.passwd.length < 6) {
      return '密码太短(至少6位)';
    } else if ($scope.form.passwd.length > 12) {
      return '密码太长(至多12位)';
    } else {
      $scope.validate.passwd = true;
      return 'OK!';
    }
  };

  $scope.canClick = function() {
    if ($scope.validate.passwd && $scope.validate.user) {
      return true;
    } else {
      return false;
    }
  };
}

function RegisterCtrl($scope , $http , $location) {

}

// Read Assignment Data
function AssCtrl($scope , $http , $location) {
  $scope.ass = [];
  $http.get('/api/assignments').
    success(function(data, status , headers , config) {
      $scope.ass = data.assignments;
      console.log('/** Successfully get Assignment Datas **/');
    });
}

function UploadCtrl($scope , $http , $location , $routeParams) {
  console.log('Completed?');
}


function ReadPostCtrl($scope, $http, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });
}

function EditPostCtrl($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.form = data.post;
    });

  $scope.editPost = function () {
    $http.put('/api/post/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}

function DeletePostCtrl($scope, $http, $location, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });

  $scope.deletePost = function () {
    $http.delete('/api/post/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}
