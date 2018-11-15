let mxrNetworkTestApp = angular.module('MXRNetworkTestApp', []);

mxrNetworkTestApp.controller('MXRNetworkTestController', ['$scope', '$http', function ($scope, $http) {

    $scope.hosts = [{'site':'内网125测试', 'host':'http://192.168.0.125:20000'},
        {'site':'内网145测试', 'host':'http://192.168.0.145:20000'},
        {'site':'外网正式', 'host':'http://bs-api.mxrcorp.cn'},
        {'site':'外网测试', 'host':'htp://bs-api-test.mxrcorp.cn'}
        ];
    $scope.selectHost = $scope.hosts[2];
    $scope.selectApiUrl = undefined;

    $scope.changeHostFun = function() {
        $scope.requestUrl = $scope.selectHost.host + $scope.selectApiUrl.route;
    };

    $scope.apiMethods = ['GET', 'POST'];
    $scope.selectApiMethod = $scope.apiMethods[0];

    let getAllApiConfig = {headers: {'mxr-key':$scope.mxrHeader},
        method: 'GET',
        params: $scope.requestJson,
        timeout: 20000,
    };
    $http.get('/api/mxr/core/mxr/v1/network/getAll', getAllApiConfig)
        .success(function (data, status, headers, config) {
            if (status === 200 && data.header.errCode === 0)
            $scope.apiUrls = JSON.parse(data.body);
            if ($scope.apiUrls.length > 0)
            {
                $scope.selectApiUrl = $scope.apiUrls[0];
                $scope.requestJson = {};
                for (key in $scope.selectApiUrl.params)
                {
                    $scope.requestJson[key] = '';
                }
            }
        })
        .error(function (data, status, headers, config) {

        });

    /* 请求头设置    start */
    $scope.isHiddenMxrHeader = true;    // 隐藏请求头视图的标志
    $scope.isHiddenMxrParam = false;    // 隐藏参数视图的标志
    $scope.addHeaderKey = '';           // 增加请求头的key
    $scope.addHeaderValue = '';         // 增加请求头key对应的value
    $scope.mxrHeader = {'userId':'122934',
        'deviceId':'1D4F381D-F2BC-4C94-B0B1-42CC3EDFB059',
        'region':'0',
        'appVersion':'5.17.0',
        'osType':'1',
        'deviceUnique':'D52B7383-C486-4686-A7E8-5E857E78F936',
        'appId':'10000000000000000000000000000001',
    };      // 默认的请求头模型

    $scope.deleteMxrHeaderFun = function (key) {
        delete $scope.mxrHeader[key];
    };

    $scope.addMxrHeaderKayValueFun = function () {
        let key = $scope.addHeaderKey;
        let value = $scope.addHeaderValue;
        if (typeof key === "string" && key.length > 0)
            $scope.mxrHeader[key] = value;
        $scope.addHeaderKey = '';
        $scope.addHeaderValue = '';
    };
    /* 请求头设置    end */

    $scope.requestJson = {'deviceId':'1D4F381D-F2BC-4C94-B0B1-42CC3EDFB059',
        'page':'1',
        'param':'0',
        'region':'0',
        'rows':'50',
        'search':'normal',
        'topNums':'20'
    };  // 默认的参数模型
    $scope.reqeustAddKay = '';          // 参数增加的key
    $scope.reqeustAddValue = '';        // 参数增加的value
    $scope.responseData = undefined;    // 请求返回的data
    $scope.responseStatus = undefined;  // 请求返回的状态码
    $scope.responseConfig = undefined;  // 请求返回的设置

    $scope.changeRequestJsonValue = function (key) {
        const queryId = '#mxr-request-key-'+key;
        $scope.requestJson[key] = $(queryId).val();
    };

    /* url start */
    $scope.apiUrls = [{description:'书城首页数据', route:'/core/home/1'}];     // 展示的所有接口的路由
    $scope.selectApiUrl = $scope.apiUrls[0];                        // 选择的接口路由
    $scope.requestUrl = $scope.selectHost.host + $scope.selectApiUrl.route;

    // 选择接口变化， 刷新RUL等
    $scope.apiUrlChangeFun = function() {
        $scope.requestUrl = $scope.selectHost.host + $scope.selectApiUrl.route;
        $scope.requestJson = {};
        for (key in $scope.selectApiUrl.params)
        {
            $scope.requestJson[key] = '';
        }
        if ($scope.selectApiUrl.method)
        {
            $scope.selectApiMethod = $scope.selectApiUrl.method;
        }
        $scope.responseConfig = undefined;
        $scope.responseData = undefined;
        $scope.responseStatus = undefined;

    };

    /*  测试接口获取数据  */
    $scope.testRequestFun = function () {                           // 请求接口
        let apiUrl = $scope.selectHost.host + $scope.selectApiUrl.route;
        $scope.requestJson['mxrUrl'] = $('#requestUrl').val(); // apiUrl;
        let config = {
            headers: {'mxr-key': $scope.mxrHeader},
            method: $scope.selectApiMethod,
            params: $scope.requestJson,
            timeout: 20000,
        };

        if ($scope.selectApiMethod === 'POST') {
            $http.post('/api/mxr/core/mxr/v1/test', config)
                .success(function (data, status, headers, config) {
                    $scope.responseData = JSON.stringify(data);
                    $scope.responseStatus = status;
                    $scope.responseConfig = JSON.stringify(config);
                })
                .error(function (data, status, headers, config){
                    $scope.responseData = JSON.stringify(data);;
                    $scope.responseStatus = status;
                    $scope.responseConfig = JSON.stringify(config);;
                });
        }
        else {
            $http.get('/api/mxr/core/mxr/v1/test', config)
                .success(function (data, status, headers, config) {
                    $scope.responseData = JSON.stringify(data);
                    $scope.responseStatus = status;
                    $scope.responseConfig = JSON.stringify(config);
                })
                .error(function (data, status, headers, config){
                    $scope.responseData = JSON.stringify(data);;
                    $scope.responseStatus = status;
                    $scope.responseConfig = JSON.stringify(config);;
                });
        }
    };

    // 书城首页
    // $scope.bookStoreModel = {};

}]);
