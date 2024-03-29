import React from "react"

import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

 import { AuthProvider } from "../contexts/AuthContext"
 import Login from "./Login"
 
 import Chats from "./Chats"


 // Authprovider will handle the user state
 //Switch route will make sure login and chat page can't open simuntaneously
function App() {
  return ( 
     <div style={{ fontFamily: 'Avenir' }}>
         
      <Router>
        <AuthProvider> 
          <Switch>
            <Route path="/chats" component={Chats} />
            <Route path="/" component={Login} />    
          </Switch>
        </AuthProvider> 
      </Router>
     </div>
     )
}
export default App