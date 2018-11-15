/**
 * Created by Martin on 2017/12/26.
 */

const crypto = require('crypto');
const uuidV1 = require('uuid/v1');
const mongoose = require('mongoose');
const _ = require('lodash')

let MARUtil = {

    /*
    *
    * */
    // const uuid = crypto.randomBytes(12).toString('hex');
    // let obid = require('mongoose').Types.ObjectId(uuid);
    // return obid;
    // 用法： MARUtil.generateMongooseUUID()
    generateMongooseUUID : function () { return mongoose.Types.ObjectId(); },

    generateUUID : function () { return uuidV1(); },

    /* 根据网络请求获取请求的JSON参数 用法： MARUtil.reqParamJson(req) */
    reqParamJson: reqParamJson,

    /*判断params的属性集合是否包含keyArray里面所有值 用法： MARUtil.verifyParams(params, keyArray)*/
    verifyParams: verifyParams,
    /* 获取数字签名JSON */
    reqHeaderSignatureJSON: reqHeaderSignatureJSON,
    /*判断手机号是否符合格式  用法： MARUtil.checkPhone(phone)*/
    checkPhone : checkPhone,

    mxrEncoder: mxrEncoder,

    mxrDecoder: mxrDecoder,
};

function verifyParams(params, keyArray) {
    for (let index in keyArray)
    {
        if (!params.hasOwnProperty(keyArray[index]))
        {
            return false;
        }
    }
    return true;
}

function checkPhone(phone) {
    return (/^1[34578]\d{9}$/.test(phone));
}

function reqParamJson(req) {
    const reqMethod = _(req.method).toUpper();
    let params = req.body;
    if (reqMethod === 'GET' || reqMethod === 'HEAD' || reqMethod === 'DELETE' )
        params = req.query;
    return params;
}

function reqHeaderSignatureJSON(req) {
    let headerSignatureJSON = undefined;
    try
    {
        const headerJSON = req.headers;
        const signatureString = headerJSON['mar-signature'];
        headerSignatureJSON = JSON.parse(signatureString);

    }
    catch  (err)
    {
        console.log('parse signature json error : ' + err);
    }
    finally
    {
        return headerSignatureJSON;
    }
}

function mxrEncoder(str) {
    const PACKET_HEADER_SIZE = 5;
    if (typeof str === "object")
        str = JSON.stringify(str);
    let strBuf = new Buffer(str, 'utf-8');
    const strBufLength = strBuf.length;
    const random = Math.ceil(Math.random()*127);
    let chunk = [];
    for (let bufIndex = 0; bufIndex < strBufLength; bufIndex ++)
    {
        strBuf[bufIndex] = (strBuf[bufIndex] + (bufIndex ^ random)) ^ (random ^ (strBufLength - bufIndex));
    }

    let myBuffer = new Buffer(PACKET_HEADER_SIZE);
    myBuffer[0] = random;
    myBuffer[1] = PACKET_HEADER_SIZE + strBufLength;

    let newBuffer = Buffer.concat([myBuffer, strBuf], PACKET_HEADER_SIZE + strBuf.length);
    return newBuffer.toString('base64', 0, PACKET_HEADER_SIZE + strBufLength);
}

function mxrDecoder(str) {
    const PACKET_HEADER_SIZE = 5;
    if (typeof str === "object")
        str = JSON.stringify(str);
    let buffer = new Buffer(str, 'base64');
    const bufferLength = buffer.length;
    if (bufferLength <= PACKET_HEADER_SIZE)
        return undefined;

    const random = buffer[0];

    const size = bufferLength - PACKET_HEADER_SIZE;
    let retBuf = new Buffer(size);
    for (let bufIndex = 0; bufIndex < size; bufIndex++)
    {
        retBuf[bufIndex] = (buffer[PACKET_HEADER_SIZE + bufIndex] ^ (random ^ (size - bufIndex))) - (bufIndex ^ random);
    }

    return retBuf.toString();
}


module.exports = MARUtil;
