/**
 * Created by Martin on 2017/11/3.
 */

const mongoose = require('mongoose');
const schemaTables = require('../data/schema/schema');
const MXRResponseModel = require('./mxr_response_model');
const conn = mongoose.createConnection('mongodb://martin:martin2015@39.106.7.121/mardatabase', {useMongoClient: true, promiseLibrary: require('bluebird')});

module.exports = {
    mongooseModelTable:{
        MAROperationLogModel : conn.model('mar_operation_log_model', schemaTables.mar_operation_log_table),
        MARUserModel : conn.model('mar_user_model', schemaTables.mar_user_table),
        MARThirdPlatFormUserModel : conn.model('mar_third_platform_user_model', schemaTables.mar_third_platform_user_table),
        MARLoginActiveModel : conn.model('mar_login_active_model', schemaTables.mar_login_active_table),
        MARWYNewRecordModel : conn.model('mar_wy_new_record_model', schemaTables.mar_wy_new_record_table),
        MARWYNewCollectionModel : conn.model('mar_wy_new_collection_model', schemaTables.mar_wy_new_collection_table),
        MARWYVideoNewRecordModel : conn.model('mar_wy_video_new_record_model', schemaTables.mar_wy_video_new_record_table),
        MARWYVideoNewCollectionModel : conn.model('mar_wy_video_new_collection_model', schemaTables.mar_wy_video_new_collection_table),

        MARTestModel: conn.model('mar_test_model', schemaTables.mar_test_table),
        /*马小丁群聊*/
        MARMXDChatUserModel: conn.model('mar_mxd_chat_user_table', schemaTables.mar_mxd_chat_user_table),
        MARMXDChatMessageModel: conn.model('mar_mxd_chat_message_table', schemaTables.mar_mxd_chat_message_table),


    },
    MXRResponseModel: MXRResponseModel,
    buildModel : function (tableName, schema) {
        return conn.model(tableName, schema);
    }
};