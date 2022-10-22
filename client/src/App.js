import './App.css';
import './routes/common/toastAlert.css'
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { helper } from './js/components/helper'
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

  // toast pop-up control
  // (?) Any way of resetting the timer, if button is clicked again during timeOut?
  useEffect(() => {
    if (toast === null) {
      return;
    }
    let toastTimerId = setTimeout(() => {
      setToast(null)
    }, 3500)
    return () => {
        clearTimeout(toastTimerId)
    }}, [toast])

    // tracking state of logged in user
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
                <Route path="/" element={<LandingPage key={helper.getKey()}/>} />
                <Route path="/login" element= {<Login key={helper.getKey()} handleToast={handleToast} setSession={setSession} />}/>
                <Route path="/signup" element={<SignUp key={helper.getKey()}/>} />                
            </Routes>
            :
            // LOGGED IN
            <Routes>
              <Route path="/" element={<Home key={helper.getKey()} handleToast={handleToast} session={session}/>} />
              <Route path="/create" element={<NewGroup key={helper.getKey()} handleToast={handleToast} session={session}/>} />
            </Routes>
          }
        </section>  
      </BrowserRouter>
    </div>
  );
}

export default App;
