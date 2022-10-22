import './logout.css'
import axios from 'axios'

// Log user out and remove session data
export const Logout = (props) => {
    const handleLogout = () => {
        axios.delete('/user/session/')
        .then(() => {
            localStorage.clear();
            props.setSession(null)
            props.handleToast('Logged out successfully')  
            })
        .catch(err => {
            err.response.status === 500 
            ? props.handleToast('An error occured when logging user out!')
            : props.handleToast(err.response.data.toast)  
        });
    }

    return (
        <div>
            <button onClick={handleLogout} className='button-v3'>LOGOUT</button>
        </div>
    )
}