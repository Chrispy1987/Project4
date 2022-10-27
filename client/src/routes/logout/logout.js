import './logout.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

// Log user out and remove session data
export const Logout = (props) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.delete('/user/session/')                    
        } catch (e) {
            e.response.status === 500 
                ? props.handleToast('An error occured when logging user out!')
                : props.handleToast(e.response.data.toast);
            return
        }
        localStorage.clear();
        props.handleToast('Logged out successfully!'); 
        props.setSession(null);
        props.setPanel('groups');
        navigate("/");
    };


    return (
        <div>
            <button onClick={handleLogout} className='button-v3'>LOGOUT</button>
        </div>
    )
}
