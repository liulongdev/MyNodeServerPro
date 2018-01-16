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
});
