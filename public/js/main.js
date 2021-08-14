const socket = io();
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.querySelector('#room-name');
const userList = document.querySelector('#users');

//get username and room from url

const { username,room } = Qs.parse(location.search,{
    ignoreQueryPrefix: true,
});
console.log(username);
console.log(room);

const chatForm = document.getElementById('chat-form');
//Get room and user

socket.on('roomUsers',({ room,users })=>{
outputRoomName(room);
outputUsers(users);

});
//join chat room
socket.emit('joinRoom',{username,room});

//message from server
socket.on('message',message=>{
console.log(message);
outputMessage(message);


chatMessages.scrollTop = chatMessages.scrollHeight;

});


///submit form


chatForm.addEventListener('submit',(e)=>{
e.preventDefault();
//get message text
const msg = e.target.elements.msg.value;
//emit message to server
socket.emit('chatMessage',msg);
//clear input

e.target.elements.msg.value = '';
e.target.elements.msg.focus();
});



//output message to dom

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p>${message.username}</p><br><p>${message.time}</p><br><p>${message.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}


//Add room name to DOM

function outputRoomName(room){
roomName.innerText = room;

}


//Add users to DOM

function outputUsers(users){
userList.innerHTML= `
${users.map(user=>`<li>${user.username}</li>`).join('')}
`; 
}