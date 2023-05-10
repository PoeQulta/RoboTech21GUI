var haveEvents = 'ongamepadconnected' in window;
var controllers = {};

class JoyHandler{
  constructor()
  {

    this.controllers = {};
    var self = this;
    self.motors = [];
    self.buttons = [];
    self.axes = [0,0,0,0];
    this.initDisplay = function(gamepad){
      var d = document.createElement("div");
      d.setAttribute("id", "controller" + gamepad.index);
    
      var t = document.createElement("h1");
      t.appendChild(document.createTextNode("Gamepad: " + gamepad.id));
      d.appendChild(t);
    
      var a = document.createElement("div");
      a.className = "axes";
    
      var b = document.createElement("div");
      b.className = "buttons";
    
      for (var i = 0; i < 6; i++) {
        var e = document.createElement("span");
        e.className = "button";
        b.appendChild(e);
      }
    
      d.appendChild(b);
      
      for (var i = 0; i < 6; i++) {
        var p = document.createElement("div");
        p.className = "axis";
        a.appendChild(p);
      }
    
      d.appendChild(a);
    
      var start = document.getElementById("start");
      if (start) {
        start.style.display = "none";
      }
    
      document.body.appendChild(d);
    };
    this.updateDisplay = function(motors,joybuttons,j)
    {
      var d = document.getElementById("controller" + j);
      var buttons = d.getElementsByClassName("button");
      var axes = d.getElementsByClassName("axis");
      for(var i=0; i<6; i++)
          {
            buttons[i].innerHTML = "Button " + i + ": " + joybuttons[i].value;
            axes[i].innerHTML = "Motor "+ i + ": " + motors[i];
          }
    };
    this.scangamepads = function() {
      var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
      for (var i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
          if (gamepads[i].index in self.controllers) {
            self.controllers[gamepads[i].index] = gamepads[i];
          } else {
            self.addgamepad(gamepads[i]);
          }
        }
      }
    }

    this.addgamepad = function (e){
      
      var gamepad = e.gamepad;
      self.controllers[gamepad.index] = gamepad;
      self.initDisplay(gamepad);
      requestAnimationFrame(self.updateStatus);
      
    };
    this.updateStatus =  function() {
      
      if (!haveEvents) {
        self.scangamepads();
      }
    
      for (var j in self.controllers) {
        if(self.controllers[j].id == "Logitech Extreme 3D (Vendor: 046d Product: c215)")
        {
          var controller = self.controllers[j];
          
          
    
          const motors = new Array();
          var y = controller.axes[1].toFixed(4);  // Joystick up and down
          
          var x = controller.axes[0].toFixed(4);  // Joystick left and righ
          if(Math.abs(y)<0.125)
            y = 0;
          if(Math.abs(x)<0.125)
            x = 0;
          var r = controller.axes[5].toFixed(4);  // Joystick rotation
          (r < 0.125 && r > -0.4) ? r=0 : r=r;    // Rotation deadzone (difference btw +ve and -ve is a fault in the joystick)
          var h = controller.axes[6].toFixed(4);  // Joystick height
          Math.abs(h) < 0.3 ? h=0 : h=h;    // Height deadzone
          var p = controller.axes[9].toFixed(1);  // Joystick pitch
          var resultantForce = Math.sqrt((y**2)+(x**2));  // Resultant of Y and X
          var theta = Math.atan2(-y,x).toFixed(4);  // Angle of resultant
          var thetaRelative = theta - 0.25*Math.PI;   // Angle relative to thrusters
    
          var factor = Math.max(Math.abs(x),Math.abs(y)) == Math.abs(x) ? x : -y ;
    
          var resultantY = parseInt(((resultantForce*Math.sin(thetaRelative))*(1/resultantForce*Math.abs(factor)))*400+1500);
          var resultantX = parseInt(((resultantForce*Math.cos(thetaRelative))*(1/resultantForce*Math.abs(factor)))*400+1500);
    
          if(Math.abs(resultantY-resultantX) < 100)  // Vertical clipping
            resultantX = resultantY;
    
          if(Math.abs(Math.abs(resultantY-1500)-Math.abs(resultantX-1500)) < 100)  // Horizontal clipping
          {
            if(resultantX < 1500)
              resultantX = 1500 - Math.abs(resultantY-1500);
            else
              resultantX = 1500 + Math.abs(resultantY-1500);
          }
    
          if(Math.abs(factor) > Math.abs(r)){ // Set motor values for axes 0 and 1
            for(var i=0; i<4; i++)
              i%2 ? motors[i] = resultantY : motors[i] = resultantX;
          }
          else{
            for(var i=0; i<4; i++)
              i==0||i==3 ? motors[i] = parseInt(r*400+1500) : motors[i] = parseInt(-r*400+1500);
          }
    
          if(p == 1.3) // No input on pitch, so prioritize height
          {
            motors[4] = parseInt(-h*400+1500);
            motors[5] = motors[4];
          }
          else  // Pitch input reaction
          {
            if(p==0.7)
              { motors[4] = 1900; motors[5] = 1100; }
            else if(p==-0.4)
              { motors[4] = 1100; motors[5] = 1900; }
            else
              { motors[4] = 1500; motors[5] = 1500; }
          }
    
          self.updateDisplay(motors, controller.buttons,j);
          self.motors = motors;
          //console.log(motors);
          self.buttons = controller.buttons;
          self.axes = [x,y,r,h,p]
        }
      }
      
      requestAnimationFrame(self.updateStatus);
    };
  } 

static removegamepad(gamepad) {
  var d = document.getElementById("controller" + gamepad.index);
  document.body.removeChild(d);
  delete this.controllers[gamepad.index];
}
static  disconnecthandler(e) {
    removegamepad(e.gamepad);
  }
}
var onrecieve = function(){}
var joy = new JoyHandler();
var socket = new UDPsocket("192.168.1.200",4321,"192.168.1.7",4321,onrecieve);

const buffer = new ArrayBuffer(25);
const motorBuffer = new ArrayBuffer(2);
const twoByteView = new Int16Array(motorBuffer);  //motors[0] to motors[5] with 3 bytes each
const byteView = new Int8Array(buffer);
const motorByteView = new Int8Array(motorBuffer);

window.addEventListener("gamepadconnected", joy.addgamepad);
window.addEventListener("gamepaddisconnected", JoyHandler.disconnecthandler);

if (!haveEvents) {
 setInterval(JoyHandler.scangamepads, 500);
}
var startSending = function(){
setInterval(function (){
  for(var i=0; i<12; i+=2)
  { 
      twoByteView[0] = joy.motors[i/2];
      
      byteView[i] = motorByteView[0]
      byteView[i+1] = motorByteView[1]
    
  }
  socket.send(buffer);
},10);
}

socket.setUp(startSending);