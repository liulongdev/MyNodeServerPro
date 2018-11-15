const Schedule = require('node-schedule');
const request = require('superagent');
function startDingDingSchedule() {

    // 提醒打卡
    let daKaRule = new Schedule.RecurrenceRule();
    daKaRule.dayOfWeek = new Schedule.Range(1, 5);
    daKaRule.hour = 8;
    daKaRule.minute = 35;
    daKaRule.second = 0;
    let daKaSchedule = Schedule.scheduleJob(daKaRule, function () {
        dingRobotNoticeText('打卡提醒：上班从打卡开始， 别忘记打卡哦 ～');
    });

    // 提醒下班燃尽图和日报、打卡
    let xiaBanRule = new Schedule.RecurrenceRule();
    xiaBanRule.dayOfWeek = new Schedule.Range(1, 5);
    xiaBanRule.hour = 18;
    daKaRule.minute = 0;
    xiaBanRule.second = 0;
    let xiaBanSchedule = Schedule.scheduleJob(xiaBanRule, function () {
        dingRobotNoticeText('友情提醒：大家别忘记下班前把日报和阐道的任务清一下， 还有打卡别忘记了呢 ～');
    });

    // 提醒周五下班周报
    // 提醒下班燃尽图和日报、打卡
    let zhouBaoRule = new Schedule.RecurrenceRule();
    zhouBaoRule.dayOfWeek = 5;
    zhouBaoRule.hour = [18, 20];
    daKaRule.minute = 0;
    zhouBaoRule.second = 0;
    let zhouBaoSchedule = Schedule.scheduleJob(zhouBaoRule, function () {
        console.log('hello 4 >>>> ', new Date().toLocaleString());
        dingRobotNoticeText('友情提醒：一个愉快的周末从写完周报开始，大家记得写周报哟 ～');
    });

}

// url = 'https://oapi.dingtalk.com/robot/send?access_token=eecf8272953bd534ea90d8ba381b4ebd5df75cef1eeef0a59d608ac1ed9b54ee';
// 65b13b1768d5b63892a77ed5f4c9fea858bea51d1c57a045d5a081d2588346b5
function dingRobotNoticeText(text){
    if (text == null || text.length == 0)
        return;
    let myBody = {
        "msgtype": "text",
        "text": {
            "content": text
        },
        // "at": {
        //     "atMobiles": [
        //         "1825718XXXX"
        //     ],
        //     "isAtAll": false
        // }
    };

    request.post('https://oapi.dingtalk.com/robot/send?access_token=65b13b1768d5b63892a77ed5f4c9fea858bea51d1c57a045d5a081d2588346b5')
    .send(myBody)
    .set("Content-Type", "application/json; charset=utf-8")
    .end((err, res) => {
       if (err)
           console.log('ding robot say ', text, '; err : ', err);
       else
       {
           console.log('ding robot say ', text, '; resText:', res.text);
       }
    });


}


module.exports = startDingDingSchedule;