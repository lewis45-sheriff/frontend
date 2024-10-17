import { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  // Initializing state
  const [user, setUser] = useState(() =>
    localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null
  );
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
  );
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Login user function
  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: e.target.username.value,
          password: e.target.password.value,
        }),
      });

      const data = await response.json();

      if (response.ok && data) {
        localStorage.setItem('authTokens', JSON.stringify(data));
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        navigate('/');
      } else {
        alert('Invalid login credentials. Please try again.');
      }
    } catch (error) {
      alert('Network error occurred. Please check your connection and try again.');
      console.error('Login error:', error); // Ensure sensitive errors are not exposed in production
    }
  };

  // Register user function
  const registerUser = async (e) => {
   
    try {
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: e.target.username.value,
          email: e.target.email.value,
          password: e.target.password.value,
        }),
      });

      const data = await response.json();

      if (response.ok && data) {
        localStorage.setItem('authTokens', JSON.stringify(data));
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        navigate('/');
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      alert('Network error occurred. Please check your connection and try again.');
      console.error('Registration error:', error);
    }
  };

  // Logout user function
  const logoutUser = () => {
    localStorage.removeItem('authTokens');
    setAuthTokens(null);
    setUser(null);
    navigate('/login');
  };

  // Refresh token function
  const updateToken = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: authTokens?.refresh }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem('authTokens', JSON.stringify(data));
      } else {
        logoutUser();
      }

      if (loading) {
        setLoading(false);
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      logoutUser(); // If token refresh fails, log out the user
    }
  };

  // Effect to handle token refresh and user login state
  useEffect(() => {
    if (loading) {
      updateToken();
    }

    // Refresh token interval (4 minutes before expiry)
    const REFRESH_INTERVAL = 1000 * 60 * 4; // Refresh every 4 minutes
    const interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [authTokens, loading]);

  // Context data to be provided
  const contextData = {
    user,
    authTokens,
    loginUser,
    registerUser, // Added registration function
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};
