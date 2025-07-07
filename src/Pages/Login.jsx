import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaLock, FaArrowLeft } from 'react-icons/fa';
import './Login.css';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [recaptchaChecked, setRecaptchaChecked] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboardusuario';

  useEffect(() => {
    document.body.classList.add('login-page');
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recaptchaChecked) {
      alert("Por favor confirma que no eres un robot.");
      return;
    }

    try {
      const res = await axios.post('https://backend-auth-g9zk.onrender.com/auth/login', {
        username,
        password,
        recaptchaToken: 'test-token' // Simulado en modo dev
      });
        if (res.data.success) {
  localStorage.setItem("authToken", res.data.token); // ahora sí es un JWT real
  localStorage.setItem("user", JSON.stringify(res.data));
}

      const { success, isFirstLogin, userId, role, message } = res.data;

      if (success) {
        if (isFirstLogin) {
          navigate('/primer-ingreso', { state: { userId, role } });
        } else {
          navigate(role === 'asesor' ? '/dashboard-asesor' : '/dashboardusuario');
        }
      } else {
        alert(message || 'Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error en login:', error);
      alert('Error al iniciar sesión');
    }
  };

  const handleGoBack = () => navigate(-1);

  return (
    <div className="prestadero-split-login-container">
      <button className="prestadero-back-button" onClick={handleGoBack}>
        <FaArrowLeft /> Volver
      </button>

      <div className="prestadero-login-left">
        <div className="prestadero-brand-overlay">
          <div className="prestadero-logo">
            <span className="prestadero-logo-main">PRESTADERO</span>
            <span className="prestadero-logo-sub">FINTECH</span>
          </div>
          <h2>Soluciones Financieras a tu Alcance</h2>
          <p>Préstamos rápidos y seguros con las mejores tasas del mercado</p>
        </div>
      </div>

      <div className="prestadero-login-right">
        <div className="prestadero-login-card">
          <div className="prestadero-login-header">
            <h2>Iniciar Sesión</h2>
            <p>Accede a tu cuenta para gestionar tus préstamos</p>
          </div>

          <form onSubmit={handleSubmit} className="prestadero-login-form">
            <div className="prestadero-input-group">
              <label htmlFor="prestadero-username" className="prestadero-input-label">
                <FaUser className="prestadero-input-icon" />
                Usuario
              </label>
              <input
                id="prestadero-username"
                type="text"
                className="prestadero-input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                required
              />
            </div>

            <div className="prestadero-input-group">
              <label htmlFor="prestadero-password" className="prestadero-input-label">
                <FaLock className="prestadero-input-icon" />
                Contraseña
              </label>
              <input
                id="prestadero-password"
                type="password"
                className="prestadero-input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>

            <div className="prestadero-options-row">
              <div className="prestadero-remember">
                <input
                  type="checkbox"
                  id="prestadero-remember"
                  className="prestadero-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="prestadero-remember" className="prestadero-remember-label">
                  Recordarme
                </label>
              </div>
              <a href="#" className="prestadero-forgot-link">¿Olvidaste tu contraseña?</a>
            </div>

            {/* CAPTCHA SIMULADO */}
            <div className="prestadero-input-group">
              <input
                type="checkbox"
                id="fake-captcha"
                checked={recaptchaChecked}
                onChange={(e) => setRecaptchaChecked(e.target.checked)}
              />
              <label htmlFor="fake-captcha" style={{ color: '#ffd700', marginLeft: '8px' }}>
                No soy un robot (modo test)
              </label>
            </div>

            <button type="submit" className="prestadero-login-button">
              Entrar
            </button>
          </form>

          <div className="prestadero-register-link">
            ¿No tienes cuenta? <a href="http://localhost:3000/it/solicita-credito" className="prestadero-register-text">Solicita tu crédito aquí</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
