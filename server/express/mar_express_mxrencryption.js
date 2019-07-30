
const MARUtil = require('../lib/util/index');
const AllUrl = require('./all_url');
const MARResponseModel = require('./mar_response_model');
const request = require('superagent');
const MXRResponseModel = require('../../src/mxr/model/mxr_network_response_mdoel');
const Models = require('../models');
const _ = require('lodash');

function mxr_express_mxr_encryption(app){

    /* 梦想人加密 */
    app.post(AllUrl.SERVER_URL_MXREncoder, function (req, res, next) {
        const result = new MARResponseModel();
        let params = req.body;
        if (!MARUtil.verifyParams(params, ['content']))
        {
            result.header.errCode = 500;
            result.header.errMsg = '请输入正确的内容';
            res.json(result.toResponseJSON());
            return;
        }

        result.body = MARUtil.mxrEncoder(params['content']);
        res.json(result.toResponseJSON());
    });

    /* 梦想人解密 */
    app.post(AllUrl.SERVER_URL_MXRDecoder, function (req, res, next) {
        const result = new MARResponseModel();
        let params = req.body;
        if (!MARUtil.verifyParams(params, ['content']))
        {
            result.header.errCode = 500;
            result.header.errMsg = '请输入正确的内容';
            res.json(result.toResponseJSON());
            return;
        }

        result.body = MARUtil.mxrDecoder(params['content']);
        res.json(result.toResponseJSON());
    });

    /* 梦想人接口调试 */
    app.all(AllUrl.SERVER_URL_MXRTestUrl, function (req, response, next) {

        const method = ('' + req.method).toUpperCase();
        // console.log('method : ', method);
        if (method === 'POST')
        {
            const result = new MARResponseModel();
            let params = req.body.params;
            if (!MARUtil.verifyParams(params, ['mxrUrl'])) {
                // res.status = 500;
                result.header.errCode = 500;
                result.header.errMsg = '测试格式错误';
                response.json(result.toResponseJSON());
                return;
            }
            let mxrHeader = req.body.headers['mxr-key'];
            if (mxrHeader !== undefined)
            {
                mxrHeader = MARUtil.mxrEncoder(mxrHeader);
            }
            let url = params['mxrUrl'];
            let encoderParams = MARUtil.mxrEncoder(JSON.stringify(params));
            request.post(url)
                .send(encoderParams)
                .set('mxr-key', mxrHeader)
                .end((err, res) => {
                    // response.status(res.status);
                    if (err) {
                        result.header.errCode =1;
                        result.header.errMsg = '' + err;
                        response.json(result.toResponseJSON());
                    }
                    else if (res.status !== 200) {
                        result.header.errCode = res.status;
                        result.header.errMsg = '' + res.text;
                        response.json(result.toResponseJSON());
                    }
                    else{
                        // console.log(res.text);
                        let responseModel = MXRResponseModel.builderWithResponse(res.text);
                        response.json(responseModel.toResponseJSON());
                    }
                })
        }
        else
        {
            const result = new MARResponseModel();
            let params = req.query;
            if (!MARUtil.verifyParams(params, ['mxrUrl'])) {
                result.header.errCode = 500;
                result.header.errMsg = '测试格式错误';
                response.json(result.toResponseJSON());
                return;
            }
            let mxrHeader = req.headers['mxr-key'];
            if (mxrHeader !== undefined)
            {
                mxrHeader = MARUtil.mxrEncoder(mxrHeader);
            }
            let url = params['mxrUrl'];
            request.get(url)
                .set('mxr-key', mxrHeader)
                .query(params)
                .end((err, res) => {
                    // response.status(res.status);
                    if (err) {
                        result.header.errCode =1;
                        result.header.errMsg = '' + err;
                        response.json(result.toResponseJSON());
                    }
                    else if (res.status !== 200) {
                        result.header.errCode = res.status;
                        result.header.errMsg = '' + res.text;
                        response.json(result.toResponseJSON());
                    }
                    else{
                        let responseModel = MXRResponseModel.builderWithResponse(res.text);
                        response.json(responseModel.toResponseJSON());
                    }
                });
        }
    });

    /* 增加接口路由 */
    app.post(AllUrl.SERVER_URL_MXRNetworkTestAddApi, function (req, res, net) {
        const result = new MARResponseModel();

        let params = req.body.params;
        console.log(' post : ', params);
        if (!MARUtil.verifyParams(params, ['route'])) {
            // res.status = 500;
            result.header.errCode = 500;
            result.header.errMsg = '测试格式错误';
            res.json(result.toResponseJSON());
            return;
        }

        new Models.mongooseModelTable.MXRNetworkTestApiModel(params).save(function (err, doc) {
           if (err) {
               result.header.errCode = 1;
               result.header.errMsg = err + '';
               res.json(res.toResponseJSON());
           } else
           {
               res.body = doc;
               res.json(result.toResponseJSON());
           }
        });
    });

    /* 获取所有的接口路由 */
    app.get(AllUrl.SERVER_URL_MXRGetAllApi, function (req, res, net) {
        const result = new MARResponseModel();

        Models.mongooseModelTable.MXRNetworkTestApiModel.find({}, function (err, docs) {
            if (err) {
                result.header.errCode = 1;
                result.header.errMsg = err + '';
                res.json(result.toResponseJSON());
            }
            else
            {
                result.body = JSON.stringify(docs);
                res.json(result.toResponseJSON());
            }
        });
    });

    /*weex test*/
    app.all(AllUrl.SERVER_URL_MXRWeexUrl, function (req, response, next) {

        const method = ('' + req.method).toUpperCase();
        console.log('method : ', method);
        if (method === 'POST')
        {
            const result = new MARResponseModel();
            let params = req.body.params;
            if (!MARUtil.verifyParams(params, ['mxrUrl'])) {
                // res.status = 500;
                result.header.errCode = 500;
                result.header.errMsg = '测试格式错误';
                response.json(result.toResponseJSON());
                return;
            }
            let mxrHeader = req.body.headers['mxr-key'];
            if (mxrHeader !== undefined)
            {
                mxrHeader = MARUtil.mxrEncoder(mxrHeader);
            }
            let url = params['mxrUrl'];
            let encoderParams = MARUtil.mxrEncoder(JSON.stringify(params));
            request.post(url)
              .send(encoderParams)
              .set('mxr-key', mxrHeader)
              .end((err, res) => {
                  // response.status(res.status);
                  if (err) {
                      result.header.errCode =1;
                      result.header.errMsg = '' + err;
                      response.json(result.toJSON());
                  }
                  else if (res.status !== 200) {
                      result.header.errCode = res.status;
                      result.header.errMsg = '' + res.text;
                      response.json(result.toJSON());
                  }
                  else{
                      // console.log(res.text);
                      let responseModel = MXRResponseModel.builderWithResponse(res.text);
                      response.json(responseModel.toJSON());
                  }
              })
        }
        else
        {
            const result = new MARResponseModel();
            let params = req.query;
            if (!MARUtil.verifyParams(params, ['mxrUrl'])) {
                result.header.errCode = 500;
                result.header.errMsg = '测试格式错误';
                response.json(result.toResponseJSON());
                return;
            }
            console.log(">>> params : ", params);
            let mxrHeader = req.headers['mxr-key'];
            console.log('header : ', req.headers);
            if (mxrHeader !== undefined)
            {
                mxrHeader = MARUtil.mxrEncoder(mxrHeader);
            }
            let url = params['mxrUrl'];
            request.get(url)
              .set('mxr-key', mxrHeader)
              .query(params)
              .end((err, res) => {
                  // response.status(res.status);
                  if (err) {
                      result.header.errCode =1;
                      result.header.errMsg = '' + err;
                      response.json(result.toJSON());
                  }
                  else if (res.status !== 200) {
                      result.header.errCode = res.status;
                      result.header.errMsg = '' + res.text;
                      response.json(result.toJSON());
                  }
                  else{
                      let responseModel = MXRResponseModel.builderWithResponse(res.text);
                      response.json(responseModel.toJSON());
                  }
              });
        }
    });
}


module.exports = mxr_express_mxr_encryption;
