/**
 * Created by Martin on 2017/12/26.
 */

const _ = require('lodash');
const crypto = require('crypto');
const MARUtil = require('../lib/util/index');
const AllUrl = require('./all_url');
const MARResponseModel = require('./mar_response_model');
const dbOp = require('../data/db');

const models = require('../models');

function mxr_express_server(app) {
    /*
    * 获取所有用户
    * */
    app.get(AllUrl.SERVER_URL_GetAllUser, function (req, res, next) {
        const result = new MARResponseModel();
        models.mongooseModelTable.MARUserModel.find({}, function (err, doc) {
           if (err)
           {
               result.header.errCode = 1;
               result.header.errMsg = '获取用户失败：' + err;
           }
           else
           {
               result.body = JSON.stringify(doc);
           }
            res.json(result.toResponseJSON());
        });
    });

    /*
    * 注册用户
    *
    * */
    app.post(AllUrl.SERVER_URL_RegisterUser, function (req, res, next) {
        console.log('Hello>>>>>>>>');
        const result = new MARResponseModel();
        dbOp.user.createUser(req.body, function (err, doc, rowAffect) {
            if (err)
            {
                result.header.errCode = 1;
                result.header.errMsg = '' + err;
            }
            else {
                console.log('register success');
                // console.log(doc);
                result.body = JSON.stringify(doc);
            }
            res.json(result.toResponseJSON());
        });
    });

    /*手机号密码登录
    *
    * userId:     string
    * password :  string
    * */
    app.get(AllUrl.SERVER_URL_LoginWithPhone, function (req, res, next) {
        let result = new MARResponseModel();
        if (!MARUtil.verifyParams(req.query, ['phone', 'password']))
        {
            result.header.errCode = 500;
            result.header.errMsg = '参数错误';
            res.end(result.toResponseJSON());
            return;
        }
        dbOp.user.getUserFullInfoWithPhoneAndPassword(req.query, function (err, user) {
            if (err || !user)
            {
                result.header.errCode = 1;
                result.header.errMsg = '账号或者密码错误';
                res.json(result.toResponseJSON());
            }
            else
            {
                result.body = JSON.stringify(user);
                let loginActiveJSON = req.query;
                loginActiveJSON.u_id = user._id;
                loginActiveJSON.loginTime = new Date();
                dbOp.user.saveUserLoginActiveWithLoginJSON(loginActiveJSON, function (err, loginActiveModel) {
                    if (err || !loginActiveModel)
                    {
                        result.header.errCode = 1;
                        result.header.errMsg = '登录信息有误，请重试';
                        console.error('1save login active table error : ' + err);
                    }
                    res.json(result.toResponseJSON());
                })
            }

        });
    });

    /*手机号快速登录
    * phone : string
    * */
    app.post(AllUrl.SERVER_URL_quickLoginWithPhone, function (req, res, next) {
        let result = new MARResponseModel();
        console.log(req.body);
        let params = req.body;
        if (!MARUtil.verifyParams(params, ['phone']))
        {
            result.header.errCode = 500;
            result.header.errMsg = '缺少参数';
            res.json(result.toResponseJSON());
            return;
        }
        dbOp.user.getUserFullInfoFindOneWithPhone(params.phone, function (err, user) {
            if (err)
            {
                result.header.errCode = 1;
                result.header.errMsg = '快速登录失败，请稍后再试';
                res.json(result.toResponseJSON());
            }
            else
            {
                if (user)
                {
                    result.body = JSON.stringify(user);
                    let loginActiveJSON = params;
                    loginActiveJSON.u_id = user._id;
                    console.log('>>>>>>>>>>lksjdfl ');
                    // console.log(user);
                    loginActiveJSON.loginTime = new Date();
                    dbOp.user.saveUserLoginActiveWithLoginJSON(loginActiveJSON, function (err, model) {
                        if (err || !model)
                        {
                            result.header.errCode = 1;
                            result.header.errMsg = '登录信息有误，请重试';
                            console.error('3save login active table error : ' + err);
                        }
                        console.log('>>>>>> test');
                        // console.log(result.toResponseJSON());
                        res.json(result.toResponseJSON());
                    });
                }
                else
                {
                    let userJSON = params;
                    userJSON.userNickName = '请修改昵称';
                    dbOp.user.createUser(userJSON, function (err, user) {
                        if (err)
                        {
                            result.header.errCode = 1;
                            result.header.errMsg = '' + err;
                        }
                        else {
                            console.log('register success');
                            // console.log(user);
                            result.body = JSON.stringify(user);
                        }
                        res.json(result.toResponseJSON());
                    })
                }
            }
        });
    });

    /*第三方平台登陆*/
    app.post(AllUrl.SERVER_URL_ThirdPlatformLogin, function (req, res, next) {
        console.log('>>>>>> third platform login');
        let thirdUserInfoJSON = req.body;
        const result = new MARResponseModel();
        if (!MARUtil.verifyParams(thirdUserInfoJSON, ['usid']))
        {
            result.header.errCode = 500;
            result.header.errMsg = '缺少参数';
            res.json(result.toResponseJSON());
            return;
        }
        dbOp.user.getUsersWithThirdUserId(thirdUserInfoJSON.usid, function (err, users) {
            if (err)
            {
                result.header.errCode = 1;
                result.header.errMsg = '错误1';
                res.json(result.toResponseJSON());
            }
            else
            {
                if (Array.isArray(users) && users.length > 0)
                {
                    const user = users[0];
                    result.body = JSON.stringify(user);
                    thirdUserInfoJSON.u_id = user._id;
                    thirdUserInfoJSON.loginTime = new Date();
                    dbOp.user.saveUserLoginActiveWithLoginJSON(thirdUserInfoJSON, function (err, model) {
                        if (err || !model)
                        {
                            result.header.errCode = 1;
                            result.header.errMsg = '登录信息有误，请重试';
                            console.error('2save login active table error : ' + err);
                        }
                        res.json(result.toResponseJSON());
                    });
                }
                else
                {
                    dbOp.user.createUserWithThirdUserInfoJSON(thirdUserInfoJSON, function(err, userFullInfo) {
                        if (err || !userFullInfo)
                        {
                            result.header.errCode = 1;
                            result.header.errMsg = '错误2';
                            res.json(result.toResponseJSON());
                        }
                        else
                        {
                            result.body = JSON.stringify(userFullInfo);
                            thirdUserInfoJSON.u_id = userFullInfo._id;
                            thirdUserInfoJSON.loginTime = new Date();
                            dbOp.user.saveUserLoginActiveWithLoginJSON(thirdUserInfoJSON,function (err, model) {
                                if (err || !model)
                                {
                                    result.header.errCode = 1;
                                    result.header.errMsg = '登录信息有误，请重试';
                                    console.error('4save login active table error : ' + err);
                                }
                                res.json(result.toResponseJSON());

                            });
                        }
                    })
                }
            }
        })

    });

    /* 设置密码
    * userId
    * password
    * */
    app.post(AllUrl.SERVER_URL_SetPassword, function (req, res, next) {
        let params = req.body;
        let result = new MARResponseModel();
        if (!MARUtil.verifyParams(params, ['userId', 'password']) && params['userId'].length > 0)
        {
            result.header.errCode = 500;
            result.header.errMsg = '请输入正确的手机号';
            res.json(result.toResponseJSON());
            return;
        }
        models.mongooseModelTable.MARUserModel.update({_id:params.userId}, {$set: {password: params.password}})
            .exec(function (err, ret) {
                if (err)
                {
                    console.error('set password error : '+ err);
                    result.header.errCode = 1;
                    result.header.errMsg = '设置密码有误';
                }
                else
                {
                    if (ret['ok'] === 1)
                    {

                    }
                    else
                    {
                        result.header.errCode = 1;
                        result.header.errMsg = '设置密码失败';
                    }
                }
                res.json(result.toResponseJSON());
            });
    });
    
    app.get(AllUrl.SERVER_URL_UserExistWithPhone, function (req, res, next) {
        let params = req.query;
        let result = new MARResponseModel();
        if (!MARUtil.verifyParams(params, ['phone']))
        {
            result.header.errCode = 500;
            result.header.errMsg = '缺少参数';
            res.json(result.toResponseJSON());
        }
        dbOp.user.getUserFullInfoFindOneWithPhone(params['phone'], function (err, userModel) {
            if (err)
            {
                result.header.errCode = 1;
                result.header.errMsg = '服务开小差了';
                console.error('find user with phone error : ' + err);
                res.json(result.toResponseJSON());
            }
            else
            {
                if (userModel)
                {
                    result.body = '1';
                }
                else
                {
                    result.body = '0';
                }
                res.json(result.toResponseJSON());
            }
        });
    });

    /*绑定手机号
    * userId
    * phone
    * */
    app.post(AllUrl.SERVER_URL_BindPhone, function (req, res, next) {
        let params = req.body;
        let result = new MARResponseModel();
        if (!MARUtil.verifyParams(params, ['userId', 'phone']))
        {
            result.header.errCode = 500;
            result.header.errMsg = '缺少参数';
            res.json(result.toResponseJSON());
        }
        console.log('>>>>>>>>> 1');
        dbOp.user.getUserFindOneWithUserId(params.userId, function (err, userModel) {
           if (err || !userModel)
           {
               console.log('>>>>>>>>> 2');
               result.header.errCode = 1;
               result.header.errMsg = '服务开小差了';
               res.json(result.toResponseJSON());
           }
           else
           {
               console.log('>>>>>>>>> 3');
               if (MARUtil.checkPhone(userModel.phone))
               {
                   console.log('>>>>>>>>> 4');
                   result.header.errCode = 1;
                   result.header.errMsg = '该账号已经绑定手机号了';
                   res.json(result.toResponseJSON());
               }
               else
               {
                   console.log('>>>>>>>>> 5');
                   dbOp.user.getUserFullInfoFindOneWithPhone(params['phone'], function (err, userModel) {
                       if (err)
                       {
                           result.header.errCode = 1;
                           result.header.errMsg = '服务开小差了';
                           console.error('find user with phone error : ' + err);
                           res.json(result.toResponseJSON());
                       }
                       else
                       {
                           if (userModel)
                           {
                               console.log('>>>>>>>>> 6');
                               result.header.errCode = 1;
                               result.header.errMsg = '该手机已经绑定用户';
                               res.json(result.toResponseJSON());
                           }
                           else
                           {
                               models.mongooseModelTable.MARUserModel.update({_id:params.userId}, {$set: {phone: params.phone}})
                                   .exec(function (err, ret) {
                                       if (err)
                                       {
                                           console.error('set password error : '+ err);
                                           result.header.errCode = 1;
                                           result.header.errMsg = '服务器开小差了';
                                       }
                                       else
                                       {
                                           console.log('>>>>>>>>> 7');
                                           if (ret['ok'] === 1)
                                           {

                                           }
                                           else
                                           {
                                               result.header.errCode = 1;
                                               result.header.errMsg = '绑定手机号失败';
                                           }
                                       }
                                       res.json(result.toResponseJSON());
                                   });
                           }

                       }
                   });
               }
           }
        });
    });

    //
    // let testJSON = {name:'Martin', age:10, date: new Date()};
    // // 5a4a578701567829140d4421
    // let testModel = new models.mongooseModelTable.MARTestModel(testJSON);
    // testModel.save(function (err, testModel) {
    //     if (err)
    //     {
    //         console.log('error : ' + err);
    //     }
    //     else
    //     {
    //         console.log(testModel);
    //     }
    // });


    // models.mongooseModelTable.MARTestModel.find({}, function (err, doc) {
    //     if (err)
    //     {
    //         console.log('error : ' + err);
    //     }
    //     else
    //     {
    //         console.log(doc);
    //     }
    // });

    // models.mongooseModelTable.MARTestModel.update({_id: '5a4a578701567829140d4421'}, {$set : {name: 'David'}}).exec(function (err, doc, affectRow) {
    //     if (err)
    //     {
    //         console.log('error : ' + err);
    //     }
    //     else
    //     {
    //         console.log(doc);
    //         console.log(affectRow);
    //     }
    // })

    /* 增加网易视频观看记录
    *
    * */
    app.post(AllUrl.SERVER_URL_AddWYVideoNewRecord, function (req, res, next) {
       let result = new MARResponseModel();
       let paramJSON = MARUtil.reqParamJson(req);
       dbOp.wyNew.addVideoNewRecord(paramJSON, function (err, doc) {
           if (err)
           {
               result.header.errCode = 1;
               result.header.errMsg = '';
               console.error('add wy video new record error : ' + err);
           }
           res.json(result.toResponseJSON());
       });
    });

    /* 增加网易视频收藏记录
     *
     * */
    app.post(AllUrl.SERVER_URL_AddWYVideoNewCollection, function (req, res, next) {
        let result = new MARResponseModel();
        let paramJSON = MARUtil.reqParamJson(req);
        if (!paramJSON['userId'] && !paramJSON['deviceUUID'] && !paramJSON['vid'])
        {
            result.header.errCode = 500;
            result.header.errMsg = '缺少参数';
            res.json(result.toResponseJSON());
            return;
        }
        dbOp.wyNew.getOneVideoCollectionWithVid(paramJSON, function (err, doc) {
            if (doc) {
                console.log('已经收藏过了，不需要重复收藏');
                res.json(result.toResponseJSON());
            }
            else {
                dbOp.wyNew.addVideoNewCollection(paramJSON, function (err, doc) {
                    if (err)
                    {
                        result.header.errCode = 1;
                        result.header.errMsg = '';
                    }
                    res.json(result.toResponseJSON());
                });
            }
        });

    });

    /*删除某个用户或某台设备上的所有的wy视频收藏
     * userId       至少一个
     * deviceUUID   至少一个
    * */
    app.post(AllUrl.SERVER_URL_RemoveAllWYVideoNewCollection, function (req, res, next) {
        let result = new MARResponseModel();
        let paramJSON = MARUtil.reqParamJson(req);
        if (!paramJSON['userId'] && !paramJSON['deviceUUID'])
        {
            result.header.errCode = 500;
            result.header.errMsg = '缺少参数';
            res.json(result.toResponseJSON());
            return;
        }
        dbOp.wyNew.removeAllVideoNewCollection(paramJSON, function (err, ret) {
            if (err)
            {
                result.header.errCode = 1;
                result.header.errMsg = '';
            }
            res.json(result.toResponseJSON());
        });
    });

    /*获取某个用户活着某台设备的所有视频收藏列表
    *  userId       至少一个
    *  deviceUUID   至少一个
    * */
    app.get(AllUrl.SERVER_URL_GetAllWYVideoNewCollection, function (req, res, next) {
        let result = new MARResponseModel();
        let paramJSON = MARUtil.reqParamJson(req);
        if (!paramJSON['userId'] && !paramJSON['deviceUUID'])
        {
            result.header.errCode = 500;
            result.header.errMsg = '缺少参数';
            res.json(result.toResponseJSON());
            return;
        }
        dbOp.wyNew.getAllVideoNewCollection(paramJSON, function (err, docs) {
            if (err)
            {
                result.header.errCode = 1;
                result.header.errMsg = '获取收藏列表失败';
            }
            else
                result.body = docs;
            res.json(result.toResponseJSON());
        });
    });

    /*创建或者更新简单的用户信息
    *
    * */
    app.post(AllUrl.SERVER_URL_UpdateMXDCUserInfo, function (req, res, next) {
        let result = new MARResponseModel();
        let paramJSON = MARUtil.reqParamJson(req);
        if (!paramJSON['userNickName'] && !paramJSON['deviceUUID'])
        {
            result.header.errCode = 500;
            result.header.errMsg = '缺少参数';
            res.json(result.toResponseJSON());
            return;
        }
        dbOp.user.updateMXDCUser(paramJSON, function (err, userModel) {
            if (err)
            {
                result.header.errCode = 1;
                result.header.errMsg = '用户信息上传失败';
            }
            else
            {
                result.body = JSON.stringify(userModel);
            }
            res.json(result.toResponseJSON());
        })
    });

    /*发送群聊信息
     *
     * */
    app.post(AllUrl.SERVER_URL_PostMXDCMessage, function (req, res, next) {
        let result = new MARResponseModel();
        let paramJSON = MARUtil.reqParamJson(req);

        dbOp.user.postMXDChatMsg(paramJSON, function (error, MXDCMsgModel) {
            if (error)
            {
                result.header.errCode = 1;
                result.header.errMsg = '发送失败';
            }
            res.json(result.toResponseJSON());
        })

    });
}

module.exports = mxr_express_server;