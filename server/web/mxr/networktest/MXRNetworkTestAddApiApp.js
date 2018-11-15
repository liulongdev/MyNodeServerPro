
let mxrNetworkTestAddApiApp = angular.module('MXRNetworkTestAddApiApp', []);

mxrNetworkTestAddApiApp.controller('MXRNetworkTestAddApiController', ['$scope', '$http', function ($scope, $http) {
    $scope.paramDataTypeArray = ['string', 'number', 'boolean'];
    $scope.selectDataType = $scope.paramDataTypeArray[0];

    $scope.apiMethods = ['GET', 'POST'];
    $scope.selectApiMethod = $scope.apiMethods[0];

    $scope.paramDescription = undefined;                   // 接口描述
    $scope.needMxrHeader = true;                    // 是否需要请求头
    $scope.paramDictionary = {};                    // 参数
    $scope.hiddenParamTableView = true;             // 是否隐藏参数列表视图
    $scope.apiRoute = undefined;                   // 接口
    $scope.apiAuthor = undefined;                   // 作者
    $scope.apiModule = undefined;                   // 模块
    $scope.apiRouteDescription = undefined;        // 接口描述

    $scope.addParamFun = function () {
        if ($scope.apiParamKey && $scope.apiParamKey.length > 0)
        {
            $scope.paramDictionary[$scope.apiParamKey] = {'dataType':$scope.selectDataType, 'description': $scope.paramDescription};
            $scope.apiParamKey = undefined;
            $scope.paramDescription = undefined;
            $scope.hiddenParamTableView = false;

        }
    };

    $scope.addApiRouteFun = function () {
        if ($scope.apiRoute && $.trim($scope.apiRoute).length > 0 && $scope.apiRouteDescription && $.trim($scope.apiRouteDescription).length > 0)
        {
            let postBody = {};
            postBody['route'] = $.trim($scope.apiRoute);
            postBody['description'] = $scope.apiRouteDescription;
            postBody['params'] = $scope.paramDictionary;
            postBody['author'] = $scope.apiAuthor;
            postBody['needMxrHeader'] = $scope.needMxrHeader;
            postBody['module'] = $scope.apiModule;
            postBody['method'] = $scope.selectApiMethod;

            let config = {
                method: 'POST',
                params: postBody,
                timeout: 20000,
            };
            $http.post('/api/mxr/core/mxr/v1/network/add', config)
                .success(function (data, status, headers, config) {
                    if (status === 200 && data.header.errCode === 0)
                    {
                        alert('增加接口成功');
                        _clearData();
                    }
                    else
                        alert(data.header.errMsg);
                })
                .error(function (data, status, headers, config) {
                    alert('操作失败， 请重试');
                });
        }
    };

    function _clearData() {
        $scope.paramDescription = undefined;                   // 接口描述
        $scope.needMxrHeader = true;                    // 是否需要请求头
        $scope.paramDictionary = {};                    // 参数
        $scope.hiddenParamTableView = true;             // 是否隐藏参数列表视图
        $scope.apiRoute = undefined;                   // 接口
        $scope.apiAuthor = undefined;                   // 作者
        $scope.apiModule = undefined;                   // 模块
        $scope.apiRouteDescription = undefined;        // 接口描述
        _updateParamDictionary();

    }

    function _updateParamDictionary() {
        $scope.hiddenParamTableView = _getJsonLength($scope.paramDictionary) > 0 ? false : true;
    }

    function _getJsonLength(json) {
        let length = 0;
        for (jsonKey in json){
            length++;
        }
        return length;
    }
}]);