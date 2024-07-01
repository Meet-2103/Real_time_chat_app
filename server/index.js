const express = require("express");
const cors = require("cors");                                     //for connection for react and nodejs
const mongoose = require("mongoose");                             //connection for mongodb and nodejs   all are middlewares
const authRoutes = require("./routes/userRoutes");                //this is the path which goes to user routes where all request are written with its type
const messageRoutes= require("./routes/messages");                //this path is for message which we are writing in the chatbox
const app = express();                                            
const socket = require("socket.io");                              //SOCKET IS A LIBRARY WHICH IS BASICALLY A CLIENT SERVER CONNECTION BUT A TWO WAY CONNECTION WHICH REDUCES REDUNDANCY AND HELPS IN REDUCING LATENCY
require("dotenv").config();                                       //.env files are typically used to store sensitive information that you don't want to commit to your code repository.

app.use(cors());
app.use(express.json());

mongoose                                                          //connecting nodejs with mongodb
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", authRoutes);                                //api endpoint for sending and retrieving data to database
app.use("/api/messages", messageRoutes);                          //for chat messages
 
const server = app.listen(process.env.PORT, () =>                //server listens all the request on port mentioned in .env file
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {                                      //establishes connection with socket.io server
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();                                  //creates a global online map object for storing all online users                 
io.on("connection", (socket) => {                                //whenever connection is established we take user object in socket
  global.chatSocket = socket;                                    //assign current user object to global user to broadcast message to all
  socket.on("add-user", (userId) => {                            //Listens for an event named "add-user" emitted by the client. When a client joins the chat, it sends their user ID along with this event. The server stores the user ID and the corresponding socket ID (which uniquely identifies the client's connection) in the onlineUsers map.
    onlineUsers.set(userId, socket.id);                          
  });

  socket.on("send-msg", (data) => {                              // Listens for a "send-msg" event emitted by the client. This event likely contains message data, including the recipient's user ID (data.to) and the message content (data.msg).
    const sendUserSocket = onlineUsers.get(data.to);             //Retrieves the socket ID of the recipient user from the onlineUsers map using the provided user ID (data.to).
    if (sendUserSocket) {                                        //Checks if the recipient user is online (i.e., their socket ID exists in the map).
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);   //If the recipient is online, the server emits a "msg-recieve" event to the recipient's socket, sending the received message (data.msg).
    }
  });
});