import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Shop from './components/Shop'
import Profile from "./components/Profile"
import CreateProduct from './components/CreateProduct'
import ProtectedRoute from './components/ProtectedRoute'
import Cart from './components/Cart'

const App = () => {
  return (
   <Routes>
     <Route path="/login" element={<Login />} />
     <Route path='/' element={<SignUp />} />
        <Route path='/shop' element={
            <ProtectedRoute>
                <Shop />
            </ProtectedRoute>
        } />
        <Route path='/user/profile' element={
            <ProtectedRoute>
                <Profile />
            </ProtectedRoute>
        } />
        <Route path='/cart' element={
            <ProtectedRoute>
                <Cart />
            </ProtectedRoute>
        } />
     <Route path='/owner/createproduct' element={<CreateProduct />} />
   </Routes>
  )
}

export default App
