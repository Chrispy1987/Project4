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

function App() {
  const [session, setSession] = useState(Number(localStorage.getItem('user_id')))
  const [toast, setToast] = useState(null)
  const [panel, setPanel] = useState('groups')

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
    <div className="App fade-in">
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap" rel="stylesheet"></link>
      <BrowserRouter>
        <nav className={session && 'nav-bar-logged-in'}>            
            {!session ?
            <>
              <Link to='/'><button onClick={()=>setPanel('groups')} className={session ? 'logo logo-logged-in' : 'logo'}>Yewomi</button></Link>
              <div id="nav-buttons">
                  <Link to='/login'><button className='button-v1'>Log in</button></Link>
                  <Link to='/signup'><button className='button-v2'>Sign up</button></Link>
              </div>
            </>
            :
            <>
              <button onClick={()=>setPanel('groups')} className={session ? 'logo logo-logged-in' : 'logo'}>Yewomi</button>
              <div>
                <Logout handleToast={handleToast} setSession={setSession} setPanel={setPanel} />
                {/* <button>BURGER DROPDOWN</button>  */}
              </div> 
            </>   
            }           
        </nav>
        <div className='spacer'>
          <ToastAlert toast={toast} handleToast={handleToast}/>
        </div>
        <section>
          {!session ?
            // NOT LOGGED IN
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element= {<Login handleToast={handleToast} setSession={setSession} />}/>
                <Route path="/signup" element={<SignUp handleToast={handleToast}/>} />                
            </Routes>
            :
            // LOGGED IN
            <Routes>
              <Route path="/" element={<Home handleToast={handleToast} session={session} panel={panel} setPanel={setPanel}/>} />
            </Routes>
          }
        </section>  
      </BrowserRouter>
    </div>
  );
}

export default App;
