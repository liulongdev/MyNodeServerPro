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

const express = require('express');
const app = express();
// const OAuth = require('wechat-oauth');
// var client = new OAuth(wxAppId, wxSecret);
const bodyParser = require('body-parser');
app.use(bodyParser());
app.use(express.static(__dirname));

const WXPackage = require('../src/weixindev/index').WXPackage;
const refreshWXAccessToken = WXPackage.refreshWXAccessToken;
// refreshWXAccessToken();

app.get('/weixin', WXPackage.validateToken);

app.post('/weixin', WXPackage.getMessageFromGongZhongHao);

app.get('/*', function (req, res, next) {
    res.end('server building ...');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

let server = app.listen(80, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});

