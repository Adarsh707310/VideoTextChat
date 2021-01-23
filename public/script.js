const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined);
const myVideo = document.createElement('video')
var myStream
//myVideo.setAttribute("id","video-box");
myVideo.muted = true   //to mute user audio
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)
  myStream = stream;

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    //video.setAttribute("id","video-box");
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    console.log("come on man")
    console.log("User connected:"+userId)
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  //video.setAttribute("id","video-box");
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}

var mute = document.getElementsByClassName("mic");
mute[0].onclick = function(evt){
  var audioTrack = myStream.getAudioTracks();
  audioTrack.enabled = !audioTrack.enabled;
}

var camera = document.getElementsByClassName("camera");
camera[0].onclick = function(evt){
  var videoTrack = myStream.getVideoTracks();
  console.log(videoTrack[0]);
  videoTrack[0].enabled = !(videoTrack[0].enabled);
}

/*Screen sharing functionality*/
function handleSuccess(stream) {

  myVideo.srcObject = stream;

  // demonstrates how to detect that the user has stopped
  // sharing the screen via the browser UI.
  // ended is a event which is trigerred when stream is ended.
  stream.getVideoTracks()[0].addEventListener('ended', () => { 
    myVideo.srcObject = myStream;
    screen_share_toggle()
  });
}

function screen_share_toggle(){
  const screen_share = document.getElementsByClassName("screen_share");
  screen_share[0].classList.toggle("screen_on");
}

var screen_off = document.getElementsByClassName("screen_share");
screen_off[0].onclick = function(evt){
  var temp = window.getComputedStyle(screen_off[0]).borderColor;
  //console.log(temp)
  if(temp == "rgb(224, 20, 20)"){
    navigator.mediaDevices.getDisplayMedia({video: true})
    .then(handleSuccess).then(screen_share_toggle)
  }
  else{
    myVideo.srcObject.getTracks()[0].stop()
    myVideo.srcObject = myStream;
    screen_share_toggle()
  } 
}

//, {
  //host: '/',
  //port: '5050'
  
//}