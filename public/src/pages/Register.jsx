import React,{useState,useEffect} from 'react';
import { Link,useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import Logo from "../assets/logo512.png"
import {ToastContainer,toast} from "react-toastify"    //to notify a error
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from '../utils/APIRoutes';

function Register() {
  const navigate=useNavigate();                        //navigate instance to redirected to different endpoints
  const [values,setValues]=useState({                  //as you know it is a usestate which has variable value and its setter fucntion setValues
     username: "",                                     //all are set to empty for initial state 
     email: "",
     password: "",
     confirmPassword: "",
  });
  const handleSubmit=async(event)=>{                   //is called when we click on submit
    event.preventDefault();             //if you call event.preventDefault() on a form's submission, the page will not refresh, allowing you to handle the form without reloading the entire page
    if(handleValidation()){
      const {password,username,email}=values;
      const {data}= await axios.post(registerRoute,{      //WE ARE SENDING DATA TO THE DATABASE THROUGH SERVER POST REQUEST AND REGISTER ROUTE IS THE ROUTE FOR POSTING TO SERVER
        username,
        email,                                            //HERE WE ARE SENDING THE USERNAME AND PASSWORD WHICH WE ARE GOING TO REGISTER
        password,                                         //ON THE SERVER WE ARE RETURNING A RESPONSE AND STORED IN DATA IN RESPONSE WE HAVE STATUS WHICH TELLS US WHEATHER IT IS COMPLETED OR NOT
      });
      if(data.status===false){                            //WE ALSO HAVE A USER WHICH WE HAVE CREATED WHICH IS SET IN LOCAL STORAGE WITH HOSTID SO IF IT IS DETECTED THEN WE ARE DIRECTLY REDIRECTED TO CHAT PAGE
        toast.error(data.msg,toastOptions);
      }
      if(data.status===true){
        localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY,JSON.stringify(data.user));   
      }
      navigate("/");                                       //WE ARE NAVIGATED TO CHAT PAGE
    }
  };

  const handleChange=(event)=>{                                   // AS WE TYPE THE NAMES IT AUTOMATICALLY GETS UPDATED
    setValues({...values,[event.target.name]:event.target.value})
  };

  const toastOptions={                                             //THIS IS CSS OF TOAST WHICH SHOWS US THE ERROR IF OCCURED
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable:true,
    theme:"dark",
  }

  useEffect(() => {                                                 //IF WE ARE ALREADY LOGGED IN THEN WE ARE REDIRECTED TO CHAT PAGE
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleValidation=()=>{                                     //THE WHOLE FUNCTION IS JUST TO VALIDATE THAT THE CREDENTIALS
    const {password,confirmPassword,username,email}=values;        // IS ENTERING ARE OF CORRECT FORMAT
    if(password!=confirmPassword){
      toast.error("Password and confirm password should be same.",toastOptions);
      return false;
  }
  else if(username.length<3){
    toast.error("Username should be greater than 3,",toastOptions);
    return false;
  }
  else if(password.length<8){
    toast.error("Password should be equal of greater than 8 characters,",toastOptions);
    return false;
  }
  else if(email===""){
    toast.error("Email is required",toastOptions);
    return false;
  }
  return true;
};

//YOU CAN SAY BELOW IS THE BODY OF MAIN FUNCTION AND THE ABOVE ARE THE FUNCTIONS WHICH ARE CALLED IN MAINS BODY

  return (
    <>
      <FormContainer>                                      

        {/* THE BELOW IS THE IMPLEMENTATION OF A FORM WHERE EACH INPUT TYPE TAKES A INPUT AND ON CHANGE HANDLE CHANGE IS CALLED
        AND SENDS THE EVENT E WHICH IS CHANGE DONE BY THE USER

        ON SUBMIT HANDLE SUBMIT IS CALLED AND THINGS ARE EXECUTED     */}

        <form onSubmit={(event)=>handleSubmit(event)}>    
          <div className='brand'>
            <img src={Logo} alt="Logo"/>
            <h1>Snappy</h1>
          </div>
          <input
          type='text'
          placeholder='Username'
          name='username'
          onChange={(e)=>handleChange(e)}
          />
          <input
          type='email'
          placeholder='Email'
          name='email'
          onChange={(e)=>handleChange(e)}
          />
          <input
          type='password'
          placeholder='Password'
          name='password'
          onChange={(e)=>handleChange(e)}
          />
          <input
          type='password'                               
          placeholder='Confirm Password'                       //placeholder is nothing but a translucnet text inside the box
          name='confirmPassword'                               //for prompting purpose
          onChange={(e)=>handleChange(e)}
          />
          <button type="Submit">Create User</button>
          <span>Already have an Account?<Link to="/login">Login</Link></span>          
        </form>
      </FormContainer>
      <ToastContainer/>
    </>
    
  );
}
//THE BELOW IS THE CSS OF THE CONTAINER WHICH GIVES ITS ACTUAL COLOR AND CSS
const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

export default Register      //IT IS NOTHING BUT TELLING THE REACT THAT REGISTER IS THE MAIN FUNCTION