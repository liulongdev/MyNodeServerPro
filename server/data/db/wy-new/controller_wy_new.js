/**
 * Created by Martin on 2018/1/15.
 */

const MARUtil = require('../../../lib/util');
const models = require('../../../models');
const _ = require('lodash');

const wy_new = {
    addNewRecord : addNewRecord,
    addVideoNewRecord : addVideoNewRecord,
    addNewCollection : addNewCollection,
    addVideoNewCollection : addVideoNewCollection,
    removeNewRecordWithId: removeNewRecordWithId,
    removeNewCollectionWithId: removeNewCollectionWithId,
    removeVideoNewRecordWithId: removeVideoNewRecordWithId,
    removeVideoNewCollectionWithId: removeVideoNewCollectionWithId,
    removeAllVideoNewRecords: removeAllVideoNewRecords,
    removeAllVideoNewCollection: removeAllVideoNewCollection,

    getAllVideoNewRecord: getAllVideoNewRecord,
    getAllVideoNewCollection: getAllVideoNewCollection,

    getOneVideoCollectionWithVid: getOneVideoCollectionWithVid,
};

function addNewRecord(paramJson, callback) {
    new models.mongooseModelTable.MARWYNewRecordModel(paramJson).save(callback);
}

function  addVideoNewRecord(paramJson, callback) {
    new models.mongooseModelTable.MARWYVideoNewRecordModel(paramJson).save(callback);
}

function addNewCollection(paramJson, callback) {
    new models.mongooseModelTable.MARWYNewCollectionModel(paramJson).save(callback);
}

function addVideoNewCollection(paramJson, callback) {
    new models.mongooseModelTable.MARWYVideoNewCollectionModel(paramJson).save(callback);
}

function removeNewRecordWithId(_id, callback) {
    models.mongooseModelTable.MARWYNewRecordModel.find().deleteOne({_id: _id}, callback);
}

function removeNewCollectionWithId(_id, callback) {
    models.mongooseModelTable.MARWYNewCollectionModel.find().deleteOne({_id: _id}, callback);
}

function removeVideoNewRecordWithId(_id, callback) {
    models.mongooseModelTable.MARWYVideoNewRecordModel.find().deleteOne({_id: _id}, callback);
}

function removeAllVideoNewRecords(paramJson, callback) {
    let filterJson = userFilterParamJson(paramJson);
    if (!filterJson)
    {
        let err = new Error('参数错误');
        callback(err);
        return;
    }
    models.mongooseModelTable.MARWYVideoNewRecordModel.deleteMany(filterJson, callback);
}

function removeVideoNewCollectionWithId(_id, callback) {
    models.mongooseModelTable.MARWYVideoNewCollectionModel.find().deleteOne({_id: _id}, callback);
}

function removeAllVideoNewCollection(paramJson, callback) {
    let filterJson = userFilterParamJson(paramJson);
    if (!filterJson)
    {
        let err = new Error('参数错误');
        callback(err);
        return;
    }
    models.mongooseModelTable.MARWYVideoNewCollectionModel.deleteMany(filterJson, callback);
}

function getAllVideoNewRecord(paramJson, callback) {
    let filterJson = userFilterParamJson(paramJson);
    if (!filterJson)
    {
        let err = new Error('参数错误');
        callback(err);
        return;
    }
    models.mongooseModelTable.MARWYVideoNewRecordModel.find(filterJson, callback);
}

function getAllVideoNewCollection(paramJson, callback) {
    let filterJson = userFilterParamJson(paramJson);
    if (!filterJson)
    {
        let err = new Error('参数错误');
        callback(err);
        return;
    }
    models.mongooseModelTable.MARWYVideoNewCollectionModel.find(filterJson, callback);
}

function getOneVideoCollectionWithVid(paramJson, callback) {
    let  filterJson = userFilterParamJson(paramJson);
    if (!filterJson)
    {
        let err = new Error('参数错误');
        callback(err);
        return;
    }
    filterJson['vid'] = paramJson['vid'];
    models.mongooseModelTable.MARWYVideoNewCollectionModel.findOne(filterJson, callback);
}

function userFilterParamJson(paramJson) {
    let filterJson = undefined;
    if (paramJson['userId'] && paramJson['userId'].length > 0)
    {
        filterJson = {userId:paramJson['userId']};
    }
    else if (paramJson['deviceUUID'] && paramJson['deviceUUID'].length > 0)
    {
        filterJson = {'deviceUUID': paramJson['deviceUUID']};
    }
    return filterJson;
}

module.exports = wy_new;