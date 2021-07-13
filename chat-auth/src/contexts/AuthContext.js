//Context to manage all the user information and pass it 
import React, { useEffect, useState,useContext} from "react"

import { useHistory } from "react-router-dom"

//importing the auth configration object from firebase.js file
import { auth } from "../firebase"

const AuthContext = React.createContext()

export const useAuth = () => useContext(AuthContext) ;

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const history = useHistory();

  // When user or history will change useEffect works
  //If user is found change the route to chats
  useEffect(() => {
    auth.onAuthStateChanged(user => {
      setUser(user);
      setLoading(false);
      if(user) history.push('/chats');
    })
  }, [user, history]);

  const value = { user };

  //if not loading show children
  return (
    <AuthContext.Provider value={value}> 
      {!loading && children}
    </AuthContext.Provider>
  ) 
}