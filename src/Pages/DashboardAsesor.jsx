// src/components/DashboardAsesor.jsx
import React, { useEffect, useState } from 'react';
import './DashboardAsesor.css';

const DashboardAsesor = () => {
  const [vista, setVista] = useState('solicitudes');
  const [solicitudes, setSolicitudes] = useState([]);
  const [mensajes, setMensajes] = useState({});
  const [credenciales, setCredenciales] = useState({});
  const [rechazadasBloqueadas, setRechazadasBloqueadas] = useState({});
  const asesorNombre = localStorage.getItem("asesorNombre") || "Asesor";
  const [reenviarDisponibles, setReenviarDisponibles] = useState({});

  useEffect(() => {
    const navbar = document.querySelector('.navbar');
    if (navbar) navbar.style.display = 'none';
    return () => {
      if (navbar) navbar.style.display = '';
    };
  }, []);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      const res = await fetch('https://backsolicitudes.onrender.com/solicitudes');
      const data = await res.json();
      setSolicitudes(data);
      const bloqueadas = {};
      data.forEach(s => {
        if (s.estado === 'Rechazado') bloqueadas[s.id] = true;
      });
      setRechazadasBloqueadas(bloqueadas);
    };
    fetchSolicitudes();
  }, []);

  const actualizarEstadoSolicitud = async (id, estadoActual) => {
    if (estadoActual === 'Rechazado') {
      const confirmar = window.confirm('⚠️ Esta operación no se puede revertir. ¿Estás seguro de rechazar esta solicitud?');
      if (!confirmar) return;
    }
    await fetch(`https://backsolicitudes.onrender.com/solicitudes/${id}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: estadoActual })
    });
    setSolicitudes(prev => prev.map(s => s.id === id ? { ...s, estado: estadoActual } : s));
    if (estadoActual === 'Rechazado') {
      setRechazadasBloqueadas(prev => ({ ...prev, [id]: false }));
    }
  };

  const guardarMensaje = async (id, mensaje) => {
    await fetch(`https://backsolicitudes.onrender.com/${id}/mensaje`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje })
    });
  };

  const enviarCredenciales = async (solicitud) => {
    const password = credenciales[solicitud.id];
    const mensaje = mensajes[solicitud.id] || '';
    if (!password) return alert("La contraseña es obligatoria");

    try {
      const res = await fetch("http://localhost:3007/enviar-credenciales", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          solicitud_id: solicitud.id,
          correo: solicitud.correo,
          usuario: solicitud.correo,
          contraseña: password,
          mensaje,
          nombre: solicitud.nombre
        })
      });

      if (res.status === 409) {
        alert("⚠️ Ya se enviaron credenciales a este usuario.");
        setReenviarDisponibles(prev => ({ ...prev, [solicitud.id]: true }));
        return;
      }

      if (!res.ok) throw new Error();
      alert("✅ Credenciales enviadas con éxito");
    } catch {
      alert("❌ Error al enviar credenciales");
    }
  };

  const reenviarCredenciales = async (solicitud) => {
    const password = credenciales[solicitud.id];
    const mensaje = mensajes[solicitud.id] || '';

    try {
      const res = await fetch("http://localhost:3007/reenviar-credenciales", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: solicitud.correo,
          usuario: solicitud.correo,
          contraseña: password,
          mensaje,
          nombre: solicitud.nombre
        })
      });

      if (res.status === 409) {
        alert("⚠️ Este usuario ya recibió un reenvío de credenciales.");
        setReenviarDisponibles(prev => ({ ...prev, [solicitud.id]: false }));
        return;
      }

      if (!res.ok) throw new Error();
      alert("✅ Credenciales reenviadas con éxito");
      setReenviarDisponibles(prev => ({ ...prev, [solicitud.id]: false }));
    } catch {
      alert("❌ Error al reenviar credenciales");
    }
  };

  const enviarCorreoManual = async (solicitud, tipo) => {
    const mensajeHTML = `
      <div style="font-family:Arial,sans-serif;padding:20px;">
        <h2>Hola ${solicitud.nombre},</h2>
        <p>${tipo === 'rechazado'
      ? 'Lamentamos informarte que tu solicitud no ha sido aprobada en esta ocasión.'
      : 'Gracias por comunicarte con nosotros.'}</p>
        <p><strong>Mensaje del asesor:</strong></p>
        <blockquote style="background:#f0f0f0;padding:10px;border-left:4px solid #ffd700;">
          ${mensajes[solicitud.id] || 'Sin mensaje personalizado.'}
        </blockquote>
        <p style="font-size:12px;color:#888;margin-top:20px;">Este mensaje ha sido generado automáticamente. No respondas.</p>
      </div>
    `;
    await fetch('http://localhost:3007/enviar-correo-manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        correo: solicitud.correo,
        asunto: tipo === 'rechazado' ? '❌ Solicitud rechazada - Prestadero' : '📩 Mensaje del asesor - Prestadero',
        mensaje_html: mensajeHTML
      })
    });
    alert("Correo enviado correctamente");
    setRechazadasBloqueadas(prev => ({ ...prev, [solicitud.id]: true }));
  };

  const handleInputChange = (id, value, type) => {
    if (type === 'password') {
      setCredenciales(prev => ({ ...prev, [id]: value }));
    } else {
      setMensajes(prev => ({ ...prev, [id]: value }));
    }
  };

  const solicitudesAprobadas = solicitudes.filter(s => s.estado === 'Aprobado');

  return (
    <div className="dashboard-asesor-container">
      <div className="dashboard-asesor-sidebar">
        <h2>{asesorNombre}</h2>
        <button onClick={() => setVista('solicitudes')} className={vista === 'solicitudes' ? 'active' : ''}>Solicitudes</button>
        <button onClick={() => setVista('crear-usuarios')} className={vista === 'crear-usuarios' ? 'active' : ''}>Crear Usuarios</button>
      </div>
      <div className="dashboard-asesor-main">
        <h1>Gestión de Solicitudes</h1>
        {vista === 'solicitudes' ? (
          solicitudes.map(s => {
            const bloqueado = rechazadasBloqueadas[s.id];
            return (
              <div key={s.id} className={`dashboard-asesor-card ${bloqueado ? 'dashboard-asesor-disabled' : ''}`}>
                <h3>{s.nombre}</h3>
                <p>Correo: {s.correo}</p>
                <p>Teléfono: {s.telefono}</p>
                <p>Documento: {s.typedocument} {s.numerodocumento}</p>
                <p>Monto solicitado: ${s.monto.toLocaleString('es-CO')}</p>
                <p>Cuotas: {s.cuotas}</p>
                <p>Cuota mensual: ${s.cuota_mensual.toLocaleString('es-CO')}</p>
                <p>Total a pagar: ${s.total.toLocaleString('es-CO')}</p>
                <p>Estado: <span className={`dashboard-asesor-estado-${s.estado?.toLowerCase()}`}>{s.estado}</span></p>
                {!bloqueado && (
                  <>
                    <select defaultValue={s.estado || ''} onChange={e => actualizarEstadoSolicitud(s.id, e.target.value)}>
                      <option value="">Cambiar estado</option>
                      <option value="Aprobado">Aprobado</option>
                      <option value="Rechazado">Rechazado</option>
                      <option value="Pendiente">Pendiente</option>
                    </select>
                    <textarea
                      rows={3}
                      placeholder="Mensaje del asesor"
                      value={mensajes[s.id] || ''}
                      onChange={e => handleInputChange(s.id, e.target.value, 'mensaje')}
                    />
                    <button onClick={() => guardarMensaje(s.id, mensajes[s.id] || '')}>Guardar mensaje</button>
                    {s.estado === 'Rechazado' && !rechazadasBloqueadas[s.id] && (
                      <button onClick={() => enviarCorreoManual(s, 'rechazado')}>Enviar correo de rechazo</button>
                    )}
                  </>
                )}
              </div>
            );
          })
        ) : (
          solicitudesAprobadas.map(s => (
            <div key={s.id} className="dashboard-asesor-card">
              <h3>{s.nombre}</h3>
              <p>Correo: {s.correo}</p>
              <input
                type="password"
                placeholder="Contraseña"
                onChange={e => handleInputChange(s.id, e.target.value, 'password')}
              />
              <textarea
                rows={3}
                placeholder="Mensaje del asesor"
                value={mensajes[s.id] || ''}
                onChange={e => handleInputChange(s.id, e.target.value, 'mensaje')}
              />
              {reenviarDisponibles[s.id] ? (
                <button onClick={() => reenviarCredenciales(s)}>🔁 Reenviar credenciales</button>
              ) : (
                <button onClick={() => enviarCredenciales(s)}>Enviar credenciales</button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardAsesor;
