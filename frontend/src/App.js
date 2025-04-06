import React, { useEffect, useState } from 'react';

function App() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://168.119.254.41:5000/api/message')
            .then((res) => res.json())
            .then((data) => setMessage(data.message))
            .catch((err) => console.error('Fetch error:', err));

        const socket = new WebSocket('ws://168.119.254.41:5000/ws');

        socket.onopen = () => {
            console.log('Connected to WebSocket');
            socket.send('Hello from client!');
        };

        socket.onmessage = (event) => {
            console.log('WebSocket message:', event.data);
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <div>
            <h1>Frontend</h1>
            <p>{message}</p>
        </div>
    );
}

export default App;
