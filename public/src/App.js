import React from 'react'                                            //ALL IMPORTS FOR REACT AND THIS IS THE PAGE WHERE ALL 
import {BrowserRouter,Routes,Route} from "react-router-dom";         // ROUTES ARE DEFINED AND THE URL WHICH YOU TYPE IN CHROME
import Register from './pages/Register';                             //  ALL ARE DEFINED DOWN HERE 
import Login from './pages/Login';          
import Chat from './pages/Chat';
import SetAvatar from './components/SetAvatar';                      //NOW IN NEW UPDATE THERE IS ALSO A NEW WAY TO DECLARE 
                                                                     //ROUTES
export default function App() {                                      //EXPORT DEFAULT LOCATS THE MAIN FUNCTION
  return <BrowserRouter>
  <Routes>                                                        
    <Route path="/register" element={<Register />}/>                   
    <Route path="/login" element={<Login />}/>                       
    <Route path="/setAvatar" element={<SetAvatar />}/>
    <Route path="/" element={<Chat />}/>
  </Routes>
  </BrowserRouter>
}


//THE PATH WHICH IS MENTIONED IS THE ONE WHICH WE ENTER IN BROWSER 