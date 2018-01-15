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
const MARResponseModel = require('./express/mar_response_model');
const MARUtil = require('./lib/util');

const express = require('express');
const app = express();
// const OAuth = require('wechat-oauth');
// var client = new OAuth(wxAppId, wxSecret);
const bodyParser = require('body-parser');
// app.use(bodyParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
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

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const privateKey  = fs.readFileSync(path.resolve('./server/cer/maxiaoding.key'), 'utf8');
const certificate = fs.readFileSync(path.resolve('./server/cer/maxiaoding.pem'), 'utf8');
const credentials = {key: privateKey, cert: certificate};



const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(3000, function() {
    console.log('HTTP Server is running on: http://localhost:%s', 80);
});
httpsServer.listen(3001, function() {
    console.log('HTTPS Server is running on: https://localhost:%s', 443);
});

// let server = app.listen(3000, function () {
//     const host = server.address().address;
//     const port = server.address().port;
//     console.log('Example app listening at http://%s:%s', host, port);
// });


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
        'leftTicketDTO.train_date': '2018-01-06',
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


function  testWangyiXin() {
    let url = null;
    // 视频
    url = "https://c.m.163.com/recommend/getChanListNews?channel=T1457068979049&subtab=Video_Recom&passport=&devId=4q9wyqO%2BqQBTBHM8f1fMsbVhBeT2jN%2BpF2piB1fvCVBW8vGHludHKO1HgHn4Q%2BQf&version=31.0&spever=false&net=wifi&lat=CTVtEvU9h%2B%2Bh5zacKMVTrA%3D%3D&lon=9EoiG%2BcFCaYhcgFCoEmb2w%3D%3D&ts=1515782236&sign=0wajItdSjKo2ICaGivynYmo62uLj1wYkfOcODn7p%2BnB48ErR02zJ6/KXOnxX046I&encryption=1&canal=appstore&offset=0&size=10&fn=1";
    // url = "https://c.m.163.com/recommend/getChanListNews?channel=T1456112438822&passport=&devId=4q9wyqO%2BqQBTBHM8f1fMsbVhBeT2jN%2BpF2piB1fvCVBW8vGHludHKO1HgHn4Q%2BQf&version=31.0&spever=false&net=wifi&lat=h4oCMn4567dmFOuemqUYsw%3D%3D&lon=thiEhYUT/OmIwZnpr9nr1A%3D%3D&ts=1515226754&sign=HdjOz40v0FJZW3%2B298s1AUZtrCVm%2BmHAuGmN8nwcfD948ErR02zJ6/KXOnxX046I&encryption=1&canal=appstore&offset=0&size=10&fn=1";
    // url = "https://c.m.163.com/recommend/getChanListNews?channel=T1457068979049&subtab=Video_Beauty&passport=&devId=I9mEvOjEpr7x6qKZ0E/jqz%2BXNYccr98jb6FUP/c34MDLszEoKIcbpbZWUwpshTwP&version=31.0&spever=false&net=wifi&lat=Db%2By8mQzKvnL76zse8k%2BFw%3D%3D&lon=YUz/CebUbKsPIsBavk9JUg%3D%3D&ts=1515393095&sign=7eFT5nh9qzmonv%2BiOvKmqmk6ziKtcFHuolPv9o5qzst48ErR02zJ6/KXOnxX046I&encryption=1&canal=appstore&offset=0&size=10&fn=2";
    request.get(url)
        // .set('Host', 'c.m.163.com')
        // .set('Accept-Language', 'zh-Hans;q=1.0')
        // .set('Accept', '*/*')
        // .set('User-Agent', 'NewsApp/31.0 iOS/10.3.3 (iPhone5,2)')
        // .set('User-L', '9GPoH3YTpi08QvHb/LQJH8wQis+pydvCwlKfLx+q3VlFLvuYyQq3vxyayVLVXEnh')
        // .set('Accept-Encoding', 'gzip;q=1.0, compress;q=0.5')
        // .set('Connection', 'keep-alive')
        // .set('User-D', 'I9mEvOjEpr7x6qKZ0E/jqz+XNYccr98jb6FUP/c34MDLszEoKIcbpbZWUwpshTwP')
        // .set('User-U', '')
        // .set('X-Trace-Id', '1515380141_254548960_3361A073-8DA8-4133-AD36-027654329A12')
        // // .set('User-C', '6KeG6aKROjrnvo7lpbM=')
        // .set('User-N', 'yyXgmdmvoQtiN87jo3oYSdCd2giod6saU+xnB6AIucmi/Ns2KL3/3QwlaZ/+bual')
        .end(function (err, res) {
            if (err)
            {
                console.log(err);
                reject(err +'');
            }
            else
            {
                console.log(res);
                console.log(res.text);
            }
        });
}

// testWangyiXin();

// setInterval(testQueryTrain, 1000);

// testQueryTrain();
// /Users/Martin/Dev/huochedianbao.xls

