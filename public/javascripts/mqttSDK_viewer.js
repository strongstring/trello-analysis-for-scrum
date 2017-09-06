var observer = {
    handlers: {},
    register: function (eventName, handler,context) {
        var handlerArray = this.handlers[eventName];
        if (undefined === handlerArray) {
            handlerArray = this.handlers[eventName] = [];
        }
        handlerArray.push({ handler: handler, context: context });
    },
    unregister: function (eventName, handler, context) {
      var handlerArray = this.handlers[eventName],
          hidx,
          currentHandler;
      if (undefined === handlerArray)
          return ;
      for (hidx = 0; hidx < handlerArray.length; hidx++) {
          currentHandler = handlerArray[hidx];
          if (handler === currentHandler['handler'] && context === currentHandler['context']) {
              handlerArray.splice(hidx, 1);
              return ;
          }
      }
    },
    // 특정 상태가 변했을때 이벤트를 통보할 함수를 작성합니다.
    notify: function (eventName,hubId, data, destinationName) {
        var handlerArray = this.handlers[eventName],
            hidx,
            currentHandler;
        if (undefined === handlerArray) return;    
        
        for (hidx = 0; hidx < handlerArray.length; hidx++) {
            currentHandler = handlerArray[hidx];
            // Hub를 구분해서 message 처리 
            if(hubId == currentHandler.context.hubId ){
                currentHandler['handler'].call(currentHandler['context'], data,destinationName);
            }
        }
    }
};

// callback for receiving messagexrq
var onMessageArrived = function(message) {
    console.log("[HJKWON] onMessageArrived:" + message.destinationName + ' ClientId : ' + this.clientId );  
    console.dir(message);

    var requestId;

    if(message.destinationName.split('/')[4] == 'users'){
        requestId = message.destinationName.split('/')[6]
    }else{
        requestId = message.destinationName.split('/')[4]
    }

    // Topic을 구분해서 message 처리 
    if ( requestId == 'signal' ) {   
        observer.notify("signal",message.destinationName.split('/')[1],message.payloadString,message.destinationName);
    }else if(  requestId = 'connection' ) {
        observer.notify("connect",message.destinationName.split('/')[1],message.payloadString,message.destinationName);
    }


    // // Topic을 구분해서 message 처리 
    // if (message.destinationName.indexOf('signal') > 0 ) {
    //     // console.log(message.destinationName.split('/')[1])
    //     // observer.notify("signal",this.clientId,message.payloadString,message.destinationName);
    //     observer.notify("signal",message.destinationName.split('/')[1],message.payloadString,message.destinationName);
    // }else if(message.destinationName.indexOf('connection') > 0 ) {
    //     // console.log(message.destinationName.split('/')[1])
    //     // observer.notify("connect",this.clientId,message.payloadString,message.destinationName);
    //     observer.notify("connect",message.destinationName.split('/')[1],message.payloadString,message.destinationName);
    // }
}

var failConnect = function (e){
    console.log("[HJKWON] connect failed");
    console.log(e);
}

var onConnect =  function (){
    var contime = performance.now() - t0;
    console.log("[HJKWON] onConnect : " + this.clientId + ",connection time : " +  contime);  
    this.onMessageArrived = onMessageArrived.bind(this);
    for(i=this.subTopic.length; i--;){
        this.subscribe(this.subTopic[i]);
        console.log("[HJKWON] " + this.clientId +" Subscribes : " + this.subTopic[i])
    } 
}

var mqttClients =[];
var getMqttClient = function(uuid){
    var hidx;
    for (hidx = 0; hidx < mqttClients.length; hidx++) {
        if (mqttClients[hidx].mqttClientId == uuid) 
            return hidx;
    }
    return -1;
}

var signalHandler = function(hub_id,device_id,user_id){
    this.hubId = hub_id;
    this.userId = user_id;
    this.deviceId = device_id;
};

var onRemoteStreamAdded = function(event) {
  console.log("Added remote stream");
  console.dir(event.stream)
  console.log(this);
  $('#'+this.hubId + "_" + this.deviceId).attr('src', webkitURL.createObjectURL(event.stream));
  $('#'+this.hubId + "_" + this.deviceId)[0].play();
  $('#'+this.hubId + "_" + this.deviceId)[0].autoplay = true;
}

signalHandler.prototype.buildTopic = function(type){
    if(type === "sub"){
        return "hubs/"+this.hubId+"/devices/"+this.deviceId+"/users/"+this.userId+"/signal";  
    }else if(type == "pub"){
        return "hummingbird/hubs/"+this.hubId+"/devices/"+this.deviceId+"/users/"+this.userId+"/signal";
    }else{
        return null
    }
    
}

signalHandler.prototype.prepareNewConnection =  function() {
    var pc_config = {"iceServers" :[{"urls":["turn:173.194.72.127:19305?transport=udp","turn:[2404:6800:4008:C02::7F]:19305?transport=udp","turn:173.194.72.127:443?transport=tcp","turn:[2404:6800:4008:C02::7F]:443?transport=tcp"],"username":"CP+UkbwFEgYD6JFBxo8Yzc/s6OMT","credential":"PcA9lisVrYtYGwJhL8xUX8H6qlI="},{"urls":["stun:stun.l.google.com:19302"]}]}
    try {
        // this.peer  = new webkitRTCPeerConnection(pc_config,{'optional': [{'DtlsSrtpKeyAgreement': 'false'}]});
        this.peer  = new webkitRTCPeerConnection(pc_config);
    } catch (e) {
        console.log("[HJKWON] Failed to create peerConnection, exception: " + e.message);
    }

    this.peer.onicecandidate = function (evt) {
        console.log("[HJKWON] onicecandidate")
        if (evt.candidate) {
            console.log("[HJKWON] local candidate :" + evt.candidate);
            this.sendIceTextMQTT.call(this, this.buildTopic("pub"), evt.candidate);
        } else {
            console.log("[HJKWON] ice event phase =" + evt.eventPhase);
        }
    }.bind(this)
  
    this.peer.oniceconnectionstatechange = function() {
        console.log('[HJKWON] ice connection status=' + this.peer.iceConnectionState + ' gahter=' + this.peer.iceGatheringState);
        if ('completed' === this.peer.iceConnectionState) {
           console.log("[HJKWON] candidate complete");
        }
    }.bind(this)

    this.peer.onsignalingstatechange = function() {
        console.log('[HJKWON] signaling status=' + this.peer.signalingState);
    }.bind(this)


    this.peer.addEventListener("addstream", onRemoteStreamAdded.bind(this), false);
    // this.peer.addEventListener("removestream", onRemoteStreamRemoved, false)


// function onRemoteStreamAdded(event) {
//   console.log("Added remote stream");
//   console.dir(event.stream)
//   console.log(this);
//   $('#'+this.hubId + "_" + this.deviceId).attr('src', webkitURL.createObjectURL(event.stream));
//   $('#'+this.hubId + "_" + this.deviceId)[0].play();
//   $('#'+this.hubId + "_" + this.deviceId)[0].autoplay = true;
// }

// // when remote removes a stream, remove it from the local video element
// function onRemoteStreamRemoved(event) {
//   console.log("Remove remote stream");
//   remoteVideo.src = "";
// }

}


signalHandler.prototype.listen = function(text,destinationName){   
    var signal = JSON.parse(text),
        candidate, 
        answer ;
    
    console.log("[HJKWON] peer listen called by noti: " + destinationName + "   and deviceId : "+ this.deviceId );

    // device를 구분해서 message 처리 
    if(destinationName.split('/')[3] == this.deviceId){
        console.log("[HJKWON] it is called by listen: " + destinationName + "   and deviceId : "+ this.deviceId );
        if (! this.peer) {
            console.error('peerConnection NOT exist!');
            return;
        }

        if(signal.type == "offer" || signal.type == 'answer'){
            answer = new RTCSessionDescription(signal);
            this.peer.setRemoteDescription(answer);
            console.log("[HJKWON] Set Remote SDP: ", JSON.stringify(answer ));
        }else{
            candidate = new RTCIceCandidate(signal),
            this.peer.addIceCandidate(candidate);
            console.log("[HJKWON] Set Remote candidate  :" + JSON.stringify( candidate ));
        }
    }
}

signalHandler.prototype.makeOffer = function() {  
    console.log("setLocalDescription")
    this.prepareNewConnection.call(this); 
    this.peer.createOffer(function (sessionDescription) { // in case of success
        this.peer.setLocalDescription(sessionDescription);
        console.log("Sending: offer SDP, type : "+this.peer.localDescription.type);
        this.sendSDPTextMQTT.call(this, this.buildTopic("pub"), this.peer.localDescription);}.bind(this) 
    ,function () { console.log("Create Offer failed")} // in case of error 
    ,{'mandatory': {'OfferToReceiveAudio':false, 'OfferToReceiveVideo':true }})
}

signalHandler.prototype.sendSDPTextMQTT = function(topic,RTCSessionDescription){
    var message = new Paho.MQTT.Message(JSON.stringify(RTCSessionDescription)),
    index = getMqttClient(this.hubId);   
    message.destinationName = topic;    
    
    if( index != -1){
        mqttClients[index].client.send(message);  
    }else{
        console.log("[HJKWON] There is no Paho Client")
    }  
}

signalHandler.prototype.sendIceTextMQTT = function(topic, RTCIceCandidate){
    var message = new Paho.MQTT.Message(JSON.stringify(RTCIceCandidate)),
        index = getMqttClient(this.hubId);
    
    message.destinationName = topic
    
    if( index != -1){
       mqttClients[index].client.send(message);  
    }else{
        console.log("[HJKWON] There is no Paho Client")
    }  
}


var connectHandler = function(hub_id){
    this.hubId = hub_id;
    // this.userId = user_id;
    // this.deviceId = device_id;
};

connectHandler.prototype.buildTopic = function(type){
    if(type === "sub"){
        // return "hubs/"+this.hubId+"/devices/"+this.deviceId+"/users/"+this.userId+"/connection";  
        return "hubs/"+this.hubId+"/connection";  
    }else if(type == "pub"){
        // return "hummingbird/hubs/"+this.hubId+"/devices/"+this.deviceId+"/users/"+this.userId+"/signal";
        return null
    }else{
        return null
    }   
}

connectHandler.prototype.listen = function(text,destinationName){   
    var presenceMsg = JSON.parse(text)
    console.log("[HJKWON] ConnectionHandler listen called by noti: " + destinationName + "   and deviceId : "+ this.deviceId );

    if(presenceMsg.presence.hub == false){
        //Hub 가 끊어진 경우다, 해당 허브의 모든 Ch은 off
        $('#'+this.hubId + "_" + "ch01"+"_play").attr("disabled",true);  
        $('#'+this.hubId + "_" + "ch02"+"_play").attr("disabled",true);  
    }else{
        if(presenceMsg.presence.ch01 == true){
          $('#'+this.hubId + "_" + "ch01"+"_play").attr("disabled",false);  
        }else if(presenceMsg.presence.ch01 == false){
          $('#'+this.hubId + "_" + "ch01"+"_play").attr("disabled",true);  
        }
        
        if(presenceMsg.presence.ch02 == true){
          $('#'+this.hubId + "_" + "ch02"+"_play").attr("disabled",false);    
        }else if(presenceMsg.presence.ch01 == false){
          $('#'+this.hubId + "_" + "ch02"+"_play").attr("disabled",true);    
        }
    }

}



var commandHandler = function(hub_id,device_id,user_id){
    this.hubId = hub_id;
    this.userId = user_id;
    this.deviceId = device_id;
};

commandHandler.prototype.buildTopic = function(type,protocalType){
    if(type === "sub"){
        if(protocalType === undefined)
            return "hubs/"+this.hubId+"/devices/"+this.deviceId+"/users/"+this.userId+"/command";
        else   // protocalType이 정해진 타입이 아닌 경우에 대한 ERROR 처리 필요 EX)IPC,SUNAPI 
            return "hubs/"+this.hubId+"/devices/"+this.deviceId+"/users/"+this.userId+"/command/"+protocalType;
    }else if(type == "pub"){
        if(protocalType === undefined)
            return "hummingbird/hubs/"+this.hubId+"/devices/"+this.deviceId+"/users/"+this.userId+"/command";
        else   // protocalType이 정해진 타입이 아닌 경우에 대한 ERROR 처리 필요 EX)IPC,SUNAPI 
            return "hummingbird/hubs/"+this.hubId+"/devices/"+this.deviceId+"/users/"+this.userId+"/command/"+protocalType;
    }else{
        // ERROR 처리 필요함
        return null
    }   
}


commandHandler.prototype.sendCommand = function(topic,parameter){
    // 전달받은 paremeter에 대한 error 처리 필요함, 제대로 된 parameter가 입력된다고 가정함
    var message = new Paho.MQTT.Message(JSON.stringify({
        method : parameter.method,
        command : parameter.command,
        uri : parameter.uri,
        header : parameter.header,
        body : ""
    })),
    index = getMqttClient(this.hubId);
    message.destinationName = topic
    console.dir(message);    

    if( index != -1){
       mqttClients[index].client.send(message);  
    }else{
        console.log("[HJKWON] There is no Paho Client")
    }  

}


var messageHandler = function(hub_id,device_id){
    this.hubId = hub_id;
    // this.userId = user_id;
    this.deviceId = device_id;
};

messageHandler.prototype.buildTopic = function(type,protocalType){
    if(type === "sub"){
        return "hubs/"+this.hubId+"/devices/"+this.deviceId+"/message";
    // }else if(type == "pub"){
    //     return "hummingbird/hubs/"+this.hubId+"/devices/"+this.deviceId+"/users/"+this.userId+"/command";
    }else{
        // ERROR 처리 필요함
        return null
    }   
}





//  핸들러 생성
var signalHandler_1 = new signalHandler("hub01",'ch01',user);
var signalHandler_2 = new signalHandler("hub01",'ch02',user);
var connectHandler_1 = new connectHandler("hub01");
var commandHandler_1 = new commandHandler("hub01",'ch01',user);
var messageHandler_1 = new messageHandler("hub01",'ch01');
var messageHandler_2 = new messageHandler("hub01",'ch02');


var signalHandler_hub02_ch01 = new signalHandler("hub02",'ch01',user);
var connectHandler_hub02 = new connectHandler("hub02");

// observer에 핸들러 등록
observer.register("signal",signalHandler_1.listen,signalHandler_1);
observer.register("signal",signalHandler_2.listen,signalHandler_2);
observer.register("signal",signalHandler_hub02_ch01.listen,signalHandler_hub02_ch01);
observer.register("connect",connectHandler_1.listen,connectHandler_1);
observer.register("connect",connectHandler_hub02.listen,connectHandler_hub02);
observer.register("command",commandHandler_1.listen,commandHandler_1);
observer.register("message",messageHandler_1.listen,messageHandler_1);
observer.register("message",messageHandler_2.listen,messageHandler_2);


// mqttClient manager에  Subcribe 목록 전달
mqttClients.push({ mqttClientId : 'hub01', client: new Paho.MQTT.Client('wss://mobile.gaialab.co.kr/:443', 'client-'+randomString(6)) });
mqttClients[0].client.subTopic = [];
mqttClients[0].client.subTopic.push(signalHandler_1.buildTopic('sub'))
mqttClients[0].client.subTopic.push(signalHandler_2.buildTopic('sub'))
mqttClients[0].client.subTopic.push(connectHandler_1.buildTopic('sub'))
mqttClients[0].client.subTopic.push(commandHandler_1.buildTopic('sub','SUNAPI25'))
mqttClients[0].client.subTopic.push(messageHandler_1.buildTopic('sub'))
mqttClients[0].client.subTopic.push(messageHandler_2.buildTopic('sub'))


mqttClients.push({ mqttClientId : 'hub02', client: new Paho.MQTT.Client('wss://mobile.gaialab.co.kr/:443', 'client-'+randomString(6)) });
mqttClients[1].client.subTopic = [];
mqttClients[1].client.subTopic.push(signalHandler_hub02_ch01.buildTopic('sub'))
mqttClients[1].client.subTopic.push(connectHandler_hub02.buildTopic('sub'))



// mqtt 서버 접속
mqttClients[0].client.connect({userName: user, password: 'openwd', onSuccess: onConnect.bind(mqttClients[0].client), 
                  onFailure: failConnect,useSSL: true, keepAliveInterval: 10 });

mqttClients[1].client.connect({userName: user, password: 'openwd', onSuccess: onConnect.bind(mqttClients[1].client), 
                  onFailure: failConnect,useSSL: true, keepAliveInterval: 10 });  




var t0 = performance.now();




