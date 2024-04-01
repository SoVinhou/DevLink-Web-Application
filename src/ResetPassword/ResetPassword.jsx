import './ResetPassword.css'
import React, { useState, useContext } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {useNavigate} from 'react-router-dom';

const ResetPassword = (props) => {

    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();
    const [contact, setContact] = useState({
        username: "",
    });

    const handleChange = (event) => {
        const {name, value} = event.target;
        setContact((prevValue) => {
            return {
                ...prevValue,
                [name]: value
            };
        });
    }

    const handleReset = (event) => {
        event.preventDefault();
      
        firebase
          .auth()
          .sendPasswordResetEmail(contact.username)
          .then(() => {
            console.log(`Password reset email sent to ${contact.username}`);
            window.alert(`Password reset email sent to ${contact.username}`);
            navigate('/EmailVerification');
          })
          .catch((error) => {
            console.log(error.code);
            if (error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found') {
              setErrorMessage('*** User not found ***');
              console.log('User not found');
            } else {
              setErrorMessage('An error occurred while resetting password');
              console.log('An error occurred while resetting password');
            }
          });
      };

    return <div className="header-div">
        <div className="ResetContainer">
            <h1 style={{marginTop: "60px", marginBottom:"38px", fontSize: "40px", fontWeight: "Bold"}}>DevLink Reset Password</h1>
            <input
            name = 'username'
            type = 'email'
            placeholder = 'Enter email address'
            onChange = {handleChange}
            value = {contact.username}
            />
            <br></br>
            <button type='submit' onClick={handleReset}>Reset Password</button>
            {errorMessage && <p style={{ color: 'red', fontSize:"20px", marginTop:"-40px", fontWeight:"bold"}}>{errorMessage}</p>}

        </div>

    </div>

}

export default ResetPassword;