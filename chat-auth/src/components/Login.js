import React from "react"

// importing Google icon
import { GoogleOutlined } from '@ant-design/icons';

import firebase from "firebase/app";

// importing the auth configration object from firebase.js file
import { auth } from "../firebase";


export default function Login() {
  return (

    <div id='login'>
       <div className='chats-page'>
                 <div className='navigation-bar'>
                    <div className='logo-tab'>
                      Microsoft Teams
                    </div>
                  </div>
        </div>

        <div id='card'>
             <div className ='login-image'>
                    <img src= "Sign_in.jpg" alt="Sign In for Microsoft Teams"/>
             </div>

             <div className='login-button google'
                     // Redirect google signin via firebase
                    onClick={() => auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())}
                     >
                    <GoogleOutlined /> Sign In with Google
              </div>

        </div>
         
    </div>
  )
}