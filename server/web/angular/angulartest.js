/**
 * Created by Martin on 2017/12/5.
 */
let firstApp = angular.module('myApp', []);
firstApp.controller('FirstController', function ($scope) {
    $scope.first = 'Some';
    $scope.last = 'One';
    $scope.heading = 'Message : ';
    $scope.updateMessage = function () {
        $scope.message = 'Hello ' + $scope.first + ' ' + $scope.last + '!';
        if ($scope.first === '13218189892' && $scope.last === '123456')
        {
            window.location.href='../jiubang';
        }
        else
        {
            alert('error');
        }
    };
});