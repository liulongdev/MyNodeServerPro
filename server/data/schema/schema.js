/**
 * Created by Martin on 2017/11/3.
 */
const Schema = require('mongoose').Schema;
const ObjectId = Schema.Types.ObjectId;
const Mixed = Schema.Types.Mixed;
// const ObjectId = Schema.Types.ObjectId;
module.exports = {
    /*用户注册表*/
    mar_user_table: new Schema({
        phone: {type: String, unique: true},
        userNickName: {type: String, default: '请输入昵称'},
        password: {type: String},
        email: {type: String},
        createTime: {type: Date},
        updateTime: {type: Date},
        userImageIcon: {type: String},
        age: {type: Number},
        birthDay: {type: Date},
        gender: {type: String, default: '女'},   // 0：female， 1：male
        sex: {type: Number, default: 0},         // 0：female， 1：male
        type: {type: Number, default: 0},
        state: {type: Number, default: 0},

        userCompany: {type: String},
        userCountry: {type: String},
        userProvince: {type: String},
        userCity: {type: String},
        userAddress: {type: String},
        userSchool: {type: String},
        thirdUserIds: [{type: ObjectId, ref:'mar_third_platform_user_model'}],
    },{
        strict: false,
    }),

    /*第三方用户信息*/
    mar_third_platform_user_table: new Schema({
        usid: {type: String, unique: true},
        platformType: {type: Number},
        uid: {type: String},
        openid: {type: String},
        unionid: {type: String},
        accessToken: {type: String},
        refreshToken: {type: String},

        expiration: {type: String},

        name: {type: String},
        // gender,
        unionGender: {type: String},
        iconurl: {type: String},

        originalResponse: {type: Mixed},

        userId:{type: ObjectId, ref: 'mar_user_model'},

    },{
        strict: false,
    }),

    /*操作日志表*/
    mar_operation_log_table: new Schema({
        appVersion: {type: String},     // app版本号
        deviceType: {type: String},     // 设备型号 iOS ， andorid
        deviceUUID: {type: String},     // 设备唯一标识
        machineModel: {type: String},   // 设备型号
        machineModelName: {type: String},      // 设备名称
        osVersion: {type: String},      // 设备系统版本
        timeStamp: {type: String},      // 请求时间戳
        signature: {type: String},      // 数字签名
        operation: {type: String},      // 操作
        operationTime: {type: Date},    // 操作时间
        currentUserId: {type: String},         // 用户Id
    },{
        strict: false,
    }),

    mar_login_active_table: new Schema({
        u_id : {type: ObjectId, ref:'mar_user_model', unique: true, require: true},
        loginTime: {type: Date},
        deviceUUID: {type: String},     // 设备唯一标识
        appVersion: {type: String},     // app版本号
        deviceType: {type: String},     // 设备型号 iOS ， andorid
        machineModel: {type: String},   // 设备型号
        machineModelName: {type: String},      // 设备名称
        osVersion: {type: String},      // 设备系统版本
        timeStamp: {type: String},      // 请求时间戳
        signature: {type: String},      // 数字签名
        operation: {type: String},      // 操作
        operationTime: {type: Date},    // 操作时间
        currentUserId: {type: String},         // 用户Id
    }),

    mar_test_table: new Schema({
        name: {type: String},
        age: {type: Number},
        date: {type: Date},
        myMixed: {type: Mixed},
    }),
};