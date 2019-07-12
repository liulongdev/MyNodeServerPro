/**
 * Created by Martin on 2017/12/26.
 */

module.exports = Object.freeze({
    SERVER_URL_RegisterUser:            '/api/core/v1/user/register',    // 注册用户
    SERVER_URL_LoginWithPhone:          '/api/core/v1/user/loginWithPhone',  // 手机登录
    SERVER_URL_quickLoginWithPhone:     '/api/core/v1/user/quickLoginWithPhone',  // 手机快速登录
    SERVER_URL_GetAllUser:              '/api/core/v1/user/getAllUsers', // 获取所有用户
    SERVER_URL_ThirdPlatformLogin:      '/api/core/v1/user/thirdPlatformLogin', // 第三方平台登陆
    SERVER_URL_UserExistWithPhone:      '/api/core/v1/user/userExistWithPhone', // 是否存在该手机号的用户
    SERVER_URL_ChangePassword:          '/api/core/v1/user/changePassword', // 更改密码
    SERVER_URL_BindPhone:               '/api/core/v1/user/bindPhone', // 设置密码
    SERVER_URL_SetPassword:             '/api/core/v1/user/setPassword', // 设置密码

    SERVER_URL_AddWYVideoNewRecord:         '/api/core/v1/wy/new/addVideoNewRecord',     // 增加浏览的视频新闻记录
    SERVER_URL_AddWYVideoNewCollection:     '/api/core/v1/wy/new/addVideoNewCollection',    // 增加视频收藏
    SERVER_URL_RemoveWYVideoNewRecord:      '/api/core/v1/wy/new/removeVideoNewRecord',     // 增加浏览的视频新闻记录
    SERVER_URL_RemoveWYVideoNewCollection:  '/api/core/v1/wy/new/removeVideoNewCollection', // 删除视频新闻收藏
    SERVER_URL_RemoveAllWYVideoNewRecord:   '/api/core/v1/wy/new/removeAllVideoNewRecord',     // 增加所有浏览的视频新闻记录
    SERVER_URL_RemoveAllWYVideoNewCollection:'/api/core/v1/wy/new/removeAllVideoNewCollection', // 删除所有视频新闻收藏
    SERVER_URL_GetAllWYVideoNewCollection:  '/api/core/v1/wy/new/getAllVideoNewCollection',     // 获取所有视频新闻列表

    /*马小丁聊天相关*/
    SERVER_URL_UpdateMXDCUserInfo:          '/api/core/v1/mxdChat/updateMXDCUserInfo',              // 创建或者更新简单的用户信息
    SERVER_URL_PostMXDCMessage:             '/api/core/v1/mxdChat/new/postMXDCMessage',             // 发送群聊信息



    // 网易信用到的
    SERVER_WYXURL_:                         'api/core/wyx/v1',       //



    // 梦想人加解密
    SERVER_URL_MXREncoder:              '/api/mxr/core/mxr/v1/encoder',      // 梦想人加密
    SERVER_URL_MXRDecoder:              '/api/mxr/core/mxr/v1/decoder',      // 梦想人解密


    SERVER_URL_MXRTestUrl:              '/api/mxr/core/mxr/v1/test',        // 梦想人测试接口
    SERVER_URL_MXRNetworkTestAddApi:    '/api/mxr/core/mxr/v1/network/add', // 增加接口
    SERVER_URL_MXRGetAllApi:            '/api/mxr/core/mxr/v1/network/getAll', // 获取所有的接口

    /*weex 调试接口*/
    SERVER_URL_MXRWeexUrl:              '/api/mxr/core/weex',        // 梦想人测试接口
});
