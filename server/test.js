/**
 * Created by Martin on 2018/3/23.
 */


// const models = require('./models');
//
//
//
// const Schema = require('mongoose').Schema;
// const ObjectId = Schema.Types.ObjectId;
// const now = new Date();
// let testJson = {
//             testId:generateMonggooseUUID(),
//             name: "Martin222",
//             createTime: now,
//             updateTime: now,
//             exAdd: "Hello, I am ex info"};
//
// new models.mongooseModelTable.MARTestModel(testJson).save(function (err) {
//     if (err)
//     {
//         console.log(err);
//     }
//     else
//     {
//         console.log("add success");
//     }}
// );



// let hmac = crypto.createHmac('sha256', '123456789');
// hmac.update('Martin Hello, This is important');
// let str = hmac.digest('hex');
// console.log(str);
// console.log(_(_.now() / 1000).toInteger());

const request = require('superagent');
function testQueryTrain() {
    console.log('>>>>> test ');
    let url = 'https://kyfw.12306.cn/otn/leftTicket/query?leftTicketDTO.train_date=2017-12-18&leftTicketDTO.from_station=SZH&leftTicketDTO.to_station=SHH&purpose_codes=ADULT';
    let queryParams = {
        'leftTicketDTO.train_date': '2018-01-27',
        'leftTicketDTO.from_station': 'SZH',
        'leftTicketDTO.to_station': 'SHH',
        'purpose_codes': 'ADULT'
    };
    let wxGetAccessTokenBaseUrl = 'https://kyfw.12306.cn/otn/leftTicket/queryA';
    request.get(wxGetAccessTokenBaseUrl)
        .query(queryParams)
        .end(function (err, res) {
            if (err)
            {
                console.log(err);
                reject(err +'');
            }
            else
            {

                console.log(res.text);
            }
            // console.log(res);
            // console.log('>>>>');
            // console.log(res.body);
        });
}


function  testWangyiXin() {
    let url = null;
    // 视频
    url = "https://c.m.163.com/recommend/getChanListNews?channel=T1457068979049&subtab=Video_Recom&passport=&devId=4q9wyqO%2BqQBTBHM8f1fMsbVhBeT2jN%2BpF2piB1fvCVBW8vGHludHKO1HgHn4Q%2BQf&version=31.0&spever=false&net=wifi&lat=CTVtEvU9h%2B%2Bh5zacKMVTrA%3D%3D&lon=9EoiG%2BcFCaYhcgFCoEmb2w%3D%3D&ts=1515782236&sign=0wajItdSjKo2ICaGivynYmo62uLj1wYkfOcODn7p%2BnB48ErR02zJ6/KXOnxX046I&encryption=1&canal=appstore&offset=0&size=10&fn=1";
    // url = "https://c.m.163.com/recommend/getChanListNews?channel=T1456112438822&passport=&devId=4q9wyqO%2BqQBTBHM8f1fMsbVhBeT2jN%2BpF2piB1fvCVBW8vGHludHKO1HgHn4Q%2BQf&version=31.0&spever=false&net=wifi&lat=h4oCMn4567dmFOuemqUYsw%3D%3D&lon=thiEhYUT/OmIwZnpr9nr1A%3D%3D&ts=1515226754&sign=HdjOz40v0FJZW3%2B298s1AUZtrCVm%2BmHAuGmN8nwcfD948ErR02zJ6/KXOnxX046I&encryption=1&canal=appstore&offset=0&size=10&fn=1";
    // url = "https://c.m.163.com/recommend/getChanListNews?channel=T1457068979049&subtab=Video_Beauty&passport=&devId=I9mEvOjEpr7x6qKZ0E/jqz%2BXNYccr98jb6FUP/c34MDLszEoKIcbpbZWUwpshTwP&version=31.0&spever=false&net=wifi&lat=Db%2By8mQzKvnL76zse8k%2BFw%3D%3D&lon=YUz/CebUbKsPIsBavk9JUg%3D%3D&ts=1515393095&sign=7eFT5nh9qzmonv%2BiOvKmqmk6ziKtcFHuolPv9o5qzst48ErR02zJ6/KXOnxX046I&encryption=1&canal=appstore&offset=0&size=10&fn=2";
    // url = "https://comment.api.163.com/api/v1/products/a2869674571f77b5a0867c3d71db5856/threads/M7OLO5I6050835RB/app/comments/newList?format=building&headLimit=3&ibc=newsappios&offset=10&limit=10&tailLimit=2&showLevelThreshold=5";
    request.get(url)
    // .set('Host', 'c.m.163.com')
    // .set('Accept-Language', 'zh-Hans;q=1.0')
    // .set('Accept', '*/*')
    // .set('User-Agent', 'NewsApp/31.0 iOS/10.3.3 (iPhone5,2)')
    // .set('User-L', '9GPoH3YTpi08QvHb/LQJH8wQis+pydvCwlKfLx+q3VlFLvuYyQq3vxyayVLVXEnh')
    // .set('Accept-Encoding', 'gzip;q=1.0, compress;q=0.5')
    // .set('Connection', 'keep-alive')
    // .set('User-D', 'I9mEvOjEpr7x6qKZ0E/jqz+XNYccr98jb6FUP/c34MDLszEoKIcbpbZWUwpshTwP')
    // .set('User-U', '')
    // .set('X-Trace-Id', '1515380141_254548960_3361A073-8DA8-4133-AD36-027654329A12')
    // // .set('User-C', '6KeG6aKROjrnvo7lpbM=')
    // .set('User-N', 'yyXgmdmvoQtiN87jo3oYSdCd2giod6saU+xnB6AIucmi/Ns2KL3/3QwlaZ/+bual')
        .end(function (err, res) {
            if (err)
            {
                console.log(err);
                reject(err +'');
            }
            else
            {
                console.log(res);
                console.log(res.text);
            }
        });
}
//
// let myBody = {
//     "msgtype": "text",
//     "text": {
//         "content": "大家可以去吃火锅啦"
//     },
//     "at": {
//         "isAtAll": true
//     }
// };
//
//
// request.post('https://oapi.dingtalk.com/robot/send?access_token=65b13b1768d5b63892a77ed5f4c9fea858bea51d1c57a045d5a081d2588346b5')
//     .send(myBody)
//     .set("Content-Type", "application/json; charset=utf-8")
//     .end((err, res) => {
//        if (err)
//            console.log('err : ', err);
//        else
//        {
//            console.log('res >>> ', res);
//            console.log('res text>>> ', res.text);
//        }
//     });

// testWangyiXin();

// setInterval(testQueryTrain, 1000);

// testQueryTrain();
// /Users/Martin/Dev/huochedianbao.xls
//
// function  testBuff() {
//     console.log('hello');
// }
//
// const PACKET_HEADER_SIZE = 5;
//
//
// let param = '刘 loin 高厉害了';
//
// const random = Math.ceil(Math.random()*127);
// let iSize = param.length;
// let array = [];
// array[0] = String.fromCharCode(random);
// array[1] = String.fromCharCode(PACKET_HEADER_SIZE + iSize);
// array[2] = String.fromCharCode(0);
// array[3] = String.fromCharCode(0);
// array[4] = String.fromCharCode(0);
//
//
// let index = 0;
// for (; index < iSize; index++)
// {
//     // console.log(param.charCodeAt(0));
//     console.log('===== start ====');
//     console.log((param.charCodeAt(index) + (index ^ random))  ^ (random ^ (iSize - index)));
//     array[PACKET_HEADER_SIZE + index] = String.fromCharCode(((param.charCodeAt(index) + (index ^ random))  ^ (random ^ (iSize - index))) & 0b1111);
// }
//
// // console.log('' + String.fromCharCode(65));
// // console.log(array);
//
//
// console.log(param.length);
// // testBuff();
//
// let buffer = new Buffer(PACKET_HEADER_SIZE + iSize);
//
// let i = 0;
// buffer[0] = random;
// buffer[1] = PACKET_HEADER_SIZE + param.length;
// buffer[2] = 0;
// buffer[3] = 0;
// buffer[4] = 0;
// for (; i < iSize; i++)
// {
//     console.log(i);
//     buffer[PACKET_HEADER_SIZE + i] = (param.charCodeAt(index) + (index ^ random))  ^ (random ^ (iSize - index));
// }
// console.log('>>>>>>>> ', buffer);
// console.log(buffer.toString('base64', 0, PACKET_HEADER_SIZE + iSize));
//
// let  paramBuf = new Buffer(param, 'utf-8');
// iSize = paramBuf.length;
// let chunk = [];
// for (let bufIndex = 0; bufIndex < paramBuf.length; bufIndex ++)
// {
//     paramBuf[bufIndex] = (paramBuf[bufIndex] + (bufIndex ^ random)) ^ (random ^ (iSize - bufIndex));
// }
//
//
// let myBuffer = new Buffer(PACKET_HEADER_SIZE);
// myBuffer[0] = random;
// myBuffer[1] = PACKET_HEADER_SIZE + param.length;
//
//
// let newBuffer = Buffer.concat([myBuffer, paramBuf], PACKET_HEADER_SIZE + paramBuf.length);
//
// // myBuffer = myBuffer + paramBuf;
//
// console.log(newBuffer);
// console.log(newBuffer.toString('base64', 0, PACKET_HEADER_SIZE + iSize))
// console.log(newBuffer.length);
// const  MARUtil = require('./lib/util');
// console.log(MARUtil.mxrEncoder('刘龙个大帅比'));
//
//
// function mxrDecoder(str) {
//     const PACKET_HEADER_SIZE = 5;
//     let buffer = new Buffer(str, 'base64');
//     const bufferLength = buffer.length;
//     if (bufferLength <= PACKET_HEADER_SIZE)
//         return 'error';
//
//     const random = buffer[0];
//
//     const size = bufferLength - PACKET_HEADER_SIZE;
//     console.log('>>>>>');
//     console.log(random);
//     console.log(size);
//     console.log(buffer);
//     let retBuf = new Buffer(size);
//     for (let bufIndex = 0; bufIndex < size; bufIndex++)
//     {
//         retBuf[bufIndex] = (buffer[PACKET_HEADER_SIZE + bufIndex] ^ (random ^ (size - bufIndex))) - (bufIndex ^ random);
//     }
//
//     return retBuf.toString();
// }
//
// console.log(mxrDecoder('JgwAAAC4q6m6pqOh'));

//
// const MxrHost = 'https://bs-api.mxrcorp.cn';
// let MxrHeader = {'userId':'122934',
//     'deviceId':'1D4F381D-F2BC-4C94-B0B1-42CC3EDFB059',
//     'region':'0',
//     'appVersion':'5.17.0',
//     'osType':'1',
//     'deviceUnique':'D52B7383-C486-4686-A7E8-5E857E78F936',
//     'appId':'10000000000000000000000000000001',
//                 };
//
// const MARUtil = require('./lib/util');
// const MXRResponseModel = require('../src/mxr/model/mxr_network_response_mdoel');
//
// let encoderHeader = MARUtil.mxrEncoder(JSON.stringify(MxrHeader));
// let header = {'mxr-key':encoderHeader};
//
// let url = MxrHost + '/core/home/1';
// let param = {
//     'deviceId':'1D4F381D-F2BC-4C94-B0B1-42CC3EDFB059',
//     'page':'1',
//     'param':'0',
//     'region':'0',
//     'rows':'50',
//     'search':'normal',
//     'topNums':'20',
//     'uid':MARUtil.mxrEncoder('122934')
// };
// console.log(url);
// request.get(url)
//     .set('mxr-key', encoderHeader)
//     .query(param)
//     .end(function (err, res) {
//        console.log('err >>> ', err);
//        console.log('res >>> ', JSON.parse(res.text).Header);
//        let responseModel = MXRResponseModel.builderWithResponse(res.text);
//        console.log(responseModel.header);
//        console.log('res >>> ', responseModel.originalBody);
//
//     });


var num  = 123;
var str  = 'abcdef';
var bool = true;
var arr  = [1, 2, 3, 4];
var json = {name:'wenzi', age:25};
var func = function(){ console.log('this is function'); }
var und  = undefined;
var nul  = null;
var date = new Date();
var reg  = /^[a-zA-Z]{5,20}$/;
var error= new Error();


console.log(
    typeof num,
    typeof str,
    typeof bool,
    typeof arr,
    typeof json + '',
    typeof func,
    typeof und,
    typeof nul,
    typeof date,
    typeof reg,
    typeof error
    );
