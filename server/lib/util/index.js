/**
 * Created by Martin on 2017/12/26.
 */

const crypto = require('crypto');
const uuidV1 = require('uuid/v1');
const mongoose = require('mongoose');

let MARUtil = {

    /*
    *
    * */
    // const uuid = crypto.randomBytes(12).toString('hex');
    // let obid = require('mongoose').Types.ObjectId(uuid);
    // return obid;
    generateMongooseUUID : function () { return mongoose.Types.ObjectId(); },

    generateUUID : function () { return uuidV1(); },

    /*判断params的属性集合是否包含keyArray里面所有值*/
    verifyParams: verifyParams,

    /*判断手机号是否符合格式*/
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


module.exports = MARUtil;
