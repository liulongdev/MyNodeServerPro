/**
 * Created by Martin on 2017/12/26.
 */

const _ = require('lodash');
const crypto = require('crypto');
const models = require('../models');

function mar_checkAPIRequest(req) {
    const reqMethod = _(req.method).toUpper();
    let params = req.body;
    if (reqMethod === 'GET' || reqMethod === 'HEAD' || reqMethod === 'DELETE' )
        params = req.query;
    if (mar_validateAPIParamKey(params))
    {
        const currentTimeTamp = _(_.now() / 1000).toInteger();
        const callTimeTamp = _(params['timeStamp']).toInteger();
        // 时间戳要在一分钟之内
        if (Math.abs(currentTimeTamp - callTimeTamp) < 60) {
            let originalSignatureStr = 'appVersion' + params['appVersion']
                + 'deviceType' + params['deviceType']
                + 'deviceUUID' + params['deviceUUID']
                + 'machineModel' + params['machineModel']
                + 'machineModelName' + params['machineModelName']
                + 'osVersion' + params['osVersion']
                + 'timeStamp' + params['timeStamp']
                + 'currentUserId' + params['currentUserId']
            ;
            const destinationStr = mar_hmacSha256(originalSignatureStr);
            return destinationStr === params['signature'];
        }
    }
    return false;
}

function mar_validateAPIParamKey(params) {
    // console.log(params);
    let needKeys = ['appVersion', 'deviceType', 'deviceUUID', 'machineModelName', 'timeStamp', 'signature', 'currentUserId'];
    for (let key in needKeys) {
        if (!params.hasOwnProperty(needKeys[key]))
        {
            console.error('api error : lack the param whose key is ', needKeys[key]);
            return false;
        }
    }
    return true;
}

function mar_hmacSha256(originalStr) {
    const key = 'HelloMartin';
    let hmac = crypto.createHmac('sha256', key);
    hmac.update(originalStr);
    let destinationStr = hmac.digest('hex');
    return destinationStr;
}


function mar_express_api_core_validate(app) {
    /*
     * 进行接口验证
     * */
    app.use('/api/core/*', function (req, res, next) {
        if (mar_checkAPIRequest(req))
        {
            mar_saveOperationLog(req);
            next();
            // res.json({result:'success'});
            return;
        }
        console.error(req.originalUrl + ' invalid, didn\'t pass the verification');
        res.sendStatus(500);

    });
}

function mar_saveOperationLog(req) {
    const reqMethod = _(req.method).toUpper();
    let params = req.body;
    if (reqMethod === 'GET' || reqMethod === 'HEAD' || reqMethod === 'DELETE' )
        params = req.query;
    let opLogModel = new models.mongooseModelTable.MAROperationLogModel(params);
    opLogModel.operation = req.originalUrl;
    opLogModel.operationTime = new Date();
    opLogModel.save(function (err, doc, rowAffect) {
        if (err)
        {
            // console.log('add op log error: ' + err);
        }
        else
        {
            // console.log('add op log success');
            if (doc)
            {
                console.log(doc);
            }
        }
    });
}

module.exports = mar_express_api_core_validate;