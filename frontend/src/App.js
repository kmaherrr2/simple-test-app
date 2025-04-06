import { useEffect, useState } from 'react';

function App() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://168.119.254.41:5000/api/message')
            .then(res => res.json())
            .then(data => setMessage(data.message))
            .catch(console.error);
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h1>{message || "Loading..."}</h1>
        </div>
    );
}

export default App;
