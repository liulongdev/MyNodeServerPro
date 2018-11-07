

let mxrEncryptionApp = angular.module('MXREncryptionApp', []);

mxrEncryptionApp.controller('MXREncryptionController', ['$scope', '$http', function ($scope, $http) {

    $scope.firstText = '';
    $scope.encoderStr = '';
    $scope.resultText = '';
    $scope.encodeFun = function () {
        $scope.resultText = '';
        const url = '/api/mxr/core/mxr/v1/encoder';
        let body = {content:$scope.firstText};
        $http.post(url, body)
            .success(function (data, status, headers, config) {
                if (status === 200)
                {
                    $scope.resultText = data.body;
                }
            })
            .error(function (data, status, headers, config) {

            });
    };

    $scope.decodeFun = function () {

        if (!(/[a-zA-Z0-9+/=]+$/.test($scope.firstText)))
        {
            alert('格式不对，无法解码');
            return;
        }

        $scope.resultText = '';
        const url = '/api/mxr/core/mxr/v1/decoder';
        let body = {content:$scope.firstText};
        $http.post(url, body)
            .success(function (data, status, headers, config) {
                if (status === 200)
                {
                    $scope.resultText = data.body;
                }
            })
            .error(function (data, status, headers, config) {

            });
    };

}]);