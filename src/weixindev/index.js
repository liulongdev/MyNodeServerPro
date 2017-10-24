/**
 * Created by Martin on 2017/10/24.
 */

const wxToken = 'Martin201710232344';
const wxAppId = '';
const wxSecret = '';

const crypto = require('crypto');
const request = require('superagent');
const tuLingRobotAppKey = 'fe1a7ebad1e4d5ce85454b2c2f858a90';
const xml2js = require('xml2js');
const parseXMLString = xml2js.parseString;

function validateToken(req, res) {
    console.log('>>>> validate token ...');
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
        //console.log("end");
        parseXMLString(_da, function (err, result) {
            console.log('>>>> result : >>>');
            console.log(result);
            if (err)
            {
                res.end('error');
                return;
            }
            let isReturnError = false;
            console.log('1. step >>>>>>>');
            if (result.xml && result.xml.MsgType)
            {
                console.log('2. step >>>>>>>');
                if (Array.isArray(result.xml.MsgType) && result.xml.MsgType.length > 0)
                {
                    console.log('3. step >>>>>>>');
                    const msgType = result.xml.MsgType[0];
                    const userId = result.xml.FromUserName[0];
                    if (msgType == 'text')
                    {
                        console.log('4. step >>>>>>>');
                        const content = result.xml.Content[0];
                        request.post('http://www.tuling123.com/openapi/api')
                            .send({key: tuLingRobotAppKey,
                                info: content + '',
                                userid: userId + ''})
                            .end(function (err, res) {
                                console.log('5. step >>>>>>>');
                                console.log('tuling >>>>>>' + res);
                                if (err)
                                {
                                    res.end('error');
                                    return;
                                }
                                console.log('6. step >>>>>>>');
                                let responseJson = JSON.parse(res.text);
                                let replyContent = null;
                                if (responseJson.code == 100000)
                                {
                                    console.log('7. step >>>>>>>');
                                    replyContent = responseJson.text;
                                    let temp = result.xml.FromUserName;
                                    result.xml.ToUserName = result.xml.FromUserName;
                                    result.xml.FromUserName = temp;

                                    parseXMLString(result, function (error, xmlString) {
                                        console.log('8. step >>>>>>>');
                                        if (error)
                                        {
                                            res.end('error');
                                            return;
                                        }
                                        console.log('9. step >>>>>>>');
                                        res.end(xmlString);
                                    });
                                };
                            });
                    }
                }
                else
                {
                    isReturnError = true;
                }
            }
            else
            {
                isReturnError = true;
            }

            if (isReturnError)
            {
                res.end('error');
            }

        });
    });
};


request.post('http://www.tuling123.com/openapi/api')
    .send({key: 'fe1a7ebad1e4d5ce85454b2c2f858a90',
        info: '今天天气很好哦',
        userid: 'liulongdev'})
    .end(function (err, res) {
        console.log('tuling >>>>>>' + res);
        console.log(res.text);
        let responseText = res.text;

    });

function getXMLNodeValue(node_name,xml){
    let tmp = xml.split("<"+node_name+">");
    let _tmp = tmp[1].split("</"+node_name+">");
    return _tmp[0];
}

exports.validateToken = validateToken;
exports.getMessageFromGongZhongHao = getMessageFromGongZhongHao;