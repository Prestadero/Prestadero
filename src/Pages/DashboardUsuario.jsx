// src/Pages/DashboardUsuario.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid, Card, Typography, Button, Tooltip, IconButton
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EmailIcon from '@mui/icons-material/Email';
import HelpIcon from '@mui/icons-material/Help';
import MenuIcon from '@mui/icons-material/Menu';
import './DashboardUsuario.css';

const DashboardUsuario = () => {
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Datos de solicitudes de crédito
  const [solicitudes, setSolicitudes] = useState([]);
  // Archivos a subir
  const [files, setFiles] = useState({ cedula: null, certificacion: null });
  const [msgUpload, setMsgUpload] = useState('');

  // Ocultar navbar global y manejar sidebar en móvil
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 900;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    const navbar = document.querySelector('.navbar');
    if (navbar) navbar.style.display = 'none';

    return () => {
      window.removeEventListener('resize', checkIsMobile);
      if (navbar) navbar.style.display = 'flex';
    };
  }, []);

  // Logout al recargar o cerrar pestaña
  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  // Fetch de solicitudes de crédito
  useEffect(() => {
    const fetchCredito = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const { data } = await axios.get('http://localhost:3008/secure/credito', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSolicitudes(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCredito();
  }, []);

  // Nombre del usuario desde localStorage
  const stored = JSON.parse(localStorage.getItem('user')) || {};
  const nombreUsuario = stored.usuario || 'Usuario';

  const menuItems = [
    { name: 'Dashboard', icon: <DashboardIcon /> },
    { name: 'Accounts', icon: <AccountBalanceIcon /> },
    { name: 'Cards', icon: <CreditCardIcon /> },
    { name: 'Transactions', icon: <SwapHorizIcon /> },
    { name: 'Analytics', icon: <AnalyticsIcon /> },
    { name: 'Settings', icon: <SettingsIcon /> }
  ];

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleUpload = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const form = new FormData();
      if (files.cedula) {
        form.append('file', files.cedula);
        form.append('tipoDocumento', 'cedula');
        await axios.post('http://localhost:3008/secure/upload', form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
      }
      if (files.certificacion) {
        form.set('file', files.certificacion);
        form.set('tipoDocumento', 'certificacion');
        await axios.post('http://localhost:3008/secure/upload', form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
      }
      setMsgUpload('Documento(s) subido(s) correctamente');
    } catch {
      setMsgUpload('Error al subir archivo(s)');
    }
  };

  return (
    <div className="dashboard-container">
      {isMobile && (
        <div className="mobile-top-bar">
          <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>
            <MenuIcon style={{ color: '#ffd700' }} />
          </IconButton>
          <Typography variant="h6" className="app-name">Prestadero</Typography>
        </div>
      )}

      <div className={`sidebar ${sidebarOpen ? 'open' : ''} ${isMobile ? 'mobile' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-circle">
            <Typography variant="h6">P</Typography>
          </div>
          <Typography variant="h6" className="app-name">Prestadero</Typography>
        </div>
        <div className="sidebar-menu">
          {menuItems.map((item, idx) => (
            <div
              key={idx}
              className={`menu-item ${activeSection === item.name ? 'active' : ''}`}
              onClick={() => {
                setActiveSection(item.name);
                if (isMobile) setSidebarOpen(false);
              }}
            >
              {item.icon}
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="main-content">
        <div className="dashboard-header">
          <div className="header-left">
            <Typography variant="h5" className="welcome-title">
              Bienvenido, <strong>{nombreUsuario}</strong>
            </Typography>
            <Typography variant="subtitle1" className="date-info">
              Today is {new Date().toLocaleDateString()}
            </Typography>
          </div>
          <div className="header-right">
            <div className="header-icons">
              <Tooltip title="Profile"><IconButton><PersonIcon /></IconButton></Tooltip>
              <Tooltip title="Notifications"><IconButton><NotificationsIcon /></IconButton></Tooltip>
              <Tooltip title="Messages"><IconButton><EmailIcon /></IconButton></Tooltip>
              <Tooltip title="Help"><IconButton><HelpIcon /></IconButton></Tooltip>
            </div>
            <Button variant="contained" className="download-btn">
              Reportar falla
            </Button>
          </div>
        </div>

        {/* Solicitudes de crédito */}
        <div className="section">
          <Typography variant="h6" className="section-title">
            Mis Solicitudes de Crédito
          </Typography>
          {solicitudes.length === 0 ? (
            <Typography>No tienes solicitudes de crédito.</Typography>
          ) : (
            <table className="du-credito-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Monto</th>
                  <th>Cuotas</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map(s => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.monto}</td>
                    <td>{s.cuotas}</td>
                    <td>{s.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Subida de documentos */}
        <div className="du-upload-section">
          <Typography variant="h6">Subir Documentos</Typography>
          <div className="du-upload-fields">
            <label>
              Cédula:
              <input type="file" name="cedula" accept=".pdf,.jpg,.png" onChange={handleFileChange} />
            </label>
            <label>
              Certificación:
              <input type="file" name="certificacion" accept=".pdf,.jpg,.png" onChange={handleFileChange} />
            </label>
            <Button className="du-upload-btn" onClick={handleUpload} variant="contained">
              Enviar Documentos
            </Button>
          </div>
          {msgUpload && <Typography className="du-upload-msg">{msgUpload}</Typography>}
        </div>

        {/* Aquí podrías seguir con gráficas u otras secciones */}
      </div>
    </div>
  );
};

export default DashboardUsuario;
