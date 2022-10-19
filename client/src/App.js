import './App.css';
import './routes/common/toastAlert.css'
import { useEffect, useState, useRef } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { LandingPage } from './routes/landingPage/landingPage'
import { Login } from './routes/login/login'
import { SignUp } from './routes/signUp/signUp'
import { Home } from './routes/home/home'
import { ToastAlert } from './routes/common/toastAlert'


function App() {

  const [session, setSession] = useState(null)
  const [toast, setToast] = useState(null)

 // (?) Any way of resetting the timer, if button is clicked again during timeOut?
  useEffect(() => {
    if (toast === null) {
      return;
    }
    let toastTimerId = setTimeout(() => {
      setToast(null)
    }, 5000)
    return () => {
        clearTimeout(toastTimerId)
    }}, [toast])

  const handleToast = message => {
    message === 'close' ? setToast(null) : setToast(message);
  }
  
  return (
    <div className="App">
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap" rel="stylesheet"></link>
      <BrowserRouter>
        <nav>
            <Link to='/'><button id="logo">Yewomi</button></Link>
            {session ? 
              <div>[REFLECT LOGGED IN DROPDOWN HERE]</div>
            :
              <div id="nav-buttons">
                  <Link to='/login'><button id='log-in'>Log in</button></Link>
                  <Link to='/signup'><button id='sign-up'>Sign up</button></Link>
              </div>
            }           
        </nav>
        <div className='spacer'>
          <ToastAlert message={toast} handleToast={handleToast} />
        </div>
        <section>            
            <Routes>
                <Route path="/" element={<LandingPage/>} />
                <Route path="/login" element= {<Login handleToast={handleToast} />}/>
                <Route path="/signup" element={<SignUp/>} />
                <Route path="/home" element={<Home/>} />
            </Routes>
        </section>  
      </BrowserRouter>
    </div>
  );
}

export default App;
