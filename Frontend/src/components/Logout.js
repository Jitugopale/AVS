import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({style}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      setLoading(true);
      setTimeout(() => {
        try {
          localStorage.removeItem('token');
          navigate('/login');
        } catch (error) {
          console.error("Error during logout", error);
        } finally {
          setLoading(false);
        }
      }, 500); 
    }
  };

  return (
    <div role="alert">
      <button 
      style={style}
        className="btn btn-danger" 
        onClick={handleLogout} 
        disabled={loading} 
        aria-label="Logout button">
        {loading ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
};

export default Logout;
