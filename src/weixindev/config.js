/**
 * Created by Martin on 2017/10/25.
 */

const wxOption = {
    appId: 'wx602b41b8858ae0d0',
    secret: '06e7ee94318f488d91928cd97a97afc0',
    token:  'Martin201710232344',
    encodingAESKey: '',
    menus:  {
        "button":[
            {
                "type":"view",
                "name":"首页",
                "url":"http://106.14.149.231"
            },
            {
                "name":"更多",
                "sub_button":[
                    {
                        "type":"view",
                        "name":"菜单1",
                        "url":"http://106.14.149.231/menu1"
                    },
                    {
                        "type":"view",
                        "name":"菜单2",
                        "url":"http://106.14.149.231/menu1"
                    },
                    {
                        "type":"view",
                        "name":"菜单3",
                        "url":"http://106.14.149.231/menu1"
                    }]
            }]
    },

};


const wxOption2 = {
    appId: 'wx5c5c635ce31db354',
    secret: 'ea345be2eed88d0a559f778b06ae1bbd',
    token:  'Martin201710232344',
    encodingAESKey: '',
};


exports.wxOption = wxOption;