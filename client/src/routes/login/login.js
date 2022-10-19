import './login.css'
import userIcon from  '../../assets/user_icon.png'
import pwIcon from '../../assets/pw_icon.png'
import axios from 'axios';

export const Login = (props) => {

    const handleLogin = (event) => {
        event.preventDefault(); 
        const formData = new FormData(event.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        // check db to see if username & password match
        axios.post('/user/session', data)
        .then((dbRes) => {
            const res = dbRes.data
            props.handleToast(res.message)
            res.id &&
                setTimeout(() => {
                 props.setSession(res.id)
                 window.location.href = '/home'   
                }, 3000)                          
        })
        .catch((err) => {
            err.response.status === 500 && props.handleToast('Something went wrong. Please try again.');              
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