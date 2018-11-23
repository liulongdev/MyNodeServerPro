let ws = undefined;

function tryConnectWS() {
    let wsString = $('#wsUrl').val();
    if (wsString && $.trim(wsString).length > 0)
    {
        wsString = $.trim(wsString);
        try {
            // 防止一个客户端多个ws
            if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING))
            {
                ws.close();
            }
            ws = new WebSocket(wsString);
            configWsDelegate(ws);
        } catch (e) {
        }

    }
}

function scrollToEnd(){//滚动到底部
    let h = $(document).height()-$(window).height();
    $(document).scrollTop(h);
}

/* 定时检查ws的连接状态，没有连接就重连 */
let scheduleCheckWSTimer = undefined;
function startScheduleCheckWS()
{
    stopScheduleCheckWS();
    let timer = null;
    if (ws && ws.readyState == WebSocket.OPEN)
    {
        timer = setInterval(function () {
            if (ws == null || (ws.readyState !== WebSocket.OPEN && ws.readyState !== WebSocket.CONNECTING && ws.readyState !== WebSocket.CLOSING))
            {
                tryConnectWS();
            }
        }, 5000);
    }
    scheduleCheckWSTimer = timer;
    return timer;
}

/* 关闭重连ws的定时器 */
function stopScheduleCheckWS() {
    if (scheduleCheckWSTimer)
    {
        clearInterval(scheduleCheckWSTimer);
    }
}

/* ws的代理 */
function configWsDelegate(client)
{
    $('#currentStateId').text('connect...');
    ws.onopen = function () {
        $('#currentStateId').text('connected');
        startScheduleCheckWS();
    };

    ws.onmessage = function(evt)
    {
        let message = evt.data;
        let response = JSON.parse(message);
        if (response)
        {
            if (response.type === 'clientNum') {
                if (response.login)
                {
                    const state = response.login === 1 ? '上线' : '下线';
                    $('#wsMsgContainerId').append('<div class="text-center" style="color: #999; font-size: 12px">' + response.ip + state +
                        '</div>')
                }
                $('#currentStateId').text('online:' + response.body);
            }
            else if (response.type === 'msg') {

                let $div = $('<div></div>');
                let ip = response.ip;
                let msg = response.body && response.body.msg;
                $ipDiv = $('<div class="text-success text-right">' + ip + '</div>');
                $msgDiv = $('<div class="ml-3 mr-2 text-right">' + msg + '</div>');
                $div.append($ipDiv);
                $div.append($msgDiv);
                $('#wsMsgContainerId').append($div);
                scrollToEnd();
            }
        }
        else
        {
            $('#wsMsgContainerId').append('\n' + evt.data);
        }
        $('#wsDiv').append('\n' + evt.data);

    };

    ws.onclose = function(evt)
    {
        $('#currentStateId').text('disConnect');
        $('#wsTextView').append('/n closed');
    };

    ws.onerror = function(evt) {
        $('#wsDiv').append('\n' + 'Error >>>' + evt.data);
        $('#wsTextView').append('\n' + 'Error >>>' + evt.data);
    }
}

let WebSocketAPP = angular.module('WebSocketAPP', []);

WebSocketAPP.controller('WebSocketController', function ($scope) {

    $scope.connectEnabled = true;
    $scope.disConnectEnabled = true;
    $scope.websocketUrl = 'ws://192.168.2.3:8080';
    $scope.sendMsgText = undefined;
    $scope.connectFun = function () {
        tryConnectWS();
    };

    $scope.disConnectFun = function () {
        stopScheduleCheckWS();
        ws && ws.close();
        ws = undefined;
    };

    $scope.sendMsgFun = function () {
        if ($.trim($scope.sendMsgText).length > 0)
        {
            if (ws && ws.readyState === WebSocket.OPEN)
            {
                ws.send($scope.sendMsgText);

                let $div = $('<div></div>');
                let ip = '我';
                $ipDiv = $('<div class="text-success">' + ip + '</div>');
                $msgDiv = $('<div class="ml-2 mr-3">' + $scope.sendMsgText + '</div>');
                $div.append($ipDiv);
                $div.append($msgDiv);
                $('#wsMsgContainerId').append($div);
                $scope.sendMsgText = '';
                scrollToEnd();
            }
        }
    };
});
