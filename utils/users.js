const users=[];

// Join user to chat
exports.userJoin=(id,username,room)=>{
    const user ={id,username, room};

    users.push(user);
    return user;
}
//Get currentUser
exports.getCurrentUser=(id)=>users.find(user=>user.id===id);

// User leaves chat room
exports.userLeave=(id)=>{
    const index= users.findIndex(user=>user.id===id);
    if(index!=-1)
        return users.splice(index,1)[0];
}

exports.getRoomUsers=(room)=> users.filter(user=>user.room===room);