const socket = io()
const $messageForm = document.querySelector('#sndMainContent')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

const messageTemplate = document.querySelector('#message-template').innerHTML
const $locationMessageTemplate = document.querySelector('#locationTemplate').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const {username , room} = Qs.parse(location.search , {ignoreQueryPrefix : true})
const autoscroll = ()=>{
   // new message element
   const $newMessage = $messages.lastElementChild

   //Height of the content
   const newMessageStyle = getComputedStyle($newMessage)
   const newMessageMargin =  parseInt(newMessageStyle.marginBottom)
   const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

   const visibleHeight = $messages.offsetHeight
   const containerHeight = $messages.scrollHeight
   const scrollOffSet = $messages.scrollTop + visibleHeight
   if(containerHeight-newMessageHeight <=scrollOffSet){
     $messages.scrollTop = $messages.scrollHeight
   }
}
socket.on('message',(a)=>{
 console.log(a)
 const html = Mustache.render(messageTemplate , {
    username : a.username,
    message : a.text,
    createdAt : moment(a.createdAt).format('h:mm a')
 })
 $messages.insertAdjacentHTML('beforeend',html)
 autoscroll()
})
socket.on('locationMessage' , (url)=>{
     console.log(url)
     const html = Mustache.render($locationMessageTemplate , {
        username : url.username,
        url : url.url,
        createdAt : moment(url.createdAt).format('h:mm a')
     })
    $messages.insertAdjacentHTML('beforeend' , html)
    autoscroll()
})

socket.on('roomData' , ({room , users})=>{
   const html = Mustache.render(sidebarTemplate , {
      room,
      users
   })
   document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')
    const message = e.target.elements.message.value
    socket.emit('sendMessage',message ,()=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        console.log('Message delivered')
    })
})

$sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation) return alert('Geolocation is not supported in your browser')
    $sendLocationButton.setAttribute('disabled','disabled')
     navigator.geolocation.getCurrentPosition((position)=>{
          socket.emit('sendLocation' , {
              latitude : position.coords.latitude,
              longitude : position.coords.longitude
         }, ()=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Shared Successfully')
         })
    })
    
})

socket.emit('join' , {username , room} , (error)=>{
    if(error){
        alert(error)
        location='/'
    }
})
