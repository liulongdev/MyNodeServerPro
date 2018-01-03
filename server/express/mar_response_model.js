/**
 * Created by Martin on 2017/12/26.
 */

const _ = require('lodash');

class MARResponseModel
{
    constructor() {
        this.header = new MARResponseHeaderModel();
        this.body = '';
    }


    toResponseJSON() {
        let responseJSON = {header:{errCode: this.header.errCode, errMsg: this.header.errMsg}, body:this.body};
        return responseJSON;
    }

    toResponseString() {
        return JSON.stringify(this.toResponseJSON());
    }
}

class MARResponseHeaderModel {
    constructor() {
        this.errCode = 0;
        this.errMsg = '';
    }
}


module.exports = MARResponseModel;