import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Header.css'; // Importing the external CSS file

const Header = () => {
    let { user, logoutUser } = useContext(AuthContext);

    return (
        <header className="header-container">
            {/* Home Link */}
            <div className="nav-links">
                <Link to="/" className="nav-item">Home</Link>

                {/* Conditional rendering based on user login status */}
                {user ? (
                    <>
                        {/* Logout option if the user is logged in */}
                        <span className="nav-item logout-btn" onClick={logoutUser}>Logout</span>
                        <p className="welcome-message">Welcome, {user.username}!</p>
                    </>
                ) : (
                    <>
                        {/* Login and Register links if the user is not logged in */}
                        <Link to="/login" className="nav-item">Login</Link>
                        <Link to="/register" className="nav-item">Register</Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
