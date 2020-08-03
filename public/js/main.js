const chatForm= document.getElementById('chat-form');
const chatMessages =document.querySelector(".chat-messages");
const roomName=document.getElementById('room-name');
const usersInRoom=document.getElementById('users');

// Get username and room-name from URL
const {username,room}= Qs.parse(location.search,{
    ignoreQueryPrefix: true
});

const socket =io();

// Join chat Room
socket.emit('joinRoom',{username,room});

// Get Room and Users info for that room to display in dom side-bar
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsersInRoom(users);
})

// Message from server
socket.on("message",message=>{
    outputMessage(message);
});

// message submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    // Get message text
    const msg=e.target.elements.msg.value; // basically in form we get value of input which has id msg(this input is our msg text)

    //emit chat msg to server
    socket.emit('chatMessage',msg);

    e.target.elements.msg.value="";
    e.target.elements.msg.focus();
});

// output message to dom

const outputMessage=({text,username,time})=>{
    const div=document.createElement('div');
    div.classList.add('message'); // make div with className message
    div.innerHTML = `<p class="meta">${username} <span>${time}</span></p>
						<p class="text">
							${text}
                        </p>`;
    chatMessages.appendChild(div);

    //scroll down to show latest message
    chatMessages.scrollTop=chatMessages.scrollHeight;

}

const outputRoomName=(room)=>{
    roomName.innerText=room;
}

const outputUsersInRoom= (users)=>{
    usersInRoom.innerHTML=`
        ${users.map(user=> `<li>${user.username}</li>`).join('')}
    `;
}