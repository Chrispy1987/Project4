import './login.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';

export const Login = () => {

    return (
        <div className='login-container'>
            <h2>- LOG IN -</h2>
            <form id='login-form'>                
                <div class='login-frame'>
                    <img className='login-icon' src='../../assets/user_icon.png'/>
                    <input type='email' placeholder='Enter email...' name='email' required/>
                </div>
                <div class='login-frame'>
                    <img className='login-icon' src="../../assets/pw_icon.png"/>
                    <input type='password' placeholder='Enter password...' name='password' required/>
                </div>
                <Link to='/home'><button className='login-button'>Login</button></Link>             
            </form>
        </div>
    )
}