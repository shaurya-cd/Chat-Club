import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from "./store/useThemeStore";

function App() {

  const {isCheckingAuth,authUser,checkAuth} = useAuthStore()
  const { theme } = useThemeStore();

  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  console.log(authUser) 

  if (isCheckingAuth && !authUser) return(
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin"/>
    </div>
  )

  return (
    <div className='h-[130vh]' data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser ? <SignUp /> : <Navigate to="/" />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/profile' element={authUser ? <Profile /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App