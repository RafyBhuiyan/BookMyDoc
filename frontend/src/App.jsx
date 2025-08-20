import { useState } from 'react';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    const url = isLogin ? `http://localhost:8000/api/login` : `http://localhost:8000/api/register`;
    const payload = isLogin
      ? { email: form.email, password: form.password }
      : { name: form.name, email: form.email, password: form.password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(isLogin ? 'Login successful!' : 'Registration successful!');
      } else {
        setMessage(data.message || 'Error');
      }
    } catch (err) {
      setMessage('Network error');
    }
  };

  return (
    <div style={{ maxWidth: 320, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: '100%', marginBottom: 8, padding: 8 }}
            />
          </div>
        )}
        <div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: '100%', marginBottom: 8, padding: 8 }}
          />
        </div>
        <div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: '100%', marginBottom: 8, padding: 8 }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: 8 }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <button
        onClick={() => {
          setIsLogin(!isLogin);
          setMessage('');
        }}
        style={{ marginTop: 12, width: '100%', padding: 8, background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}
      >
        {isLogin ? 'No account? Register' : 'Have an account? Login'}
      </button>
      {message && <div style={{ marginTop: 12, color: 'red' }}>{message}</div>}
    </div>
  );
}

export default App;