import './signUp.css'
import userIcon from  '../../assets/user_icon.png'
import pwIcon from '../../assets/pw_icon.png'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

export const SignUp = (props) => {
    const navigate = useNavigate();

    const handleSignUp = async (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget);
       
        const data = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password')
        };

        const checkPw = formData.get('password-check');

        if (data.password !== checkPw) {
            props.handleToast('Passwords do not match')
            return
        }
        let dbRes;
        try {
            dbRes = await axios.post('/user/session/signup', data)            
        } catch (e) {
            e.response.status === 500 
                ? props.handleToast('We are having trouble creating your account. Please try again later!')
                : props.handleToast(e.response.data.toast)
            return
        }
        props.handleToast(dbRes.data.toast)
        navigate('/login')
    }


    return (
        <div className='login-container fade-in'>
            <h2 className="subheading">~ Sign up ~</h2>
            <form id='login-form' onSubmit={event => handleSignUp(event)}>       
                <div className='login-frame'>
                    <img className='login-icon' src='https://cdn-icons-png.flaticon.com/512/1177/1177568.png' alt='username icon'/>
                    <input type='text' placeholder='Enter username' name='username' required/>
                </div>         
                <div className='login-frame'>
                    <img className='login-icon' src={userIcon} alt='user icon'/>
                    <input type='email' placeholder='Enter email address' name='email' required/>
                </div>
                <div className='login-frame'>
                    <img className='login-icon' src={pwIcon} alt='password icon'/>
                    <input type='password' placeholder='Enter password' name='password' required/>
                </div>
                <div className='login-frame'>
                    <img className='login-icon' src='https://cdn-icons-png.flaticon.com/512/6446/6446371.png' alt='password check icon'/>
                    <input type='password' placeholder='Re-enter password' name='password-check' required/>
                </div>
                <button className='login-button'>sign up</button>
            </form>
        </div>
    )
}