import './login.css'
import userIcon from  '../../assets/user_icon.png'
import pwIcon from '../../assets/pw_icon.png'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { helper } from '../../js/components/helper'

export const Login = (props) => {
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault(); 
        const formData = new FormData(event.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        let dbRes;
        try {
            dbRes = await axios.post('/user/session', data);
        } catch (e) {
            e.response.status === 500 
                ? props.handleToast('We are having trouble retrieving your account. Please try again later!')
                : props.handleToast(e.response.data.toast)
            return
        }            
        const response = dbRes.data
        response.userId &&
            props.handleToast(response.toast)
            helper.setSessionWithExpiry('user_id', response.userId, 3600000)
            props.setSession(response.userId)
            navigate('/')
    }

    return (
        <div className='login-container fade-in'>
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