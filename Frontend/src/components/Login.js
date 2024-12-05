import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const styles = {
  container: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  headingLogin: {
    fontSize: '2rem',
    color: '#4A90E2',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  formControl: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '12px',
    width: '100%',
    fontSize: '1rem',
    marginBottom: '15px',
    transition: 'border-color 0.3s ease-in-out',
  },
  formControlFocus: {
    borderColor: '#4A90E2',
    outline: 'none',
    boxShadow: '0 0 5px rgba(74, 144, 226, 0.6)',
  },
  btn: {
    backgroundColor: '#4A90E2',
    color: 'white',
    fontSize: '1.1rem',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    width: '100%',
    marginBottom: '15px',
  },
  btnHover: {
    backgroundColor: '#357ABD',
  },
  btnDisabled: {
    backgroundColor: '#A3C4E2',
    cursor: 'not-allowed',
  },
  alert: {
    backgroundColor: '#F8D7DA',
    color: '#721C24',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  alertSuccess: {
    backgroundColor: '#D4EDDA',
    color: '#155724',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  mt3: {
    fontSize: '1rem',
  },
  link: {
    color: '#4A90E2',
    textDecoration: 'none',
  }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [clickedFields, setClickedFields] = useState({
    email: false,
    password: false,
  });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      if (response.data.authToken) {
        localStorage.setItem('token', response.data.authToken);
        localStorage.setItem('userId', response.data.userId);
        setEmail(''); 
        setPassword(''); 
        console.log("Login successful, redirecting to DemoPage...");
        navigate('/dashboard');
      } else {
        setError("Invalid login credentials.");
      }
    } catch (error) {
      console.error('Login failed', error);
      setError(
        error.response?.data?.message || 
        'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputClick = (field) => {
    setClickedFields((prev) => ({
      ...prev,
      [field]: true, 
    }));
  };

  return (
    <div className="container contain-2 mt-5" style={styles.container}>
      <h2 className='heading-login' style={styles.headingLogin}>Login</h2>
      <form onSubmit={handleLogin}>
        {error && <div className="alert alert-danger" aria-live="polite" style={styles.alert}>{error}</div>}
        <div className="mb-3">
          <label htmlFor="email">{clickedFields.email ? "Email" : ""}</label>
          <input
            type="email"
            className="form-control control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.formControl}
            aria-label="Email"
            onClick={() => handleInputClick('email')} 
            placeholder={clickedFields.email ? "" : "Email"} 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password">{clickedFields.password ? "Password" : ""}</label>
          <input
            type="password"
            className="form-control control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.formControl}
            aria-label="Password"
            onClick={() => handleInputClick('password')} 
            placeholder={clickedFields.password ? "" : "Password"} 
          />
        </div>
        <button type="submit" className="btn bn bn-primary btn-primary" style={loading ? { ...styles.btn, ...styles.btnDisabled } : styles.btn} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="mt-3">
        <p style={styles.mt3}>
          Not registered? <Link to="/register" style={styles.link}>Go to Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
