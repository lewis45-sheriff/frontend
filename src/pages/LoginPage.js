import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import './LoginPage.css'; // Import the CSS file

const LoginPage = () => {
    const { loginUser } = useContext(AuthContext);

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={loginUser}>
                <h2>Login</h2> {/* Added a heading */}
                <input type="text" name="username" placeholder="Enter username" required />
                <input type="password" name="password" placeholder="Enter password" required />
                <input type="submit" value="Login" />
            </form>
        </div>
    );
}

export default LoginPage;
