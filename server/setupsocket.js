/**
 * Created by Martin on 2018/3/23.
 */

function setupSocketServer() {
    //在线用户
    let wsSockets = {};

    let WebSocketServer = require('ws').Server,
        wss = new WebSocketServer({port: 8181});


    wss.on('connection', function (ws, req) {

        ws.on('message', function (message) {

        });

        ws.on('close', function (ws) {
            closeSocket();
        });

        function closeSocket() {
            let socket = wsSockets[uuid];
            if (socket && socket.readyState !== 1)
            {
                broadcast(JSON.stringify({'type':'sendMsg','params':uuid+'断开连接' + ', userId:' + userId}));
                delete wsSockets[uuid];
            }
            socket = wsSockets[userId];
            if (socket && socket.readyState !== 1)
            {
                broadcast(JSON.stringify({'type':'sendMsg','params':uuid+'断开连接' + ', userId:' + userId}));
                delete wsSockets[userId];
            }
            // for(var i = 0; i < wsSockets.length; i++) {
            //     if(wsSockets[i].uuid == uuid) {
            //         broadcast(JSON.stringify({'type':'sendMsg','params':uuid+'断开连接'}));
            //         wsSockets.splice(i, 1);
            //     }
            //     if (wsSockets[i] && wsSockets[i].ws.readyState !== 1)
            //     {
            //         wsSockets.splice(i, 1);
            //     }
            // }
        }
    });

    function broadcast(msg, socket) {
        // console.log(msg);
        for (let key in wsSockets)
        {
            let ws = wsSockets[key];
            if (ws.readyState === 1 && ws !== socket) {
                ws.send(msg);
            }
        }
    };
}

module.exports = setupSocketServer;