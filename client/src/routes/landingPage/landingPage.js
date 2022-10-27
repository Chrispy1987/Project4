
import './landingPage.css'
import { Link } from 'react-router-dom';

export const LandingPage = () => {
    return (
        <div className="content fade-in">
            <div id="content-left">
                <p id="text-heading">"I owe you. Yewomi."</p>
                <p id="text-hero">Making sharing expenses, easy!</p>
                <aside id="text-aside">Remove all the unwanted stress of trying to split a bill 10 ways, or keeping track of <i>who owes what</i>. With Yewomi, you can track your shared expenses among friends, family & housemates - across a variety of different groups, trips, shopping sprees or a big night out! And the best part - it's completely FREE! ...<span>Yewomi!</span> 😉...</aside>
                <Link to='/signup'><button id='sign-up'>Sign up</button></Link>
            </div>
            <div id="content-right">
                <img  src='https://images.pexels.com/photos/1209843/pexels-photo-1209843.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' alt='image'/>
                <div id="overlay"></div>
            </div>
        </div>
    )
}

