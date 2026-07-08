import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import About from './Pages/project';
import Singup from './Pages/Signup';
import ProtectedRoute from './Pages/ProtectedRoute';
// import ForgotPassword from './Pages/Forgot';


function App() {
  return (
    <BrowserRouter>
      {/*    */}
      <Routes>
        <Route path='/' element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/aboutkc" element={
          <ProtectedRoute>
            <About />
          </ProtectedRoute>
        } />
        <Route path="/singup" element={<Singup />} />
        {/* <Route path="/forgot" element={<ForgotPassword />} /> */}
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  )
}
export default App