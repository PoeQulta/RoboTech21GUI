class UDPsocket{
    constructor(IPAddress, PortNumber, targetIp,targetPort, onReceive){
      self = this
      self.IPAddress = IPAddress;
      self.PortNumber = PortNumber;
      self.targetIp = targetIp;
      self.targetPort= targetPort;
      self.id;
      self.onReceive = onReceive;
      self.callback = function(){console.log("connected");};
      self.connected = false;
      this.onCreated = function(info){
          self.id = info.socketId;
          console.log("Created");
          chrome.sockets.udp.bind(self.id, self.IPAddress, self.PortNumber, self.callback);
          //self.callback();
          self.connected = true;
        }
      this.setUp =  function (callback){
          self.callback = callback;
        // Create the Socket
       chrome.sockets.udp.onReceive.addListener(self.onReceive);
       self.socket = chrome.sockets.udp.create({persistent:true}, this.onCreated);
      }
      this.send = function(data){
          if(self.connected)
           chrome.sockets.udp.send(self.id, data,self.targetIp,self.targetPort, function(sendinfo){console.log("sent")});
        }
      }
     }