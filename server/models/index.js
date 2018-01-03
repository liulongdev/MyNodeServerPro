/**
 * Created by Martin on 2017/11/3.
 */

const mongoose = require('mongoose');
const schemaTables = require('../data/schema/schema');
const MXRResponseModel = require('./mxr_response_model');
const conn = mongoose.createConnection('mongodb://martin:martin2015@liulong.site/mardatabase', {useMongoClient: true, promiseLibrary: require('bluebird')});

module.exports = {
    mongooseModelTable:{
        MAROperationLogModel : conn.model('mar_operation_log_model', schemaTables.mar_operation_log_table),
        MARUserModel : conn.model('mar_user_model', schemaTables.mar_user_table),
        MARThirdPlatFormUserModel : conn.model('mar_third_platform_user_model', schemaTables.mar_third_platform_user_table),
        MARLoginActiveModel : conn.model('mar_login_active_model', schemaTables.mar_login_active_table),

        MARTestModel: conn.model('mar_test_model', schemaTables.mar_test_table),

    },
    MXRResponseModel: MXRResponseModel,
    buildModel : function (tableName, schema) {
        return conn.model(tableName, schema);
    }
};