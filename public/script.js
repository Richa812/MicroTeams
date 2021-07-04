const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo=document.createElement('video');
myVideo.muted=true;

var peer = new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'3030'

});

alert('Welcome to Micro-teams!');
const  username = prompt("Please enter your name");

let myVideoStream
const peers ={};
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    myVideoStream=stream;
    addVideoStream(myVideo,stream);

    peer.on('call',call=>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream',userVideoStream =>{
            addVideoStream(video,userVideoStream)
        });
    });
   socket.on('user-connected',(userId)=>{
    connectToNewUser(userId,stream);
});
});

peer.on('open',id=>{
  socket.emit('join-room',ROOM_ID,id,username);

})



const connectToNewUser= (userId,stream)=> {
 const  call =peer.call(userId,stream)
 const video=document.createElement('video')
 call.on('stream',userVideoStream => {
    addVideoStream(video,userVideoStream)
 })

 call.on('close',()=>{
   video.remove()
 })

 peers[userId]=call
}



const addVideoStream = (video,stream)=>{
  video.srcObject= stream;
  video.addEventListener('loadedmetadata',()=>{
      video.play();
  })
  videoGrid.append(video);
}

socket.on('user-disconnected',userId =>{
  if(peers[userId]) peers[userId].close()
})


//chat-box

let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

socket.on("createMessage", (message, userName) => {
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
        <b> <span> ${
          userName
        }</span> </b>
        <span>${message}</span>
    </div>`;
});




const scrollToBottom=() =>{
    let d=$('.main__chat__window');
    d.scrollTop(d.prop("scrollHeigth"));
}


//invite people
const inviteButton = document.querySelector("#Invite");

inviteButton.addEventListener("click", (e) => {
  prompt(
    "Copy and send this to add people",
    window.location.href
  );
});
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled=false;
        setUnmuteButton();
    }else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled=true;
    }
}


const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }

const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }


  const playStop = () => {
  
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }
  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }

  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }

  //https://sleepy-springs-59737.herokuapp.com/
