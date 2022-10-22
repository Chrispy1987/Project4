import './logout.css'
import axios from 'axios'
import { Link } from 'react-router-dom'

// Log user out and remove session data
export const Logout = (props) => {
    const handleLogout = async () => {
        try {
            await axios.delete('/user/session/')                    
        } catch (e) {
            e.response.status === 500 
            ? props.handleToast('An error occured when logging user out!')
            : props.handleToast(e.response.data.toast);
        }
        localStorage.clear();
        props.handleToast('Logging out. Goodbye!'); 
        setTimeout(() => {            
            props.setSession(null);
            window.location.href = '/';
        }, 2000);
    }

    return (
        <div>
            <Link to='/'><button onClick={handleLogout} className='button-v3'>LOGOUT</button></Link>
        </div>
    )
}