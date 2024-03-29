
const chatForm=document.getElementById('chat-form')
const chatMessages=document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');



// get user name and url from the url
const { username,room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
console.log(username,room)

const socket =io();
//join chat Room
socket.emit('joinRoom',{username,room})

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });
  







// message from server  


socket.on('message',message=>{
console.log(message)    
OutputMessage(message )
// scroll down
chatMessages.scrollTop=chatMessages.scrollHeight;
})



chatForm.addEventListener('submit',(e)=>{
e.preventDefault();
// get message text
const msg= e.target.elements.msg.value;

// emit message to server
socket.emit('chatMessage',msg);
e.target.elements.msg.value='';
e.target.elements.msg.focus();



})

// output messag to DOM
function OutputMessage(message){
    const div= document.createElement('div') 
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);

}
// add room name to dom
function outputRoomName(room){
roomName.innerText=room;
}
// add users to dom 
// Output users to DOM
function outputUsers(users) {
    userList.innerHTML = users.map(user => `<li>${user.username}</li>`).join('');
}
