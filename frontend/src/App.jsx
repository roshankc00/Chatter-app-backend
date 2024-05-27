import { useEffect, useState } from 'react';
import './App.css';
import SignUp from './pages/Signup';
import Login from './pages/Login';
import { Route, Routes } from 'react-router-dom';
import Chat from './pages/Chat';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/chat" element={<Chat />} />
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
