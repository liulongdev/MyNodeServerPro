const _ = require('lodash');
const crypto = require('crypto');
const MARUtil = require('../lib/util/index');
const AllUrl = require('./all_url');
const MARResponseModel = require('./mar_response_model');
const dbOp = require('../data/db');
const models = require('../models');
const superagent = require('superagent');

function mxr_express_server_wangyixin(app) {

    app.use('/api/core/wyx/*', function (req, res, next){
        const appKey = 'f98bfbd723373582824634e8699d0d77';
        const currentTimeString = Math.round(Date.now()/1000) + '';
        const randomString = Math.round(Math.random()*10000) + 1000 + '';
        const appSecret = '8f300abc0e68';
        console.log(randomString);
        const allString = appSecret + randomString + currentTimeString;

        const signature = crypto.createHash('sha1').update(allString).digest('hex');        // sha1加密
        res.header('AppKey', appKey);
        res.header('Nonce', randomString)
        res.header('CurTime', currentTimeString);
        res.header('CheckSum', signature);
        next();
    });

    // app.post('/api/core/', function (req, res, next) {
    //
    //
    // });

    const uuid = MARUtil.generateUUID();

    const appKey = 'f98bfbd723373582824634e8699d0d77';
    const currentTimeString = Math.round(Date.now()/1000) + '';
    const randomString = Math.round(Math.random()*10000) + 1000 + '';
    const appSecret = '8f300abc0e68';
    const allString = appSecret + randomString + currentTimeString;
    const signature = crypto.createHash('sha1').update(allString).digest('hex');        // sha1加密
    console.log(randomString);
    console.log(currentTimeString);
    console.log(signature);

    let param = {'accid' :'110'};
    let paramStr = "{'accid' :'110'}";
    superagent
        .post('https://api.netease.im/nimserver/user/refreshToken.action?accid=110')
        .set('Content-Type', 'application/json;charset=utf-8')
        .set('AppKey', appKey)
        .set('Nonce', randomString)
        .set('CurTime', currentTimeString)
        .set('CheckSum', signature)
        .end(function (err, res) {
            if (err)
            {
                console.log(err);
                reject(err +'');
            }
            else
            {
                console.log(res.text);
                const responseJson = JSON.parse(res.text);
                if (responseJson && responseJson['code'] === 200)
                {
                    console.log(responseJson['info']);
                }
            }
        });

    app.get('/wy/test', function (req, res, next) {
       console.log(req);
       res.end('Hello , martin');
    });

}

module.exports = mxr_express_server_wangyixin;