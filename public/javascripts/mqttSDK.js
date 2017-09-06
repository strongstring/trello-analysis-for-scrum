
var client;
var userName = "mosquitto1";

var WebrtcSDK = function(loadingParams)
{
  this.params = loadingParams;
}


WebrtcSDK.prototype.login = function(){
  console.dir(this.params);
  client = new Paho.MQTT.Client(this.params.mqttServerIP, this.params.id);
  var lastWill = new Paho.MQTT.Message(JSON.stringify({presence:{hub:false}}));
  lastWill.destinationName = 'hubs/'+hubId+'/connection';
  lastWill.qos = 0;
  lastWill.retained = true;

  client.connect({"userName": userName, password: this.params.password,willMessage: lastWill , onSuccess: this.onConnect, 
                  onFailure: this.failConnect,useSSL: false, keepAliveInterval: 10 });
}


WebrtcSDK.prototype.failConnect = function (e){
   console.log("connect failed");
   console.log(e);
}

WebrtcSDK.prototype.onConnect =  function (){
   console.log("onConnect");
   $('#join').attr("disabled",false);
   // console.dir(this)
   // subscribe("offer");
}
 

WebrtcSDK.prototype.join = function(peerid){
  console.log("join");

  if(peerid === 'camera'){
    this.params.type = 'camera'
    this.subscribe("offer")
    this.startVideo();

    var message = new Paho.MQTT.Message(JSON.stringify({presence:{hub:true,ch01:true,ch02:true,ch03:true,ch04:true}}));
    message.destinationName = 'hubs/'+hubId+'/connection'
    
    message.retained = true;
    client.send(message)


  }else if(peerid !== 'camera'){
    console.log("send message")
    this.params.type = 'user'
    this.makeOffer(); 
  }

}



WebrtcSDK.prototype.subscribe = function(waitType) {
  console.log("hjkwon called subscribe")
  console.dir(this)
  // set callback
  client.onMessageArrived = this.onMessageArrived.bind(this);
   // Subscribe
  // var topic = this.buildTopic(waitType,this.params.user_name);
  // var topic = 'hummingbird/hub/device/signal/hub_01/ch_01/techwin_a'
  var topic = 'hummingbird/hubs/'+hubId+'/devices/'+chId+'/users/'+userName+'/signal'
  console.log(topic);
  client.subscribe(topic);
}


WebrtcSDK.prototype.buildTopic = function(signalingType, user_name) {
  var topic = user_name + '/signaling/' + signalingType;
  return topic;
}

  // callback for receiving message
WebrtcSDK.prototype.onMessageArrived = function(message) {
  
    if (message.destinationName.indexOf('signal')) { 
        var signal = JSON.parse(message.payloadString);
        if(signal.type == "offer" || signal.type == 'answer'){
          console.log("call -------------  set remote sdp ")
          if (this.peerConnection) {
            console.error('peerConnection alreay exist!');
          }
          this.peerConnection = this.prepareNewConnection();
          var offer = new RTCSessionDescription(signal);
          
          this.peerConnection.setRemoteDescription(offer,this.makeAnswer.bind(this));
          console.log("hjkwon set remote description ");
          console.log("REMOTE description", offer);
        }
        else{

          if (!this.peerConnection) {
            console.error('no peerConnection !!!!!!!!!!!!!!');
          }
          console.log(this.peerConnection.remoteDescription.type);
          var candidate = new RTCIceCandidate(signal);
          this.peerConnection.addIceCandidate(candidate);
          console.log("set remote candidate " + JSON.stringify(candidate));
        }
  }
  else {
    console.warn('Bad SDP topic');
    console.dir(message);
  }
}


WebrtcSDK.prototype.setIce= function(text) {
  if (!this.peerConnection) {
    console.error('no peerConnection !!!!!!!!!!!!!!');
  }
  console.log('set candidate !!!!!!!!!!!!!!   '+ text);
  console.dir(JSON.parse(text))
  // var candidate = new RTCIceCandidate(text);
  
  // this.peerConnection.addIceCandidate(candidate);
}


WebrtcSDK.prototype.onAnswerText= function(text){
  console.log("Received answer text...")
  console.log(text);
  console.dir(this);
  this.setAnswerText(text);
}  

WebrtcSDK.prototype.prepareNewConnection = function() {
// var pc_config = {"iceServers":[]};
var pc_config = {"iceServers" :[{"urls":["turn:173.194.72.127:19305?transport=udp","turn:[2404:6800:4008:C02::7F]:19305?transport=udp","turn:173.194.72.127:443?transport=tcp","turn:[2404:6800:4008:C02::7F]:443?transport=tcp"],"username":"CP+UkbwFEgYD6JFBxo8Yzc/s6OMT","credential":"PcA9lisVrYtYGwJhL8xUX8H6qlI="},{"urls":["stun:stun.l.google.com:19302"]}]}
//  var pc_config = {"iceServers":[{ "url": "stun:stun.l.google.com:19302" },]};
  var peer = null;
  try {
    peer = new webkitRTCPeerConnection(pc_config);
  } catch (e) {
    console.log("Failed to create peerConnection, exception: " + e.message);
  }

  // send any ice candidates to the other peer
  peer.onicecandidate = function (evt) {
    console.log("onicecandidate", evt)
    if (evt.candidate) {
      console.log("send local candidate :" + JSON.stringify(evt.candidate));
      this.sendIceTextMQTT(evt.candidate);
    } else {
    console.log("ice event phase =" + evt.eventPhase);
    // this.sendSDPTextMQTT(this.peerConnection.localDescription.type, this.peerConnection.localDescription.sdp);
    }
  }.bind(this);

  peer.oniceconnectionstatechange = function() {
    console.log('ice connection status=' + peer.iceConnectionState + ' gahter=' + peer.iceGatheringState);
    if ('completed' === peer.iceConnectionState) {
    console.log("candidate complete");
    }
  };

  peer.onsignalingstatechange = function() {
    console.log('signaling status=' + peer.signalingState);
  };

  if(this.params.type === "camera"){
    console.log('Adding local stream...');
    peer.addStream(this.params.localStream);
  }
  
  peer.addEventListener("addstream", onRemoteStreamAdded.bind(this), false);
  peer.addEventListener("removestream", onRemoteStreamRemoved, false)

  // when remote adds a stream, hand it on to the local video element
  function onRemoteStreamAdded(event) {
    console.log("Added remote stream");
    console.dir(event.stream)
    console.log(this);
    this.params.remoteVideo.attr('src', webkitURL.createObjectURL(event.stream));
    this.params.remoteVideo[0].play();
    this.params.remoteVideo[0].autoplay = true;

  }

  // when remote removes a stream, remove it from the local video element
  function onRemoteStreamRemoved(event) {
    console.log("Remove remote stream");
    remoteVideo.src = "";
  }

  return peer;
}

function wait(msecs)
{
var start = new Date().getTime();
var cur = start;
while(cur - start < msecs)
{
cur = new Date().getTime();
}
}




WebrtcSDK.prototype.makeOffer = function() {
   
   this.subscribe("answer");
   this.peerConnection = this.prepareNewConnection();
   // this.peerConnection.createOffer(function (sessionDescription) { // in case of success
   //  console.log("setLocalDescription")
   //  console.dir(this)
   //  this.peerConnection.setLocalDescription(sessionDescription);
   //  console.log("Sending: offer SDP, type : "+this.peerConnection.localDescription.type);
   //  console.log(sessionDescription);
   //  this.sendSDPTextMQTT(this.peerConnection.localDescription);
   // }.bind(this) , function () { // in case of error
   //  console.log("Create Offer failed");
   // }, this.params.mediaConstraints);

}

WebrtcSDK.prototype.makeAnswer = function(evt) {
   
   if (! this.peerConnection) {
    console.error('peerConnection NOT exist!');
    return;
   }
   console.log("hello why???")
// console.log("hello")
//    wait(1000);
//    console.log("kwon")

   this.peerConnection.createAnswer(function (sessionDescription) { // in case of success
    this.peerConnection.setLocalDescription(sessionDescription);
    console.log("-set local description");
    // console.log("Sending: Answer SDP + type : " + this.peerConnection.localDescription.type );
    // console.log(sessionDescription);
    this.sendSDPTextMQTT(this.peerConnection.localDescription);
   }.bind(this), function () { // in case of error
    console.log("Create Answer failed");
   }, this.params.mediaConstraints);
}

WebrtcSDK.prototype.setAnswerText= function(text) {
   if (! this.peerConnection) {
    console.error('peerConnection NOT exist!');
    return;
   }
   var answer = new RTCSessionDescription({
    type : 'answer',
    sdp : text,
   });
   this.peerConnection.setRemoteDescription(answer);
}


WebrtcSDK.prototype.startVideo = function() {
 var mediaConstraints = {video: { width:{min:1280}, height: {min:720}, frameRate: { ideal: 10, min: 15 } }, audio: false}
 requestUserMedia(mediaConstraints).then(function(stream) {
  console.log("Got access to local media with mediaConstraints:\n" + "  '" + JSON.stringify(mediaConstraints) + "'");
  console.dir(this) 
  this.params.localVideo.attr('src', webkitURL.createObjectURL(stream));
  this.params.localVideo[0].play();
  this.params.localVideo[0].autoplay = true;
  this.params.localStream = stream;
  // this.onUserMediaSuccess_(stream);
 }.bind(this)).catch(function(error) {
  // this.onError_("Error getting user media: " + error.message);
  // this.onUserMediaError_(error);
 }.bind(this));
}


WebrtcSDK.prototype.sendSDPTextMQTT = function(RTCSessionDescription){
  // //  var topic = this.buildTopic(type,this.params.user_name);
  // // var topic = 'hub_01/signaling/answer'
  // var topic = 'hub/device/signal/hub_01/ch_01/techwin_a'
  //  message = new Paho.MQTT.Message(text);
  //  message.destinationName = topic;
  //  client.send(message);

    var message = new Paho.MQTT.Message(JSON.stringify(RTCSessionDescription));
    // message.destinationName = 'hub/device/signal/hub_01/ch_01/techwin_a'
    message.destinationName = 'hubs/'+hubId+'/devices/'+chId+'/users/'+userName+'/signal'
    client.send(message)

}


WebrtcSDK.prototype.sendIceTextMQTT = function(RTCIceCandidate){
  // var topic = this.buildTopic(type,this.params.user_name);
  // var topic = 'hub/device/signal/hub_01/ch_01/techwin_a'
  var topic = 'hubs/'+hubId+'/devices/'+chId+'/users/'+userName+'/signal'
  //  message = new Paho.MQTT.Message(text);
   var message = new Paho.MQTT.Message(JSON.stringify(RTCIceCandidate));
   message.destinationName = topic;
   client.send(message);
}


function requestUserMedia(constraints) {
  return new Promise(function(resolve, reject) {
    var onSuccess = function(stream) {
      resolve(stream);
    };
    var onError = function(error) {
      reject(error);
    };
    try {
      navigator.webkitGetUserMedia(constraints, onSuccess, onError);
    } catch (e) {
      reject(e);
    }
  });
}




// // stop local video
// function stopVideo() {
//   localVideo.src = "";
//   localStream.stop();
// }

//   function unsubscribe(waitType) {
//    // UnSubscribe 
//    var topic = buildTopic(waitType);
//    client.unsubscribe(topic);
//   }

// function onSDPText() {
// var text = textToReceiveSDP.value;
// if (peerConnection) {
// onAnswerText(text);
// }
// else {
// onOfferText(text);
// }
// textToReceiveSDP.value ="";
// }  



//   function sendSDPText(text) {
//    console.log("---sending sdp text ---");
//    console.log(text);

//    textForSendSDP.value = text;
//    textForSendSDP.focus();
//    textForSendSDP.select();
//   }

//   function hangUp() {
//    console.log("Hang up.");
//    stop();
//   }

//   function stop() {
//    peerConnection.close();
//    peerConnection = null;
//    peerStarted = false;
//   }


  




