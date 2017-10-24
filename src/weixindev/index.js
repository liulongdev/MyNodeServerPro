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
const builderXML = new xml2js.Builder({cdata:true});


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
                            .end(function (err, response) {
                                console.log('5. step >>>>>>>');
                                console.log('tuling >>>>>>' + response);
                                if (err)
                                {
                                    res.end('error');
                                    return;
                                }
                                console.log('6. step >>>>>>>');
                                let responseJson = JSON.parse(response.text);
                                let replyContent = null;
                                if (responseJson.code == 100000)
                                {
                                    console.log('7. step >>>>>>>');
                                    replyContent = responseJson.text;
                                    let temp = result.xml.FromUserName;
                                    result.xml.ToUserName = result.xml.FromUserName;
                                    result.xml.FromUserName = temp;
                                    result.xml.Content = replyContent + '';

                                    let xmlStr = builderXML.buildObject(result);
                                    let xmlStrArray = xmlStr.split('?>');
                                    let replyXML = (Array.isArray(xmlStrArray) && xmlStrArray.length > 1) ? xmlStrArray[1] : xmlStrArray[0];
                                    console.log(replyXML);
                                    res.end(replyXML);
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
}

exports.validateToken = validateToken;
exports.getMessageFromGongZhongHao = getMessageFromGongZhongHao;