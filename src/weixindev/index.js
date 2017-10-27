/**
 * Created by Martin on 2017/10/24.
 */

const wxOption = require('./config').wxOption;
const wxToken = wxOption.token;
const wxAppId = wxOption.appId;
const wxSecret = wxOption.secret;

const crypto = require('crypto');
const request = require('superagent');
const tuLingRobotAppKey = 'fe1a7ebad1e4d5ce85454b2c2f858a90';
const xml2js = require('xml2js');
const parseXMLString = xml2js.parseString;
const builderXML = new xml2js.Builder({cdata:true});
const fs = require('fs');

function validateToken(req, res) {
    const signature = req.query.signature;
    const timestamp = req.query.timestamp;
    const nonce = req.query.nonce;
    const echostr = req.query.echostr;

    /*  加密/校验流程如下： */
    //1. 将token、timestamp、nonce三个参数进行字典序排序
    let array = new Array(wxToken,timestamp,nonce);
    array.sort();
    let str = array.toString().replace(/,/g,"");

    //2. 将三个参数字符串拼接成一个字符串进行sha1加密
    let sha1Code = crypto.createHash("sha1");
    let code = sha1Code.update(str,'utf-8').digest("hex");

    //3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if(code===signature){
        res.send(echostr)
    }else{
        res.send("error");
    }
}

function getMessageFromGongZhongHao(req, res) {
    let _da;
    req.on("data",function(data){
        /*微信服务器传过来的是xml格式的，是buffer类型，因为js本身只有字符串数据类型，所以需要通过toString把xml转换为字符串*/
        _da = data.toString("utf-8");

    });
    req.on("end",function(){
        parseXMLString(_da, function (err, result) {
            if (err)
            {
                res.end('error');
                return;
            }

            let isReturnError = false;
            if (result.xml && result.xml.MsgType)
            {
                handleWeiXinMessage(res, result);
            }
            else
            {
                res.end('error');
            }
        });
    });
}

function handleWeiXinMessage(res, result) {
        const msgType = result.xml.MsgType[0];
        const userId = result.xml.FromUserName[0];
        if (msgType == 'text')
        {
            const content = result.xml.Content[0];
            request.post('http://www.tuling123.com/openapi/api')
                .send({key: tuLingRobotAppKey,
                    info: content + '',
                    userid: userId + ''})
                .end(function (err, response) {
                    if (err)
                    {
                        res.end('error');
                        return;
                    }
                    let responseJson = JSON.parse(response.text);
                    let replyContent = null;
                    // if (responseJson.code == 100000)
                    // {
                        replyContent = responseJson.text;
                        let temp = result.xml.ToUserName;
                        result.xml.ToUserName = result.xml.FromUserName;
                        result.xml.FromUserName = temp;
                        result.xml.Content = replyContent + '';

                        let xmlStr = builderXML.buildObject(result);
                        res.end(xmlStr);
                    // }
                });
        }
        else{
            let temp = result.xml.ToUserName;
            result.xml.ToUserName = result.xml.FromUserName;
            result.xml.FromUserName = temp;
            result.xml.msgType = 'text';
            result.xml.Content = '请发文本哦';

            let xmlStr = builderXML.buildObject(result);
            res.end(xmlStr);
        }
}

//token，因为token是存在文件里的所以这里进行文件读取得到token
const getLocalWXAccessToken = function () {
    let accessToken = fs.readFileSync('./token').toString();
    console.log('accessToken : ' + accessToken);
    return accessToken;
};

//保存与更新
const saveToken = function () {
    getAccessTokenFromWXServer().then(res => {
        let token = res['access_token'];
        fs.writeFile('./token', token, function (err) {
            if (err)
            {
                console.error('save WX access token error : ' + err);
            }
            else
            {
                console.log('save WX access token : ' + token);
            }
        });
    }).catch((err) => {
        console.error('get weixin access token error : ' + err);
    });
};

const refreshWXAccessToken = function () {
    saveToken();
    setInterval(function () {
        saveToken();
    }, 7000*1000);
};

const getAccessTokenFromWXServer = function () {
    let queryParams = {
        'grant_type': 'client_credential',
        'appid': wxAppId,
        'secret': wxSecret
    };
    let wxGetAccessTokenBaseUrl = 'https://api.weixin.qq.com/cgi-bin/token';
    return new Promise((resolve, reject) => {
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
                    if (res.body['errmsg'])
                    {
                        reject('happend error <errorCode :' +res.body['errcode'] + ' errMsg:' + res.body['errmsg'] + '>');
                    }
                    else
                        resolve(res.body);
                }
                // console.log(res);
                // console.log('>>>>');
                // console.log(res.body);
            });
    })
};


const createMenu = function () {
    let menus = wxOption.menus;
    let createMenuRul = 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=HTiPXzFWi0PlXoxM7ZmEzsidfAf8ypewrJ3qhGjLf4637KLYyDIpFzaTh5FBTp82ONuWtDwTHaGW-9Rl6ksX--_oP_Uy1_LMVWvxvmaRnKbr7BhdBvxV_a9iqBHstdGYDVRbAFAZRN';
    request.post(createMenuRul)
        .send(menus)
        .end(function (err, res) {
            if (err)
            {
                console.log(err);
            }
            console.log(res.body);
        })

};

// getAccessTokenFromWXServer();
// createMenu();
// getLocalWXAccessToken();

exports.WXPackage = {
    validateToken: validateToken,
    getMessageFromGongZhongHao: getMessageFromGongZhongHao,
    refreshWXAccessToken: refreshWXAccessToken,
};
