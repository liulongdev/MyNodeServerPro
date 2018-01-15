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

    /*判断手机号是否符合格式  用法： MARUtil.checkPhone(phone)*/
    checkPhone : checkPhone,
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


module.exports = MARUtil;
