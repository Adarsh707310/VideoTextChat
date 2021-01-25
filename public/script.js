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


// Query DOM
var message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback');

// Emit events
btn.addEventListener('click', function(){
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    });
    message.value = "";
});

message.addEventListener('keypress', function(){
    socket.emit('typing', handle.value);
})

// Listen for events
socket.on('chat', function(data){
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});



//, {
  //host: '/',
  //port: '5050'
  
//}