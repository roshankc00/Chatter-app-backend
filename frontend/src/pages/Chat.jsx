import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
const socket = io('http://localhost:3002');
const Chat = () => {
  const [message, setmessage] = useState('');
  const [messageList, setmessageList] = useState([]);

  const sendMessage = async () => {
    if (message !== '') {
      const messageData = {
        message,
      };
      socket.emit('send_message', messageData);
    }
  };
  useEffect(() => {
    socket.on('message', (data) => {
      setmessageList((prev) => [...prev, data?.message]);
      setmessage('');
    });
  }, [socket]);

  return (
    <div>
      <div>
        <ul>{messageList && messageList.map((item) => <li> {item}</li>)}</ul>
        <div className="container">
          <input
            type="text"
            value={message}
            onChange={(e) => setmessage(e.target.value)}
            className="input-messesage"
            onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button className="btn" onClick={(e) => sendMessage()}>
            send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
