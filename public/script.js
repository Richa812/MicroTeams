const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo=document.createElement('video');
myVideo.muted=true;

var peer = new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'443'

});

var currentpeer;
var peerlist=[];


const  username = prompt("Enter a username");

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
            currentpeer=call.peerConnection
            peerlist.push(call.peer)

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
}





const addVideoStream = (video,stream)=>{
  video.srcObject= stream;
  video.addEventListener('loadedmetadata',()=>{
      video.play();
  })
  videoGrid.append(video);
}




//chat-box

//open chat-box

let open=document.querySelector(".open_chat");
let leftc=document.querySelector(".main__left");
let rightc=document.querySelector(".main__right");
let closec=document.querySelector(".close_chat");

open.addEventListener("click",(e)=>{
    rightc.style.display="flex";
    rightc.style.flex="0.21";
    leftc.style.display="flex";
    leftc.style.flex="0.79";
});

closec.addEventListener("click",(e)=>{
  leftc.style.display="flex";
  leftc.style.flex="1";
  rightc.style.display="none";
});


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

alert('click on add people icon to invite')
const inviteButton = document.querySelector("#Invite");



inviteButton.addEventListener("click", (e) => {

  //alert(location.hostname);
  prompt(
    "Invite people with this room-code",
    window.location.pathname
  );
});


//audio

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
      <i  title ="mute" class="fas fa-microphone"></i>
      
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }

const setUnmuteButton = () => {
    const html = `
      <i  title="unmute" class="unmute fas fa-microphone-slash"></i>
     
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
      <i  title ="turn off" class="fas fa-video"></i>
     
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }

  const setPlayVideo = () => {
    const html = `
    <i  title="turn on" class="stop fas fa-video-slash"></i>
     
    `
    document.querySelector('.main__video_button').innerHTML = html;
    
  }



  //sharescreen

  let screenShare = document.querySelector('.screenshare');
  let stopscreenShare = document.querySelector('.stopshare');


  screenShare.addEventListener('click', function (e) 
    {
        navigator.mediaDevices.getDisplayMedia
        ({
            video: 
            {
              cursor: 'always'
            },
            audio: 
            {
              echoCancellation: true,
              noiceSuppression: true
            }
        })
        .then(function (stream)
        {
            let videoTrack = stream.getVideoTracks()[0]
            let sender = currentpeer.getSenders().find(function (s) 

            {
              return s.track.kind == videoTrack.kind
            })
            sender.replaceTrack(videoTrack)
            
            

        })
        .catch(function (err) 
        {
            console.log(err + 'unable to get display')
        })
    })

    stopscreenShare.addEventListener('click', function (e) 
    {
      let videoTrack = myVideoStream.getVideoTracks()[0]
            let sender = currentpeer.getSenders().find(function (s) 
            {
              
              return s.track.kind == videoTrack.kind
            })
            sender.replaceTrack(videoTrack)
    })




    //video enlarge
   
    myVideo.addEventListener('click',function(e){
      if (myVideo.requestFullscreen) {
        myVideo.requestFullscreen();
      } else if (myVideo.msRequestFullscreen) {
        myVideo.msRequestFullscreen();
      } else if (myVideo.mozRequestFullScreen) {
        myVideo.mozRequestFullScreen();
      } else if (myVideo.webkitRequestFullscreen) {
        myVideo.webkitRequestFullscreen();
      }
    })


//leave meet

let meetingLeave = document.querySelector('.leave_meeting');
  meetingLeave.addEventListener("click", function () {
    leaveMeeting();
    peer.on("call", (call) => {
      userVideoStream=null;
      call.close();
    });
 
  });
function leaveMeeting() {
  closeVideoCall();
}

function closeVideoCall() {

 
 
  videoGrid.srcObject.getTracks().forEach((track) => track.stop());
   //remoteVideo.remove();
   videoGrid.remove();
};
  //https://sleepy-springs-59737.herokuapp.com/
