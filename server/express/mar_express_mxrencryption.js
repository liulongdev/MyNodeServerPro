
const MARUtil = require('../lib/util/index');
const AllUrl = require('./all_url');
const MARResponseModel = require('./mar_response_model');


function mxr_express_mxr_encryption(app){

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
}


module.exports = mxr_express_mxr_encryption;