import React, { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'http://168.119.254.41:5000';

function App() {
    const [message, setMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [view, setView] = useState('login');

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetch(`${API_URL}/api/message`)
            .then((res) => res.json())
            .then((data) => setMessage(data.message))
            .catch((err) => console.error('Fetch error:', err));

        const socket = new WebSocket(`ws://${API_URL.replace('http://', '')}/ws`);

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

        if (token) {
            fetchUserProfile(token);
        }

        return () => {
            socket.close();
        };
    }, [token]);

    const fetchUserProfile = async (authToken) => {
        try {
            const response = await fetch(`${API_URL}/api/profile`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCurrentUser(data.user);
                setView('profile');
            } else {
                localStorage.removeItem('token');
                setToken('');
                setCurrentUser(null);
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${API_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Registration successful! You can now log in.');
                setUsername('');
                setEmail('');
                setPassword('');
                setTimeout(() => setView('login'), 2000);
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('Server error. Please try again later.');
            console.error('Registration error:', err);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Login successful!');
                setPassword('');
                setToken(data.token);
                localStorage.setItem('token', data.token);
                setCurrentUser(data.user);
                setView('profile');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Server error. Please try again later.');
            console.error('Login error:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken('');
        setCurrentUser(null);
        setView('login');
        setSuccess('Logged out successfully');
    };

    const renderLoginForm = () => (
        <div className="auth-form">
            <h2>Login</h2>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="auth-button">Login</button>
            </form>
            <p>
                Don't have an account?{' '}
                <button className="link-button" onClick={() => setView('register')}>
                    Register
                </button>
            </p>
        </div>
    );

    const renderRegisterForm = () => (
        <div className="auth-form">
            <h2>Register</h2>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="auth-button">Register</button>
            </form>
            <p>
                Already have an account?{' '}
                <button className="link-button" onClick={() => setView('login')}>
                    Login
                </button>
            </p>
        </div>
    );

    const renderProfile = () => (
        <div className="profile">
            <h2>Welcome, {currentUser?.username}!</h2>
            <div className="profile-info">
                <p><strong>Username:</strong> {currentUser?.username}</p>
                <p><strong>Email:</strong> {currentUser?.email}</p>
                <p><strong>Joined:</strong> {new Date(currentUser?.created_at).toLocaleDateString()}</p>
            </div>
            <button className="auth-button logout-button" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>My App</h1>
                <p className="server-message">{message}</p>
            </header>

            <main className="app-main">
                {view === 'login' && renderLoginForm()}
                {view === 'register' && renderRegisterForm()}
                {view === 'profile' && renderProfile()}
            </main>
        </div>
    );
}

export default App;
