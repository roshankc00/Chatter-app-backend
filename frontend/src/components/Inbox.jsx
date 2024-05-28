import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getData } from '../services/axios';
import Navbar from './Navbar';
import { gemRoomName } from '../../roomgen';
import axios from 'axios';
import ReactPlayer from 'react-player';
import peer from '../peer';
import { io } from 'socket.io-client';
const socket = io('http://localhost:3002');
const Inbox = () => {
  const { userId, name } = useSelector((state) => state.auth);
  const [users, setusers] = useState([]);
  const [message, setmessage] = useState('');
  const [messageList, setmessageList] = useState([]);
  const [stream, setstream] = useState(null);
  const sendMessage = async () => {
    if (message !== '') {
      const messageData = {
        content: message,
        chatId: 2,
        userId,
        name,
      };
      console.log(messageData);
      socket.emit('user_message', messageData);
    }
  };
  useEffect(() => {
    socket.emit('join_room', { chatId: 2 });
  }, [socket]);

  useEffect(() => {
    socket.on(`user_joined`, (data) => {
      console.log(data);
    });
  }, [socket]);
  useEffect(() => {
    socket.on(`messages`, (data) => {});
  }, [socket]);

  const getAllUsers = async () => {
    const users = await axios.get('http://localhost:3002/users');
    setusers(users?.data);
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setstream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit('call:accepted', { to: from, ans });
    },
    [socket],
  );

  const sendStreams = useCallback(() => {
    for (const track of stream.getTracks()) {
      peer.peer.addTrack(track, stream);
    }
  }, [stream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log('Call Accepted!');
      sendStreams();
    },
    [sendStreams],
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit('peer:nego:needed', { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener('negotiationneeded', handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit('peer:nego:done', { to: from, ans });
    },
    [socket],
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    socket.on('incomming_call', handleIncommingCall);
  }, [socket]);
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl py-4 sm:py-6 lg-py-8 mt-10 border ">
        {stream && (
          <>
            <h1>My Stream</h1>
            <ReactPlayer
              playing
              muted
              height="100px"
              width="200px"
              url={stream}
            />
          </>
        )}
        <h1>"snjns"</h1>
        <div className="grid grid-cols-4  py-5 min-h-[100vh] ">
          <div className="col-span-1 border-r">
            {users &&
              users
                ?.filter((item) => item.id != userId)
                ?.map((user) => (
                  <div
                    key={user.id}
                    className="flex gap-4 justify-center py-4 border-b cursor-pointer"
                    onClick={() => setroom(gemRoomName(user.id, userId))}
                  >
                    <h5 className="bg-blue-600 text-white h-10 w-10 rounded-full text-2xl flex justify-center items-center">
                      {user.name[0]}
                    </h5>
                    <h1>{user.name}</h1>
                  </div>
                ))}
          </div>
          <div className="col-span-3">
            <ul>
              {messageList && messageList.map((item) => <li> {item}</li>)}
            </ul>
            <div className="flex gap-2 items-center justify-center">
              <input
                type="text"
                className="border p-2"
                value={message}
                onChange={(e) => setmessage(e.target.value)}
              />
              <button
                onClick={() => sendMessage()}
                className="bg-blue-500 text-white p-1 rounded-md px-5 ms-2"
              >
                {' '}
                Send
              </button>
              <button
                onClick={() => handleCallUser()}
                className="bg-blue-500 text-white p-1 rounded-md px-5 ms-2"
              >
                Call
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Inbox;
