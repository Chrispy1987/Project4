
import './landingPage.css'
import { Link } from 'react-router-dom';

export const LandingPage = () => {
    return (
        <div id="content">
            <div id="content-left">
                <p id="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <Link to='/signup'><button id='sign-up'>Sign up</button></Link>
            </div>
            <img id="content-right" src='#' alt='image'/>
        </div>
    )
}

