import React, { useState,useRef } from "react";
import "./Register.css"
import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";
import { serverURL } from "../helper";

export default function Register({setShowRegister}){

    const [success,setSuccess] = useState(false);
    const [error,setError] = useState(false);
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            username:nameRef.current.value,
            email:emailRef.current.value,
            password:passwordRef.current.value,
        };

        try {
            await axios.post(`${serverURL}/api/users/register`,newUser);
            setError(false);
            setSuccess(true);
        } catch (err) {
            setError(true)
        }
    }

    return(
        <div className="registerContainer">
            <div className="logo">
                <Room />
                Paras Travel Map App
            </div>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="username" ref={nameRef}/>
                    <input type="email" placeholder="email" ref={emailRef}/>
                    <input type="password" placeholder="password" ref={passwordRef}/>
                    <button className="registerBtn">Register</button>
                    {success &&
                        <span className="success">Successfull you can login now</span>

                    }
                    {error &&
                        <span className="failure">Something went wrong</span>

                    }
                </form>
                <Cancel className="registerCancel" onClick={() => setShowRegister(false)}/>
            
        </div>
    )
}