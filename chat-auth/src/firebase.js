import firebase from "firebase/app";

// creating an auth object to be imported to link with firebase project
import "firebase/auth";

//firebase keys
export const auth = firebase.initializeApp ({
        apiKey: "AIzaSyDGIDXc9lIaj-WfYLCFz8T1QjgbLTr9gYA",
        authDomain: "chat-auth-4b2f4.firebaseapp.com",
        projectId: "chat-auth-4b2f4",
        storageBucket: "chat-auth-4b2f4.appspot.com",
        messagingSenderId: "353367547099",
        appId: "1:353367547099:web:28fad5ee8b3472c9c980fe"
      }).auth();
