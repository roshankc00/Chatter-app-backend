import { useEffect, useState } from 'react';
import './App.css';
import SignUp from './pages/Signup';
import Login from './pages/Login';
import { Route, Routes } from 'react-router-dom';
import Chat from './pages/Chat';
import Rooms from './pages/Rooms';
import CallMe from './components/Call';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:roomId" element={<Rooms />} />
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/call" element={<CallMe />} />
      </Routes>
    </div>
  );
}

export default App;
