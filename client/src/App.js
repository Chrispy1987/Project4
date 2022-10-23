import './App.css';
import './routes/common/toastAlert.css'
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { LandingPage } from './routes/landingPage/landingPage'
import { Login } from './routes/login/login'
import { SignUp } from './routes/signUp/signUp'
import { Home } from './routes/home/home'
import { ToastAlert } from './routes/common/toastAlert'
import { Logout } from './routes/logout/logout'
import { NewGroup } from './routes/newgroup/NewGroup'

function App() {
  const [session, setSession] = useState(Number(localStorage.getItem('user_id')))
  const [toast, setToast] = useState(null)

  // Toast pop-up control
  useEffect(() => {
    if (toast === null) {
      return;
    }
    let toastTimerId = setTimeout(() => {
      setToast(null)
    }, 2500)
    return () => {
        clearTimeout(toastTimerId)
    }}, [toast])

    // Tracking state of logged in user
    useEffect(() => {
      let userId = Number(localStorage.getItem('user_id'));
      if (userId === session) {
        return
      } else {
        localStorage.setItem('user_id', session) //store in local in case of page refresh
      }      
    }, [session])

  const handleToast = toast => {
    toast === 'close' ? setToast(null) : setToast(toast);
  }
  
  return (
    <div className="App">
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap" rel="stylesheet"></link>
      <BrowserRouter>
        <nav className={session && 'nav-bar-logged-in'}>
            <Link to='/'><button className={session ? 'logo logo-logged-in' : 'logo'}>Yewomi</button></Link>
            {!session ?
              <div id="nav-buttons">
                  <Link to='/login'><button className='button-v1'>Log in</button></Link>
                  <Link to='/signup'><button className='button-v2'>Sign up</button></Link>
              </div>
              :
              <div>
                <Logout handleToast={handleToast} setSession={setSession}/>
                <button>BURGER DROPDOWN</button> 
              </div>    
            }           
        </nav>
        <div className='spacer'>
          <ToastAlert toast={toast} handleToast={handleToast} />
        </div>
        <section>
          {!session ?
            // NOT LOGGED IN
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element= {<Login handleToast={handleToast} setSession={setSession} />}/>
                <Route path="/signup" element={<SignUp />} />                
            </Routes>
            :
            // LOGGED IN
            <Routes>
              <Route path="/" element={<Home handleToast={handleToast} session={session}/>} />
              <Route path="/create" element={<NewGroup handleToast={handleToast} session={session}/>} />
            </Routes>
          }
        </section>  
      </BrowserRouter>
    </div>
  );
}

export default App;
