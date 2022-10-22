import './login.css'
import userIcon from  '../../assets/user_icon.png'
import pwIcon from '../../assets/pw_icon.png'
import axios from 'axios';
import { Link } from 'react-router-dom'

export const Login = (props) => {
    const handleLogin = (event) => {
        event.preventDefault(); 
        const formData = new FormData(event.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        axios.post('/user/session', data)
        .then((dbRes) => {
            const response = dbRes.data
            response.userId &&
                props.handleToast(response.toast)
                setTimeout(() => {
                    props.setSession(response.userId)
                    window.location.href = '/'
                }, 2000);
        })
        .catch((err) => {
            err.response.status === 500 
            ? props.handleToast('We are having trouble retrieving your account. Please try again later!')
            : props.handleToast(err.response.data.toast)
        });
    }

    return (
        <div className='login-container'>
            <h2 className="subheading">~ Log in ~</h2>
            <form id='login-form' onSubmit={event => handleLogin(event)}>                
                <div className='login-frame'>
                    <img className='login-icon' src={userIcon} alt='user icon'/>
                    <input type='email' placeholder='Email address' name='email' required/>
                </div>
                <div className='login-frame'>
                    <img className='login-icon' src={pwIcon} alt='password icon'/>
                    <input type='password' placeholder='Password' name='password' required/>
                </div>
                <button className='login-button'>Login</button>
            </form>
        </div>
    )
}