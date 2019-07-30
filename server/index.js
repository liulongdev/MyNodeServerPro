/**
 * Created by Martin on 2017/10/22.
 */

process.on('uncaughtException', function (err) {
    console.error(err);
});

process.env.TZ = 'Asia/Shanghai';

const wxAppId = '';
const wxSecret = '';
const wxToken = 'Martin201710232344';
const crypto = require('crypto');
const _ = require('lodash');
const MARResponseModel = require('./express/mar_response_model');
const MARUtil = require('./lib/util');

const express = require('express');
const app = express();
// const OAuth = require('wechat-oauth');
// var client = new OAuth(wxAppId, wxSecret);
const bodyParser = require('body-parser');
// app.use(bodyParser());
// parse application/json
app.use(bodyParser.json({limit: '50mb'}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit:'50mb',extended: false }));
// app.use(express.static(__dirname));
app.use(express.static(__dirname + '/web'));


const WXPackage = require('../src/weixindev/index').WXPackage;
const refreshWXAccessToken = WXPackage.refreshWXAccessToken;
// refreshWXAccessToken();

app.get('/weixin', WXPackage.validateToken);

app.post('/weixin', WXPackage.getMessageFromGongZhongHao);

app.get('/testRender', function (req, res, next) {
   res.render('./testweb.html');
});

/*网易特殊url处理
 * url:
 * method:   POST GET
 * */
const request = require('superagent');
app.post('/api/core/delegation/wy/special', function (req, res, next) {
    let result = new MARResponseModel();
    let params = req.body;
    if (!MARUtil.verifyParams(params, ['url']))
    {
        result.header.errCode = 500;
        result.header.errMsg = '参数错误';
        res.end(result.toResponseJSON());
        return;
    }

    if (params['method'] === 'POST')
    {
        res.json(result.toResponseJSON());
    }
    else
    {
        let url = params['url'];
        request.get(url)
            .end(function (err, response) {
                if (err)
                {
                    result.header.errCode = 1;
                    result.header.errMsg = '' + err;
                }
                else
                {
                    result.body = response.text;
                    // console.log('>>>>>>>> ' + response.text);
                }
                res.json(result.toResponseJSON());
            });
    }
});

// test  ------------------------------

app.get('/test/zidong',  function (req, res, next) {
    console.log(req.ip);
    res.end('hello , this is Martin');
});

app.all('/testssr',  function (req, res, next) {
  // console.log(req);
  console.log('>>>> test ssr');
  console.log(req.body);
  // console.log(req.query);
  res.end('hello , this is Martin');
});


// test ________________________________

/* /api/core/* 接口验证， 数字签名验证  */
const mar_express_api_core_validate = require('./express/api_validate');
mar_express_api_core_validate(app);

/* 网易新 */

/* 接口服务 */
const mxr_express_server = require('./express/mar_express_server');
mxr_express_server(app);

/* 梦想人加解密服务 */
const mxr_express_mxr_encryption = require('./express/mar_express_mxrencryption');
mxr_express_mxr_encryption(app);

/* 网易信接口服务 */
const mxr_express_server_wangyixin = require('./express/mar_express_server_wangyixin');
mxr_express_server_wangyixin(app);


app.all('/maxiaoding', function (req, res, next) {
    res.header('content-type', 'application/json;charset=utf-8');
    res.end('程序员正在夜以继日的设计中...');
});

app.get('/blog', function (req, res, next) {
    res.redirect('http://liulong.site:2368');
});

// 网易信进行校验
app.post('/wangyixinverify', function (req, res, next) {
    res.json({});
});

app.get('/test', function (req, res, next) {
  res.json({test: 'haha'});
});

var multer  = require('multer')
var upload = multer({ dest: 'crashCollection/' })

app.all('/election/postCrashReport', upload.any(), function (req, res, next) {
  console.log(req);
  console.log(req.body);
  console.log(req.params);
  console.log(req.query);
  res.json({})
});

const URL = require('url').URL

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const httpServer = http.createServer(app);

httpServer.listen(80, function() {
    console.log('HTTP Server is running on: http://localhost:%s', 80);
});


const ExpressUseCredentials = false;
if (ExpressUseCredentials) {
    const privateKey  = fs.readFileSync(path.resolve('./server/cer/maxiaoding.key'), 'utf8');
    const certificate = fs.readFileSync(path.resolve('./server/cer/maxiaoding.pem'), 'utf8');
    const credentials = {key: privateKey, cert: certificate};
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(443, function() {
        console.log('HTTPS Server is running on: https://localhost:%s', 443);
    });
}

// let server = app.listen(3000, function () {
//     const host = server.address().address;
//     const port = server.address().port;
//     console.log('Example app listening at http://%s:%s', host, port);
// });

require('./setupsocket')();

// 打开钉钉Schedule
require('../src/mxr/schedule/dingdingschedule')();
