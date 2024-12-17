import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Shop from './components/Shop'

const App = () => {
  return (
   <Routes>
     <Route path="/login" element={<Login />} />
     <Route path='/' element={<SignUp />} />
     <Route path='/shop' element={<Shop />} />
   </Routes>
  )
}

export default App
