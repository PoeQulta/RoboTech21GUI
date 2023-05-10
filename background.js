var _this = {ports:"",connectionId:"",};
let decoder = new TextDecoder();
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('window.html', {
    'outerBounds': {
      'width': 800,
      'height': 600
    }
  },function(window){ window.onClosed.addListener(function(){
    chrome.sockets.udp.getSockets(function(sockets)
    {
      for (var i = sockets.length - 1; i >= 0; i--) {
        chrome.sockets.udp.close(sockets[i].socketId,function(){});
        console.log(sockets[i]);
      }
  });})});
});

// chrome.sockets.udp.bind(socketId,"127.0.0.1",8090, function(result){ if (result <0) console.log("error"); return;});
/*
function update() {
  buffer = bytes(info.data)
        chrome.sockets.udp.send(socketId, buffer,
            IPAddress, PortNumber, function(sendInfo) {
              console.log("sent " + sendInfo.bytesSent);});
} 
*/