/**
 * Created by Martin on 2017/12/31.
 */

const MARUtil = require('../../../lib/util');
const models = require('../../../models');
const _ = require('lodash');

const user = {
    createUser: createUser,

    getUserFindOneWithUserId: getUserFindOneWithUserId,

    getUserFullInfoFindOneWithPhone: getUserFullInfoFindOneWithPhone,

    getUserFullInfoWithUserId: getUserFullInfoWithUserId,

    getUsersWithThirdUserId: getUsersWithThirdUserId,

    getUserFullInfoWithUserIdAndPassword: getUserFullInfoWithUserIdAndPassword,

    getUserFullInfoWithPhoneAndPassword: getUserFullInfoWithPhoneAndPassword,

    createUserWithThirdUserInfoJSON: createUserWithThirdUserInfoJSON,

    getUserLoginActiveWithUserId: getUserLoginActiveWithUserId,

    saveUserLoginActiveWithLoginJSON: saveUserLoginActiveWithLoginJSON,

    getUserLoginActiveWithParamJSON: getUserLoginActiveWithParamJSON,
};

function createUser(userJSON, callback) {
    const userModel = new models.mongooseModelTable.MARUserModel(userJSON);
    userModel._id = MARUtil.generateMongooseUUID();
    userModel.createTime = userModel.updateTime = new Date();
    console.log(userModel.phone);
    if (!userModel.phone || (typeof userModel.phone === 'string' && userModel.phone.length === 0))
    {
        userModel.phone = userModel._id;
    }
    // console.log(userModel);
    userModel.save(callback);
}

function getUserFindOneWithUserId(_id, callback) {
    models.mongooseModelTable.MARUserModel.findOne({_id: _id}, callback);
}

function getUsersWithThirdUserId(thirdUserId, callback) {
    models.mongooseModelTable.MARUserModel.find().populate({
        path: 'thirdUserId',
        match: {usid: thirdUserId}
    }).exec(callback);
}

function getUserFullInfoWithUserId(userId, callback) {
    models.mongooseModelTable.MARUserModel.findOne({_id: userId}).populate({
        path:'thirdUserIds',
    }).exec(callback);
}

function  getUserFullInfoFindOneWithPhone(phone, callback) {
    models.mongooseModelTable.MARUserModel.findOne({phone: phone}).populate({
        path:'thirdUserIds',
    }).exec(callback);
}

function getUserFullInfoWithUserIdAndPassword(paramJSON, callback) {
    models.mongooseModelTable.MARUserModel.findOne({_id:paramJSON.userId, password:paramJSON.password}).populate({
        path:'thirdUserIds',
    }).exec(callback);
}

function getUserFullInfoWithPhoneAndPassword(paramJSON, callback) {
    models.mongooseModelTable.MARUserModel.findOne({phone: paramJSON.phone, password: paramJSON.password}).populate({
        path:'thirdUserIds',
    }).exec(callback);

}

function createUserWithThirdUserInfoJSON(thirdUserInfo, callback) {
    if (typeof thirdUserInfo.usid === 'string' && thirdUserInfo.usid.length > 0)
    {
        models.mongooseModelTable.MARThirdPlatFormUserModel.deleteMany({usid: thirdUserInfo.usid}, function (err, doc) {
            if (err)
            {
                callback(err);
                return;
            }
            const user_id = MARUtil.generateMongooseUUID();
            const thirdUser_id = MARUtil.generateMongooseUUID();
            const nowDate = new Date();
            let userInfoJSON = {
                _id : user_id,
                phone: user_id,
                userNickName: thirdUserInfo.name,
                createTime: nowDate,
                updateTime: nowDate,
                gender: thirdUserInfo.unionGender,
                userImageIcon: thirdUserInfo.iconurl,
                thirdUserIds:[thirdUser_id],
            };
            new models.mongooseModelTable.MARUserModel(userInfoJSON).save(function (err, doc) {
               if (err)
               {
                   console.log('>>>>>> 3');
                   if (callback) callback(err);
               }
               else
               {
                   console.log('>>>>>> 4');
                   thirdUserInfo._id = thirdUser_id;
                   thirdUserInfo.userId = user_id;
                   new models.mongooseModelTable.MARThirdPlatFormUserModel(thirdUserInfo).save(function (err, doc) {
                       if (err)
                       {
                           if (callback) callback(err);
                       }
                       else
                       {
                           if (callback) getUserFullInfoWithUserId(user_id, callback);
                       }
                   })
               }
            });
        });
    }
    else
    {
        if (callback)
        {
            let err = new Error('第三方平台数据异常');
            callback(err);
        }
    }
}

function getUserLoginActiveWithUserId(userId, callback) {
    models.mongooseModelTable.MARLoginActiveModel.findOne({u_id: userId}, callback);
}

function saveUserLoginActiveWithLoginJSON(loginJSON, callback) {
    let loginActive = new models.mongooseModelTable.MARLoginActiveModel(loginJSON);
    loginActive.u_id = loginJSON.u_id;
    loginActive.loginTime = new Date();
    models.mongooseModelTable.MARLoginActiveModel.findOne({u_id: loginActive.u_id}, function (err, loginActiveModel) {
        if (err) {
            if (callback) callback(err);
        }
        else {
            if (loginActiveModel) {
                // console.log(loginActiveModel);
                loginActive._id = loginActiveModel._id;
                models.mongooseModelTable.MARLoginActiveModel.update({_id: loginActiveModel.id}, {$set: loginJSON}, function (err) {
                    if (!err) {
                        callback(null, loginActive);
                    }
                    else {
                        callback(err);
                    }
                });
            }
            else {
                loginActive._id = MARUtil.generateMongooseUUID();
                loginActive.save(callback);
            }
        }

    });
}

/* 根据userId  和 设备标识，检验是否被抢登
 * param：  u_id  deviceUUID
 * */
function getUserLoginActiveWithParamJSON(paramJSON, callback) {
    models.mongooseModelTable.MARLoginActiveModel.findOne(paramJSON, callback);
}

module.exports = user;