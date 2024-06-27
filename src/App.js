// src/components/Company.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// const socket = io('http://localhost:4000');
const socket = io('https://avatarapp-backend-vxgd.onrender.com');

const Company = () => {
    const [companyId, setCompanyId] = useState('company_1');
    const [projectId, setProjectId] = useState('project_1');
    const [userId, setUserId] = useState('');
    const [content, setContent] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.emit('joinRoom', { senderId: projectId, receiverId: userId });

        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [companyId]);

    const sendReply = () => {
        if (userId != '') {
            socket.emit('sendReply', { senderId: projectId, receiverId: userId, companyId: companyId, content });
            setContent('');
        }
    };

    return (
        <div>
            <h2>Company Messaging</h2>
            <input type="text" value={companyId} readOnly />
            <input type="text" value={projectId} readOnly />
            <input
                type="text"
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            <input
                type="text"
                placeholder="Reply Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button onClick={sendReply}>Send Reply</button>
            <div>
                <h3>Messages</h3>
                {messages.map((msg, index) => (
                    <div key={index}>{`Sender: ${msg.sender}, Content: ${msg.content}`}</div>
                ))}
            </div>
        </div>
    );
};

export default Company;
