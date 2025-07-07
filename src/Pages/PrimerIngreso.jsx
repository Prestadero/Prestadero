import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const PrimerIngreso = () => {
  const [nuevaContraseña, setNuevaContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  
  // Ahora esperamos también el rol
  const { userId, role } = location.state || {};

  if (!userId) {
    return <div>Error: Usuario no identificado</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    if (nuevaContraseña !== confirmarContraseña) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (nuevaContraseña.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await axios.post('https://backend-auth-g9zk.onrender.com/auth/primer-ingreso', {
        userId,
        newPassword: nuevaContraseña,
      });

      // Redirige según el rol
      if (role === 'asesor') {
        navigate('/dashboard-asesor');
      } else {
        navigate('/dashboardusuario');
      }
    } catch (err) {
      console.error('Error al actualizar la contraseña:', err);
      setError('Error al actualizar la contraseña. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="prestadero-login-right">
      <div className="prestadero-login-card">
        <div className="prestadero-login-header">
          <h2>Primer Ingreso</h2>
          <p>Cambia tu contraseña para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="prestadero-login-form">
          <div className="prestadero-input-group">
            <label className="prestadero-input-label">Nueva Contraseña</label>
            <input
              type="password"
              className="prestadero-input-field"
              value={nuevaContraseña}
              onChange={(e) => setNuevaContraseña(e.target.value)}
              placeholder="Escribe una nueva contraseña"
              required
            />
          </div>

          <div className="prestadero-input-group">
            <label className="prestadero-input-label">Confirmar Contraseña</label>
            <input
              type="password"
              className="prestadero-input-field"
              value={confirmarContraseña}
              onChange={(e) => setConfirmarContraseña(e.target.value)}
              placeholder="Vuelve a escribir la contraseña"
              required
            />
          </div>

          {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}

          <button type="submit" className="prestadero-login-button">
            Guardar y continuar
          </button>
        </form>
      </div>
    </div>
  );
};

export default PrimerIngreso;
