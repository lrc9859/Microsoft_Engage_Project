import React, { useEffect, useRef, useState } from "react"

//importing chat-engine.io . SDK used 
import { ChatEngine } from 'react-chat-engine'
import { useHistory } from "react-router-dom"

import axios from 'axios'
import { useAuth } from "../contexts/AuthContext"

import { auth } from "../firebase"

export default function Chats() {
  const didMountRef = useRef(false)
  const [ loading, setLoading ] = useState(true)

  //importing user from context
  const { user } = useAuth()
  const history = useHistory()

  // await logout function
  async function handleLogout() {
    await auth.signOut()
    history.push("/")
  }

  // Importing user Avatar
  async function getFile(url) {
    let response = await fetch(url);
    let data = await response.blob();
    return new File([data], "test.jpg", { type: 'image/jpeg' });
  }

   useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true

      //Checking user status and routing acc to that
      if (!user || user === null) {
        history.push("/")
        return
      }

       //Calling API if user already created
      axios.get(
        'https://api.chatengine.io/users/me/',
        { headers: { 
          "project-id": '8c8a79bf-8ee9-4f23-b220-6666f51077d4',
          "user-name": user.email,
          "user-secret": user.uid
        }}
      )

      .then(() => setLoading(false))

//If new user, create a new user in chatengine
.catch(e => {
  let formdata = new FormData()
  formdata.append('email', user.email)
  formdata.append('username', user.email)
  formdata.append('secret', user.uid)

   //Appending the called Avatar 
     getFile(user.photoURL)
       .then(avatar => {
          formdata.append('avatar', avatar, avatar.name)

//API Call to create new user on chatengine
  axios.post(
      'https://api.chatengine.io/users/',
       formdata,
         { headers: { "private-key": 'fca8bec2-7046-49e7-8382-00263fb07115' }}
     )
         .then(() => setLoading(false))

          //Give error if user creation fails
          .catch(e => console.log('e', e.response))
     })
})
    
  }
  }, [user, history])
  
//If no user or loading
  if (!user || loading) return <div />


return (
          <div className='chats-page'>
                <div className='navigation-bar'>
                      <div className='logo-tab'>
                          Microsoft Teams
                      </div>

                    <div  className='video-call'>
                    
                    <a href="https://video-chat-lavish.herokuapp.com/" target="_blank"> Video Call</a>

                    </div>
                
                    <div onClick={handleLogout} className='logout'>
                      Logout
                    </div>

                  </div>

              <ChatEngine 
                height='calc(100vh - 44px)'
                projectID='8c8a79bf-8ee9-4f23-b220-6666f51077d4'
                userName={user.email }
                userSecret={user.uid}
              
                />
          </div>
  )
}









