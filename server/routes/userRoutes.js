const { register, login ,setAvatar, getAllUsers, logOut} = require("../controllers/userController");

//the above statement is import statement used in below functions

const router=require("express").Router();    //router is used for routing and separating this function from index.js to make clean code

router.post("/register",register);           //all are api endpoint and at each function is written to send or receive message and saving data in the database
router.post("/login",login);
router.post("/setavatar/:id",setAvatar);
router.get("/allusers/:id",getAllUsers);
router.get("/logout/:id", logOut);

module.exports=router;  