const mongoose =require("mongoose");                  //importing moongose library

const userSchema=new mongoose.Schema({                //structure of the document stored in mongodb
    username: {
        type:String,
        required:true,
        min: 3,
        max:20,
        unique:true,
    },
    email: {
        type:String,
        required: true,
        unique: true,
        max: 50,
    },
    password: {
        type:String,
        required: true,
        min: 50,
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false,
    },
    avatarImage: {
        type:String,
        deafult: "",
    },
});
// This line exports the schema as a Mongoose model. The model name is set to "Users" and it's created using the defined userSchema. This allows you to use this model in other parts of your application to interact with user data in the MongoDB database.
module.exports=mongoose.model("Users",userSchema);