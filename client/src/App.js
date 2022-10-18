import './App.css';
import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { LandingPage } from './routes/landingPage/landingPage'
import { Login } from './routes/login/login'
import { SignUp } from './routes/signUp/signUp'
import { Home } from './routes/home/home'


function App() {

  const [session, setSession] = useState(null)

  return (
    <div className="App">
      <BrowserRouter>
        <nav>
            <Link to='/'><h1 id="logo">Yewomi</h1></Link>
            {session ? 
              <div>[REFLECT LOGGED IN DROPDOWN HERE]</div>
            :
              <div id="nav-buttons">
                  <Link to='/login'><button id='log-in'>Log in</button></Link>
                  <Link to='/signup'><button id='sign-up'>Sign up</button></Link>
              </div>
            }           
        </nav>
        <section>
            <Routes>
                <Route path="/" element={<LandingPage/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/signup" element={<SignUp/>} />
                <Route path="/home" element={<Home/>} />
            </Routes>
        </section>  
      </BrowserRouter>
    </div>
  );
}

export default App;
