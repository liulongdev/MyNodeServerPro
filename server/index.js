/**
 * Created by Martin on 2017/10/22.
 */

process.on('uncaughtException', function (err) {
    console.error(err);
});

const wxAppId = '';
const wxSecret = '';

const wxToken = 'Martin201710232344';
const crypto = require('crypto');
const _ = require('lodash');

const express = require('express');
const app = express();
// const OAuth = require('wechat-oauth');
// var client = new OAuth(wxAppId, wxSecret);
const bodyParser = require('body-parser');
app.use(bodyParser());
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

/* /api/core/* 接口验证， 数字签名验证 */
const mar_express_api_core_validate = require('./express/api_validate');
mar_express_api_core_validate(app);

/* 接口服务 */
const mxr_express_server = require('./express/mar_express_server');
mxr_express_server(app);


app.all('/maxiaoding', function (req, res, next) {
    res.header('content-type', 'application/json;charset=utf-8');
    res.end('程序员正在夜以继日的设计中...');
});

app.get('/blog', function (req, res, next) {
    res.redirect('http://liulong.site:2368');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

let server = app.listen(3000, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});


// const models = require('./models');
//
//
//
// const Schema = require('mongoose').Schema;
// const ObjectId = Schema.Types.ObjectId;
// const now = new Date();
// let testJson = {
//             testId:generateMonggooseUUID(),
//             name: "Martin222",
//             createTime: now,
//             updateTime: now,
//             exAdd: "Hello, I am ex info"};
//
// new models.mongooseModelTable.MARTestModel(testJson).save(function (err) {
//     if (err)
//     {
//         console.log(err);
//     }
//     else
//     {
//         console.log("add success");
//     }}
// );



// let hmac = crypto.createHmac('sha256', '123456789');
// hmac.update('Martin Hello, This is important');
// let str = hmac.digest('hex');
// console.log(str);
// console.log(_(_.now() / 1000).toInteger());

const request = require('superagent');
function testQueryTrain() {
    console.log('>>>>> test ');
    let url = 'https://kyfw.12306.cn/otn/leftTicket/query?leftTicketDTO.train_date=2017-12-18&leftTicketDTO.from_station=SZH&leftTicketDTO.to_station=SHH&purpose_codes=ADULT';
    let queryParams = {
        'leftTicketDTO.train_date': '2018-01-04',
        'leftTicketDTO.from_station': 'SZH',
        'leftTicketDTO.to_station': 'SHH',
        'purpose_codes': 'ADULT'
    };
    let wxGetAccessTokenBaseUrl = 'https://kyfw.12306.cn/otn/leftTicket/queryA';
    request.get(wxGetAccessTokenBaseUrl)
        .query(queryParams)
        .end(function (err, res) {
            if (err)
            {
                console.log(err);
                reject(err +'');
            }
            else
            {

                console.log(res.text);
            }
            // console.log(res);
            // console.log('>>>>');
            // console.log(res.body);
        });
}

// setInterval(testQueryTrain, 1000);

// testQueryTrain();
// /Users/Martin/Dev/huochedianbao.xls

