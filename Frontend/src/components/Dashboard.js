import React from 'react';
import '../App.css'; 
import Logout from './Logout';  
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const navigate = useNavigate();

  const styles = {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)', 
      gap: '20px',
      justifyContent: 'center',
      alignItems: 'center',
      width: '80%', 
      maxWidth: '600px',
      margin: 'auto', 
      backgroundColor: '#ffffff', 
      borderRadius: '15px', 
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', 
      padding: '30px',
      animation: 'fadeIn 1s ease-in-out', 
    },
    wrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', 
      background: 'linear-gradient(135deg, #A2C2E8, #F3F8FF)', 
    },
    button: {
      padding: '16px 36px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#ffffff',
      backgroundColor: '#007bff',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)', 
      transition: 'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
      width: '100%', 
      minHeight: '50px', 
      letterSpacing: '1px', 
    },
    buttonHover: {
      backgroundColor: '#0056b3', 
      transform: 'scale(1.05)',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)', 
    },
    start: {
      position: 'absolute',
      top: '7px', 
      left: '3%',
      transform: 'translateX(-50%)', 
      zIndex: 10, 
    },
    buttonFocus: {
      outline: 'none',
      boxShadow: '0 0 10px rgba(0, 123, 255, 0.8)',
    },
    '@keyframes fadeIn': {
      '0%': { opacity: 0 },
      '100%': { opacity: 1 },
    },
  };
  
  

  return (
    <div style={styles.wrapper}>
      <Logout style={styles.start} />
      <div style={styles.container}>
      <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
          onClick={() => navigate('/aadhaar-verification')} // Navigate to Aadhaar Verification Page
        >
          Aadhaar
        </button>
        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
        >
          Passport
        </button>
        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
        >
          PAN
        </button>
        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
        >
          GST
        </button>
        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
        >
          Voter
        </button>
        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
        >
          Udyan Aadhar
        </button>
        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
        >
          PanLink Aadhar
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
