// get input from com-port
var _ = document;
var btnUdpSubmit = _.getElementById('btnUdpSubmit'),
    TargetIP = "192.168.1.7",
    TargetPort = "4321",
    IP = "192.168.1.100",
    Port = "4321";
    

const btnUdpHandle = function (e) {
  if (_.getElementById('UdpIpTarget').value != " "){
    TargetIP = _.getElementById('UdpIpTarget').value;
  }
    
  if (_.getElementById('UdpPortTarget').value != " "){
    TargetPort = _.getElementById('UdpPortTarget').value;
  }

  if (_.getElementById('UdpIpSelf').value != " "){
    IP = _.getElementById('UdpIpSelf').value;
  }

  if (_.getElementById('UdpPortSelf').value != " "){
    Port = _.getElementById('UdpPortSelf').value;
  }
   
  //console.log(TargetIP);
    
}
console.log(btnUdpSubmit.addEventListener("click", btnUdpHandle));

setInterval(
  function(){
  for (let i = 0; i < 6; i++){
    document.getElementById("motor-"+i).innerHTML = joy.motors[i];
  }
},50);

setInterval(
  function(){
    for (let i = 0; i < 12; i++){
      if (joy.buttons.length == 0){
        document.getElementById("chkboxBtn"+i).checked = false;
      }
      else{
        document.getElementById("chkboxBtn"+i).checked = joy.buttons[i].value;
        
      }
    }
    for (let i = 0; i < 4; i++){
        document.getElementById("Axis-"+i).innerHTML = joy.axes[i];
      }
    
},50);



  //console.log(joyHandler.motors);


//let udpSocket = new UDPsocket(IP, Port, TargetIP, TargetPort);


//btnUdpSubmit.addEventListener("click", function(){console.log("Test");});


// Convert time to a format of hours, minutes, seconds, and milliseconds

function timeToString(time) {
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);
  
    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);
  
    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);
  
    let diffInMs = (diffInSec - ss) * 100;
    let ms = Math.floor(diffInMs);
  
    let formattedMM = mm.toString().padStart(2, "0");
    let formattedSS = ss.toString().padStart(2, "0");
    let formattedMS = ms.toString().padStart(2, "0");
  
    return `${formattedMM}:${formattedSS}:${formattedMS}`;
  }
  
  // Declare variables to use in our functions below
  
  let startTime;
  let elapsedTime = 0;
  let timerInterval;
  
  // Create function to modify innerHTML
  
  function print(txt) {
    document.getElementById("display").innerHTML = txt;
  }
  
  // Create "start", "pause" and "reset" functions
  
  function start() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(function printTime() {
      elapsedTime = Date.now() - startTime;
      print(timeToString(elapsedTime));
    }, 10);
    showButton("PAUSE");
  }
  
  function pause() {
    clearInterval(timerInterval);
    showButton("PLAY");
  }
  
  function reset() {
    clearInterval(timerInterval);
    print("00:00:00");
    elapsedTime = 0;
    showButton("PLAY");
  }
  
  // Create function to display buttons
  
  function showButton(buttonKey) {
    const buttonToShow = buttonKey === "PLAY" ? playButton : pauseButton;
    const buttonToHide = buttonKey === "PLAY" ? pauseButton : playButton;
    buttonToShow.style.display = "block";
    buttonToHide.style.display = "none";
  }
  // Create event listeners
  
  let playButton = document.getElementById("playButton");
  let pauseButton = document.getElementById("pauseButton");
  let resetButton = document.getElementById("resetButton");
  
  playButton.addEventListener("click", start);
  pauseButton.addEventListener("click", pause);
  resetButton.addEventListener("click", reset);