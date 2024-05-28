import React, { useEffect, useCallback, useState } from 'react';
import ReactPlayer from 'react-player';
import { io } from 'socket.io-client';
import peer from '../peer';
import { useSelector } from 'react-redux';
import axios from 'axios';

const socket = io('http://localhost:3002');

const CallMe = () => {
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [typing, setTyping] = useState(false); // New state for typing indicator
  const { userId, name } = useSelector((state) => state.auth);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit('user_call', { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId]);

  const handleUserJoined = useCallback((data) => {
    setRemoteSocketId(data.id);
  }, []);

  const handleIncomingCall = useCallback(async ({ from, offer }) => {
    setRemoteSocketId(from);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
    const ans = await peer.getAnswer(offer);
    socket.emit('call_accepted', { to: from, ans });
  }, []);

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      sendStreams();
    },
    [sendStreams],
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit('peer_nego_needed', { offer, to: remoteSocketId });
  }, [remoteSocketId]);

  useEffect(() => {
    peer.peer.addEventListener('negotiationneeded', handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncoming = useCallback(async ({ from, offer }) => {
    const ans = await peer.getAnswer(offer);
    socket.emit('peer_nego_done', { to: from, ans });
  }, []);

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  const handleSendMessage = useCallback(() => {
    socket.emit('user_message', { chatId: 1, content: message, name, userId });
    setMessage('');
  }, [message, userId, name]);

  const handleNewMessage = useCallback((msg) => {
    setMessages((prevMessages) => [...prevMessages, msg]);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener('track', async (ev) => {
      const remoteStream = ev.streams;
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on('user_joined', handleUserJoined);
    socket.on('incoming_call', handleIncomingCall);
    socket.on('call_accepted', handleCallAccepted);
    socket.on('peer_nego_needed', handleNegoNeedIncoming);
    socket.on('peer_nego_done', handleNegoNeedFinal);
    socket.on('messages', handleNewMessage);
    return () => {
      socket.off('user_joined', handleUserJoined);
      socket.off('incoming_call', handleIncomingCall);
      socket.off('call_accepted', handleCallAccepted);
      socket.off('peer_nego_needed', handleNegoNeedIncoming);
      socket.off('peer_nego_done', handleNegoNeedFinal);
      socket.off('messages', handleNewMessage);
    };
  }, [
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegoNeedIncoming,
    handleNegoNeedFinal,
    handleNewMessage,
  ]);

  useEffect(() => {
    socket.emit('join_room', { chatId: 1 });
  }, []);

  const getAllMessages = async () => {
    const data = await axios.get(`http://localhost:3002/chats/1`);
    console.log(data?.data?.messages);
    const newData = data?.data?.messages?.map((item) => ({
      name: item.user.name,
      content: item.content,
    }));
    setMessages(newData);
  };

  useEffect(() => {
    getAllMessages();
  }, []);

  // Function to handle typing indicator
  const handleTyping = useCallback(() => {
    socket.emit('start_typing', { chatId: 1, name, userId });
    // Set typing to false after a delay
    setTimeout(() => {
      socket.emit('end_typing', { chatId: 1, name, userId });
    }, 1000); // Adjust delay as needed
  }, [name, userId.socket]);

  return (
    <div className="pb-80">
      {myStream && <button onClick={sendStreams}>Send Stream</button>}
      {remoteSocketId && <button onClick={handleCallUser}>Call</button>}
      {myStream && (
        <>
          <h1>My Stream</h1>
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={myStream}
          />
        </>
      )}
      {remoteStream && (
        <>
          <h1>Remote Stream</h1>
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={remoteStream}
          />
        </>
      )}

      <div className="border p-4 justify-center">
        <h2>Enjoy Chatting</h2>
        <ul>
          {messages.map((msg, index) => (
            <>
              {msg.name === name ? (
                <li
                  className="border border-black p-3 rounded-md"
                  key={index}
                >{`${msg.name}: ${msg.content}`}</li>
              ) : (
                <li
                  className="border border-black p-3 rounded-md bg-blue-600 text-white"
                  key={index}
                >{`${msg.name}: ${msg.content}`}</li>
              )}
            </>
          ))}
        </ul>
        <input
          type="text"
          className="border border-black"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping} // Trigger typing indicator on key press
        />
        {console.log(typing)}
        <button onClick={handleSendMessage}>Send Message</button>
        {typing && <p>Typing...</p>} {/* Display typing indicator */}
      </div>
    </div>
  );
};

export default CallMe;
