/**
 * Created by Martin on 2017/11/10.
 */
class MXRResponseModel
{
    constructor() {
        this.header = new MXRResponseHeaderModel();
        this.body = '';
        this.notCoder = 1;
        this.type = '';
    }

    isSuccess() {
        return this.header.errCode == 0;
    }

    toMXRString() {
        const json = {Header:{ErrCode:this.header.errCode, ErrMsg:this.header.errMsg}, Body: this.body, notCoder: this.notCoder, type: this.type};
        return JSON.stringify(json);
    }
}

class MXRResponseHeaderModel{
    constructor() {
        this.errCode = 0;
        this.errMsg = '';
    }

    setErrCode(errCode) {
        this.errCode = errCode;
    }
}

module.exports = MXRResponseModel;