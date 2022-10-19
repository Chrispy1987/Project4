import './App.css';
import './routes/common/toastAlert.css'
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { LandingPage } from './routes/landingPage/landingPage'
import { Login } from './routes/login/login'
import { SignUp } from './routes/signUp/signUp'
import { Home } from './routes/home/home'
import { ToastAlert } from './routes/common/toastAlert'
import { logout } from './routes/logout/logout'


function App() {

  const [session, setSession] = useState(localStorage.getItem('user_id'))
  const [toast, setToast] = useState(null)

  // toast pop-up control
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

    // tracking state of logged in user
    useEffect(() => {
      let userId = localStorage.getItem('user_id');
      if (userId === session) {
        return
      } else {
        localStorage.setItem('user_id', session) //store in local in case of page refresh
      }      
    }, [session])

  const handleToast = message => {
    message === 'close' ? setToast(null) : setToast(message);
  }
  
  return (
    <div className="App">
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap" rel="stylesheet"></link>
      <BrowserRouter>
        <nav className={session && 'nav-bar-logged-in'}>
            <Link to='/'><button className={session ? 'logo logo-logged-in' : 'logo'}>Yewomi</button></Link>
            {!session ?
              <div id="nav-buttons">
                  <Link to='/login'><button id='log-in'>Log in</button></Link>
                  <Link to='/signup'><button id='sign-up'>Sign up</button></Link>
              </div>
              :
              <div><button onClick={logout}>LOGOUT</button>[REFLECT LOGGED IN DROPDOWN HERE]</div>
            }           
        </nav>
        <div className='spacer'>
          <ToastAlert message={toast} handleToast={handleToast} />
        </div>
        <section>
          {!session ?
            <Routes>
                <Route path="/" element={<LandingPage/>} />
                <Route path="/login" element= {<Login handleToast={handleToast} setSession={setSession} />}/>
                <Route path="/signup" element={<SignUp/>} />                
            </Routes>
            :
            <Routes>
              <Route path="/home" element={<Home/>} />
            </Routes>
          }
        </section>  
      </BrowserRouter>
    </div>
  );
}

export default App;
