const User=require("../model/userModel");
const brcypt=require("bcrypt");

module.exports.register=async(req,res,next)=>{                       //SO I HAVE SEND ALL USERNAME AND PASSWORD THROUGH AXIOS POST    
    try{
    const {username,email,password}=req.body;
    const usernameCheck=await User.findOne({username});             //HERE I WILL CHECK FOR IF USERNAME EXISTS OR NOT
    if(usernameCheck){
        return res.json({msg:"Username already used",status:false});
    }

    const emailCheck=await User.findOne({email});                  //SAME CHECK FOR EMAIL  AND IF FOUND SEND A ERROR RESPONSE
    if(emailCheck){
        return res.json({msg:"E-mail already used",status:false});
    }
    const hashedPassword=await brcypt.hash(password,10);          //now we never store direct password in database so we are encrypting it
    const user=await User.create({                                //creating a user with email and password and saviing in database with predefined model  defined in User
        email,
        username,
        password:hashedPassword,
    });
    delete user.password;                                        //password is deleted and information is send to frontend;
    return res.json({status:true,user});
}
catch(er){
    next(er);
}
}

module.exports.login=async(req,res,next)=>{                                   //this is login post request where we have username and password fron frontend
    try{
    const {username,password}=req.body;
    const user=await User.findOne({username});
    if(!user){                                                                //is user is not registered then it will send error
        return res.json({msg:"Incorrect Username or Password",status:false});
    }

    const isPasswordValid=await brcypt.compare(password,user.password);       //same goes for password
    if(!isPasswordValid){
        return res.json({msg:"Incorrect username or password",status:false});
    }

    delete user.password;                                                    //before sending the data back password is deleted
    return res.json({status:true,user});
}
catch(er){
    next(er);
}
}

module.exports.setAvatar=async(req,res,next)=>{                               //whenever a new user is registered he needs to set a avator for his account
    try{
    const userId=req.params.id;                                               //again in req we have id and image selected and userdata
    const avatarImage=req.body.image;
    const userData=await User.findByIdAndUpdate(userId,{                      //find the userby id and then adds bool flag to know about the set image
        isAvatarImageSet:true,                                                //avatar image is also added
        avatarImage,
    });
    return res.json({                                                         //the state of the image and image is set back to the front end
        isSet: userData.isAvatarImageSet,
        image: userData.avatarImage,
    });
}
catch(er){
    next(er);
}
}


module.exports.getAllUsers = async (req, res, next) => {                      //it is a type of get request we are are sending all id except the current user to the front end to be displayed in screen
    try {
      const users = await User.find({ _id: { $ne: req.params.id } }).select([
        "email",
        "username",
        "avatarImage",
        "_id",
      ]);
      return res.json(users);
    } catch (ex) {
      next(ex);
    }
  };

module.exports.logOut = (req, res, next) => {                                //logs out the current user and 
    try {
      if (!req.params.id) return res.json({ msg: "User id is required " });
      onlineUsers.delete(req.params.id);                                     //removes online users from the socket
      return res.status(200).send();
    } catch (ex) {
      next(ex);
    }
  };