const socket = io('/')
const videoGrid = document.getElementById('video-grid')

//Creating a unique ID for a new user using Peerjs
const myPeer = new Peer(undefined, {
   path: '/peerjs',
    host: '/',
    port: '443'
  })


//Getting user's video
let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;

//Creating an empty object to keep track of user joiining the video call
const peers = {}

navigator.mediaDevices.getUserMedia( {
        video : true,
        audio: true })
  .then(stream => {
          myVideoStream = stream;
          addVideoStream(myVideo, stream)

    // When called send our stream 
    myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
                      
    //Add incoming video stream to our script
    call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
      })  
             })
                 
//Socket to connect user  
socket.on('user-connected', userId => {
    // user is joining
setTimeout(() => {
    // user joined
connectToNewUser(userId, stream)
}, 1000)

  })
                                      })

//Close the connection of disconnecting users
//The Peers object created keeps track of leaving users by keeping there Id's as key

socket.on('user-disconnected', userId => {
if (peers[userId]) peers[userId].close()
   })

// Passing the unique Id to the new user
myPeer.on('open', id => {
socket.emit('join-room', ROOM_ID, id)
  })

//function to Connect to new user 
function connectToNewUser(userId, stream){
const call = myPeer.call(userId, stream)
const video = document.createElement('video')

// adding other user's video stream
call.on('stream', userVideoStream => {
addVideoStream(video, userVideoStream)
  })

//Remove user video when user disconnects
call.on('close', () => {
video.remove()
  })

//Storing leaving user's Id
peers[userId] = call
  }

  
//addVideoStream function 
function addVideoStream(video, stream) {
  video.srcObject =stream
  video.addEventListener('loadedmetadata', () => {
   video.play()
                   })
   videoGrid.append(video)
}

              
/////For Chat
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
             
//function used to add messages in the chat box            
function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
  let d = $('.main_right');
  d.scrollTop(d.prop("scrollHeight"));
              }

const name = prompt('What is your name?')
appendMessage('Welcome to the meeting ' + name + '!')
 socket.emit('new-user', name)

 //Add messages
socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)  
    })

// Send user's message
messageForm.addEventListener('submit', e => {
        e.preventDefault()
        const message = messageInput.value
        appendMessage(`You: ${message}`)
        socket.emit('send-chat-message', message)
       messageInput.value = ''
              })

///////Mute Audio and Stop Video functionality     

const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
                    myVideoStream.getVideoTracks()[0].enabled = false;
                    setPlayVideo()
                 } 
      else {
           setStopVideo()
            myVideoStream.getVideoTracks()[0].enabled = true;
            }
      }



const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
   if (enabled) {
                  myVideoStream.getAudioTracks()[0].enabled = false;
                  setUnmuteButton();
                } 
      else {
           setMuteButton();
           myVideoStream.getAudioTracks()[0].enabled = true;
            }
}              


const setPlayVideo = () => {
   const html = `<i class="stop fas fa-video-slash"></i>
                  <span>Play Video</span> `
  document.querySelector('.main_video_button').innerHTML = html;
     }



const setStopVideo = () => {
    const html = `<i class="fas fa-video"></i>
                  <span>Stop Video</span> `
    document.querySelector('.main_video_button').innerHTML = html;
           }



const setUnmuteButton = () => {
      const html = `<i class="unmute fas fa-microphone-slash"></i>
                    <span>Unmute</span> `
    document.querySelector('.main_mute_button').innerHTML = html;
           }


    

const setMuteButton = () => {
   const html = ` <i class="fas fa-microphone"></i>
                  <span>Mute</span>`
document.querySelector('.main_mute_button').innerHTML = html;
   }





              
