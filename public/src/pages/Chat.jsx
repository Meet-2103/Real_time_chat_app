import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { json, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";


export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLoading,setIsLoaded]=useState(false);

  useEffect(() => {
    const temp=async()=>{
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        // console.log("navigated to login");
        navigate("/login");
      } else {
        setCurrentUser(
          await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
          )
        );
        // console.log("in set currrent user");
        setIsLoaded(true);
      }
    };
    temp();
  }, []);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const tem=async()=>{
      // console.log("in second use effect");
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          try{
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          console.log(data);
          // console.log(JSON.stringify(data, undefined, 2));
          setContacts(data.data);
          }
          catch(error){
            console.log(error);
          }
        } 
        else {
          navigate("/setAvatar");
        }
      }
    };
    tem();
  }, [currentUser]);


  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <Welcome  currentUser={currentUser}/>
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;