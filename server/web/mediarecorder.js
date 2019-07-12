'use strict';

/* globals MediaRecorder */

// Spec is at http://dvcs.w3.org/hg/dap/raw-file/tip/media-stream-capture/RecordingProposal.html

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;


if(getBrowser() == "Chrome"){
  var constraints = {"audio": true, "video": {  "mandatory": {  "minWidth": 640,  "maxWidth": 640, "minHeight": 480,"maxHeight": 480 }, "optional": [] } };//Chrome
}else if(getBrowser() == "Firefox"){
  var constraints = {audio: false, video: {  width: { min: 640, ideal: 640, max: 640 },  height: { min: 480, ideal: 480, max: 480 }}}; //Firefox
}

var recBtn = document.querySelector('button#rec');
var pauseResBtn = document.querySelector('button#pauseRes');
var stopBtn = document.querySelector('button#stop');

var videoElement = document.querySelector('video');
var dataElement = document.querySelector('#data');
var downloadLink = document.querySelector('a#downloadLink');

videoElement.controls = false;

function errorCallback(error){
  console.log('navigator.getUserMedia error: ', error);
}

/*
var mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
var sourceBuffer;
*/

var mediaRecorder;
var chunks = [];
var count = 0;

var wsurl = "ws://10.90.9.20:9080/RDConsumer/websocket"
var ws = null;

function createWs(){
  var url = wsurl;
  if ('WebSocket' in window) {
    ws = new WebSocket(url);
  } else if ('MozWebSocket' in window) {
    ws = new MozWebSocket(url);
  } else {
    console.log("您的浏览器不支持WebSocket。");
    return ;
  }
}
function init() {
  if (ws != null) {
    console.log("现已连接");
    return ;
  }
  createWs();
  ws.onopen = function() {
    //设置发信息送类型为：ArrayBuffer
    ws.binaryType = "arraybuffer";
  }
  ws.onmessage = function(e) {
    console.log(e.data.toString());
  }
  ws.onclose = function(e) {
    console.log("onclose: closed");
    ws = null;
    createWs(); //这个函数在这里之所以再次调用，是为了解决视频传输的过程中突发的连接断开问题。
  }
  ws.onerror = function(e) {
    console.log("onerror: error");
    ws = null;
    createWs(); //同上面的解释
  }
}

$(document).ready(function(){
  init();
})

function startRecording(stream) {
  log('Start recording...');
  if (typeof MediaRecorder.isTypeSupported == 'function'){
    /*
        MediaRecorder.isTypeSupported is a function announced in https://developers.google.com/web/updates/2016/01/mediarecorder and later introduced in the MediaRecorder API spec http://www.w3.org/TR/mediastream-recording/
    */
    //这里涉及到视频的容器以及编解码参数，这个与浏览器有密切的关系
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
      var options = {mimeType: 'video/webm;codecs=h264'};
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
      var options = {mimeType: 'video/webm;codecs=h264'};
    } else  if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
      var options = {mimeType: 'video/webm;codecs=vp8'};
    }
    log('Using '+options.mimeType);
    mediaRecorder = new MediaRecorder(stream, options);
  }else{
    log('isTypeSupported is not supported, using default codecs for browser');
    mediaRecorder = new MediaRecorder(stream);
  }

  pauseResBtn.textContent = "Pause";

  mediaRecorder.start(10);

  var url = window.URL || window.webkitURL;
  videoElement.src = url ? url.createObjectURL(stream) : stream;
  videoElement.play();

  //这个地方，是视频数据捕获好了后，会触发MediaRecorder一个dataavailable的Event，在这里做视频数据的采集工作，主要是基于Blob进行转写，利用FileReader进行读取。FileReader一定
  //要注册loadend的监听器，或者写onload的函数。在loadend的监听函数里面，进行格式转换，方便websocket进行数据传输，因为websocket的数据类型支持blob以及arrayBuffer，我们这里用
  //的是arrayBuffer，所以，将视频数据的Blob转写为Unit8Buffer，便于websocket的后台服务用ByteBuffer接收。
  mediaRecorder.ondataavailable = function(e) {
    //log('Data available...');
    //console.log(e.data);
    //console.log(e.data.type);
    //console.log(e);
    chunks.push(e.data);
    var reader = new FileReader();
    reader.addEventListener("loadend", function() {
      //reader.result是一个含有视频数据流的Blob对象
      var buf = new Uint8Array(reader.result);
      console.log(reader.result);
      if(reader.result.byteLength > 0){        //加这个判断，是因为有很多数据是空的，这个没有必要发到后台服务器，减轻网络开销，提升性能吧。
        ws.send(buf);
      }
    });
    reader.readAsArrayBuffer(e.data);
  };

  mediaRecorder.onerror = function(e){
    log('Error: ' + e);
  };


  mediaRecorder.onstart = function(){
    log('Started & state = ' + mediaRecorder.state);
  };

  mediaRecorder.onstop = function(){
    log('Stopped  & state = ' + mediaRecorder.state);

    var blob = new Blob(chunks, {type: "video/webm"});
    chunks = [];

    var videoURL = window.URL.createObjectURL(blob);

    downloadLink.href = videoURL;
    videoElement.src = videoURL;
    downloadLink.innerHTML = 'Download video file';

    var rand =  Math.floor((Math.random() * 10000000));
    var name  = "video_"+rand+".webm" ;

    downloadLink.setAttribute( "download", name);
    downloadLink.setAttribute( "name", name);
  };

  mediaRecorder.onpause = function(){
    log('Paused & state = ' + mediaRecorder.state);
  }

  mediaRecorder.onresume = function(){
    log('Resumed  & state = ' + mediaRecorder.state);
  }

  mediaRecorder.onwarning = function(e){
    log('Warning: ' + e);
  };
}

//function handleSourceOpen(event) {
//  console.log('MediaSource opened');
//  sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp9"');
//  console.log('Source buffer: ', sourceBuffer);
//}


//点击按钮，启动视频流的采集。重点是getUserMedia函数使用。本案例中，视频采集的入口，是点击页面上的record按钮，也就是下面这个函数的逻辑。
function onBtnRecordClicked (){
  if (typeof MediaRecorder === 'undefined' || !navigator.getUserMedia) {
    alert('MediaRecorder not supported on your browser, use Firefox 30 or Chrome 49 instead.');
  }else {
    navigator.getUserMedia(constraints, startRecording, errorCallback);
    recBtn.disabled = true;
    pauseResBtn.disabled = false;
    stopBtn.disabled = false;
  }
}

function onBtnStopClicked(){
  mediaRecorder.stop();
  videoElement.controls = true;

  recBtn.disabled = false;
  pauseResBtn.disabled = true;
  stopBtn.disabled = true;
}

function onPauseResumeClicked(){
  if(pauseResBtn.textContent === "Pause"){
    console.log("pause");
    pauseResBtn.textContent = "Resume";
    mediaRecorder.pause();
    stopBtn.disabled = true;
  }else{
    console.log("resume");
    pauseResBtn.textContent = "Pause";
    mediaRecorder.resume();
    stopBtn.disabled = false;
  }
  recBtn.disabled = true;
  pauseResBtn.disabled = false;
}


function log(message){
  dataElement.innerHTML = dataElement.innerHTML+'<br>'+message ;
}



//browser ID
function getBrowser(){
  var nVer = navigator.appVersion;
  var nAgt = navigator.userAgent;
  var browserName  = navigator.appName;
  var fullVersion  = ''+parseFloat(navigator.appVersion);
  var majorVersion = parseInt(navigator.appVersion,10);
  var nameOffset,verOffset,ix;

  // In Opera, the true version is after "Opera" or after "Version"
  if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
    browserName = "Opera";
    fullVersion = nAgt.substring(verOffset+6);
    if ((verOffset=nAgt.indexOf("Version"))!=-1)
      fullVersion = nAgt.substring(verOffset+8);
  }
  // In MSIE, the true version is after "MSIE" in userAgent
  else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
    browserName = "Microsoft Internet Explorer";
    fullVersion = nAgt.substring(verOffset+5);
  }
  // In Chrome, the true version is after "Chrome"
  else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
    browserName = "Chrome";
    fullVersion = nAgt.substring(verOffset+7);
  }
  // In Safari, the true version is after "Safari" or after "Version"
  else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
    browserName = "Safari";
    fullVersion = nAgt.substring(verOffset+7);
    if ((verOffset=nAgt.indexOf("Version"))!=-1)
      fullVersion = nAgt.substring(verOffset+8);
  }
  // In Firefox, the true version is after "Firefox"
  else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
    browserName = "Firefox";
    fullVersion = nAgt.substring(verOffset+8);
  }
  // In most other browsers, "name/version" is at the end of userAgent
  else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
    (verOffset=nAgt.lastIndexOf('/')) )
  {
    browserName = nAgt.substring(nameOffset,verOffset);
    fullVersion = nAgt.substring(verOffset+1);
    if (browserName.toLowerCase()==browserName.toUpperCase()) {
      browserName = navigator.appName;
    }
  }
  // trim the fullVersion string at semicolon/space if present
  if ((ix=fullVersion.indexOf(";"))!=-1)
    fullVersion=fullVersion.substring(0,ix);
  if ((ix=fullVersion.indexOf(" "))!=-1)
    fullVersion=fullVersion.substring(0,ix);

  majorVersion = parseInt(''+fullVersion,10);
  if (isNaN(majorVersion)) {
    fullVersion  = ''+parseFloat(navigator.appVersion);
    majorVersion = parseInt(navigator.appVersion,10);
  }
  return browserName;
}
