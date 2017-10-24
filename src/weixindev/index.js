/**
 * Created by Martin on 2017/10/24.
 */

const wxToken = 'Martin201710232344';
const wxAppId = '';
const wxSecret = '';

const crypto = require('crypto');
const request = require('superagent');
const parseXMLString = require('xml2js').parseString;

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
        });

        const ToUserName = getXMLNodeValue('ToUserName',_da);
        const FromUserName = getXMLNodeValue('FromUserName',_da);
        const CreateTime = getXMLNodeValue('CreateTime',_da);
        const MsgType = getXMLNodeValue('MsgType',_da);
        const Content = getXMLNodeValue('Content',_da);
        const MsgId = getXMLNodeValue('MsgId',_da);
        console.log(ToUserName);
        console.log(FromUserName);
        console.log(CreateTime);
        console.log(MsgType);
        console.log(Content);
        console.log(MsgId);
        const xml = '<xml><ToUserName>'+FromUserName+'</ToUserName><FromUserName>'+ToUserName+'</FromUserName><CreateTime>'+CreateTime+'</CreateTime><MsgType>'+MsgType+'</MsgType><Content>'+Content+'</Content></xml>';



        // request.post('http://www.tuling123.com/openapi/api')
        //     .send({key: 'fe1a7ebad1e4d5ce85454b2c2f858a90',
        //         info: '',
        //         userid: ''})
        //     .end(function (err, res) {
        //        // do somthing
        //
        //     });

        res.send(xml);
    });

}

var xml = "<root>Hello mxl2js!</root>";
parseXMLString(xml, function (err, result) {
    console.dir(result);
})

function getXMLNodeValue(node_name,xml){
    let tmp = xml.split("<"+node_name+">");
    let _tmp = tmp[1].split("</"+node_name+">");
    return _tmp[0];
}

exports.validateToken = validateToken;
exports.getMessageFromGongZhongHao = getMessageFromGongZhongHao;