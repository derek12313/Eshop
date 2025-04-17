import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    licenseKey: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!formData.username || !formData.password) {
        setError('Please enter username and password.');
        return;
      }
      //TODO: check if the input is valid, for now we assume it is
      onLogin(formData.username);
      console.log("[AuthPage]: user logging in");
      navigate('/', { replace: true });
    } else {
      if (!formData.licenseKey || !formData.username || !formData.password || !formData.confirmPassword || !formData.email) {
        setError('Please fill in all fields.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      //TODO: send a registration request to backend, for now we assume it always work
      onLogin(formData.username);
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form className="form" onSubmit={handleSubmit}>
          {!isLogin && (
            <label>
              License Key:
              <input
                type="text"
                name="licenseKey"
                value={formData.licenseKey}
                onChange={handleChange}
                required={!isLogin}
              />
            </label>
          )}
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          {!isLogin && (
            <>
              <label>
                Confirm Password:
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </label>
              <label>
                Email Address:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </label>
            </>
          )}
          {error && <p className="error">{error}</p>}
          <button className="submit-btn" type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
}
