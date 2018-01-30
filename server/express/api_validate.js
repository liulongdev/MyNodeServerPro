/**
 * Created by Martin on 2017/12/26.
 */

const _ = require('lodash');
const crypto = require('crypto');
const models = require('../models');
const MARUtil = require('../lib/util/index');
const dbOp = require('../data/db');
const MARResponseModel = require('../express/mar_response_model');
/*  ------------------------------------------------------------------------
*       验证数字签名
* */
function mar_checkAPIRequest(req) {
    console.log('>>>> 验证数字签名');
    // const reqMethod = _(req.method).toUpper();
    // let params = req.body;
    // if (reqMethod === 'GET' || reqMethod === 'HEAD' || reqMethod === 'DELETE' )
    //     params = req.query;
    // let params = MARUtil.reqParamJson(req);

    let params = MARUtil.reqHeaderSignatureJSON(req)

    if (mar_validateAPIParamKey(params))
    {
        const currentTimeTamp = _(_.now() / 1000).toInteger();
        const callTimeTamp = _(params['timeStamp']).toInteger();
        // 时间戳要在12小时内
        if (Math.abs(currentTimeTamp - callTimeTamp) < 86400) {
            let originalSignatureStr = 'appVersion' + params['appVersion']
                + 'deviceType' + params['deviceType']
                + 'deviceUUID' + params['deviceUUID']
                + 'machineModel' + params['machineModel']
                + 'machineModelName' + params['machineModelName']
                + 'osVersion' + params['osVersion']
                + 'timeStamp' + params['timeStamp']
                + 'userId' + params['userId']
            ;
            const destinationStr = mar_hmacSha256(originalSignatureStr);
            return destinationStr === params['signature'];
        }
    }
    return false;
}

function mar_validateAPIParamKey(params) {
    // console.log(params);
    let needKeys = ['appVersion', 'deviceType', 'deviceUUID', 'machineModelName', 'timeStamp', 'signature', 'userId'];
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


function mar_saveOperationLog(req) {
    console.log('>>>> 保存操作url');
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
                // console.log(doc);
            }
        }
    });
}
/*      验证数字签名
 *    ------------------------------------------------------------------------
 * */


/*  ------------------------------------------------------------------------
 *      验证登录状态
 * */

function mar_validate_login_status(req, res, next) {
    next();
    return;
    console.log('>>>> 验证登录状态');
    let result = new MARResponseModel();
    let paramJSON = MARUtil.reqHeaderSignatureJSON(req); // MARUtil.reqParamJson(req);

    if (paramJSON['userId'] && paramJSON['userId'].length > 0)
    {
        dbOp.user.getUserLoginActiveWithUserId(paramJSON['userId'], function (err, loginActiveModel) {
            if (err)
            {
                result.header.errorCode = 1;
                result.header.errMsg = '登录异常，请重新登录';
                res.json(result.toResponseJSON());
            }
            else {
                if (loginActiveModel)
                {
                    if (loginActiveModel.deviceUUID == paramJSON['userId'])
                    {
                        next();
                    }
                    else
                    {
                        /* 被抢登了 */
                        result.header.errCode = 10000000001;
                        result.body = loginActiveModel;
                        res.json(result.toResponseJSON());
                    }
                }
                else
                {
                    /* 登录状态失效了 */
                    result.header.errCode = 10000000002;
                    result.body = loginActiveModel;
                    res.json(result.toResponseJSON());
                }
            }
        });
    }
    else
    {
        next();
    }
}

/*      验证登录状态
 *    ------------------------------------------------------------------------
 * */


function mar_express_api_core_validate(app) {
    /*
     * 进行接口验证
     * */
    app.use('/api/core/*', function (req, res, next) {
        if (mar_checkAPIRequest(req))
        {
            mar_saveOperationLog(req);
            mar_validate_login_status(req, res, next);
            // next();
            // res.json({result:'success'});
            return;
        }
        console.error(req.originalUrl + ' invalid, didn\'t pass the verification');
        res.sendStatus(500);

    });
}

module.exports = mar_express_api_core_validate;