const users = []

//addingUser , getUsers , deleteUser , getUsersinRoom

const addingUser = ({id , username , room})=>{
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    if(!username || !room){
        return {
            error : 'Enter the username or the room properly!!'
        }
    }

    //check for the existing user

    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    //validation
    if(existingUser){
        return {
            error : 'Username is in use'
        }
    }
    const user = {id , username , room}
    users.push(user)
    return {user}
}

// remove User

const removeUser = (id) =>{
    const index = users.findIndex((user)=>user.id === id)

    if(index!==-1){
        return users.splice(index , 1)[0]
    }
}

const getUser = (id)=>{
    return users.find((user)=> user.id === id)
}

const getUsersinRoom = (room)=>{
   return users.filter((user)=> user.room === room)
}


module.exports = {
    addingUser,
    removeUser,
    getUser,
    getUsersinRoom
}
