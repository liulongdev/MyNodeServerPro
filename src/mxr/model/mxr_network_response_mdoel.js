
const _ = require('lodash');
const Util = require('../../../server/lib/util');
class MXRResponseModel
{
    constructor() {
        this.header = new MXRResponseHeaderModel();
        this.body = '';
        this.originalBody = '';
    }

    static builderWithResponse(json) {
        let responseModel = new MXRResponseHeaderModel();
        if (typeof json === "object") {
            responseModel.header = MXRResponseHeaderModel.builderWithResponseHeader(json.Header);
            responseModel.body = Util.mxrDecoder(json.Body);
            responseModel.originalBody = json.Body;
        } else if (typeof json === "string") {
            let myJson = JSON.parse(json);
            responseModel.header = MXRResponseHeaderModel.builderWithResponseHeader(myJson.Header);
            responseModel.body = Util.mxrDecoder(myJson.Body);
            responseModel.originalBody = myJson.Body;
        } else {
            responseModel.header = new MXRResponseHeaderModel();
            responseModel.body = '';
            responseModel.originalBody = '';
        }
        return responseModel;
    }
    
    // constructor(json) {
    //     if (typeof json === "object") {
    //         this.header = new MXRResponseHeaderModel(json.Header);
    //         this.body = json.Body;
    //     } else if (typeof json === "string") {
    //         let myJson = JSON.parse(json);
    //         this.header = new MXRResponseHeaderModel(myJson.Header);
    //         this.body = myJson.Body;
    //     } else {
    //         this.header = new MXRResponseHeaderModel();
    //         this.body = '';
    //     }
    // }


    toResponseJSON() {
        let responseJSON = {header:{errCode: this.header.errCode, errMsg: this.header.errMsg}, body:this.body};
        return responseJSON;
    }

    toResponseString() {
        return JSON.stringify(this.toResponseJSON());
    }
}

class MXRResponseHeaderModel {
    constructor() {
        this.errCode = 0;
        this.errMsg = '';
    }

    static builderWithResponseHeader(json) {
        let responseHeaderModel = new MXRResponseHeaderModel();
        if (typeof json === "object") {
            responseHeaderModel.errCode = json.ErrCode;
            responseHeaderModel.errMsg = json.ErrMsg;
        } else if (typeof json === "string") {
            let myJson = JSON.parse(json);
            responseHeaderModel.errCode = myJson.ErrCode;
            responseHeaderModel.errMsg = myJson.ErrMsg;
        } else {
            responseHeaderModel.ErrorCode = 0;
            responseHeaderModel.errMsg = '';
        }
        return responseHeaderModel;
    }

    // constructor(json) {
    //     if (typeof json === "object") {
    //         this.errCode = json.ErrCode;
    //         this.errMsg = json.ErrMsg;
    //     } else if (typeof json === "string") {
    //         let myJson = JSON.parse(json);
    //         this.errCode = myJson.ErrCode;
    //         this.errMsg = myJson.ErrMsg;
    //     } else {
    //         this.ErrorCode = 0;
    //         this.errMsg = '';
    //     }
    // }
}


module.exports = MXRResponseModel;