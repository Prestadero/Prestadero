const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const pool = require('./db');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Transportador SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.hostgator.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Enviar y guardar credenciales (con contraseña encriptada y isfirstlogin=true)
app.post('/enviar-credenciales', async (req, res) => {
  const { solicitud_id, correo, usuario, contraseña, mensaje, nombre } = req.body;

  if (!solicitud_id || !correo || !usuario || !contraseña || !nombre) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const existe = await pool.query(
      'SELECT id FROM login WHERE solicitud_id = $1 OR usuario = $2',
      [solicitud_id, usuario]
    );

    if (existe.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe un usuario registrado para esta solicitud' });
    }

    const contraseñaEncriptada = await bcrypt.hash(contraseña, 10);

    await pool.query(
      'INSERT INTO login (solicitud_id, usuario, contraseña, isfirstlogin, reenviado) VALUES ($1, $2, $3, true, false)',
      [solicitud_id, usuario, contraseñaEncriptada]
    );

    const html = generarCorreoHTML(nombre, usuario, contraseña, mensaje);
    await enviarCorreo(correo, '✅ Accede a tu cuenta Prestadero', html);

    res.json({ mensaje: 'Credenciales enviadas con éxito' });
  } catch (err) {
    console.error('Error al enviar o guardar credenciales:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Reenviar credenciales una sola vez
app.post('/reenviar-credenciales', async (req, res) => {
  const { correo, usuario, contraseña, mensaje, nombre } = req.body;

  if (!correo || !usuario || !contraseña || !nombre) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    const result = await pool.query(
      'SELECT reenviado FROM login WHERE usuario = $1',
      [usuario]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'No se encontró este usuario para reenvío' });
    }

    if (result.rows[0].reenviado) {
      return res.status(409).json({ error: 'Ya se reenviaron credenciales una vez' });
    }

    const html = generarCorreoHTML(nombre, usuario, contraseña, mensaje);
    await enviarCorreo(correo, '🔁 Reenvío de credenciales - Prestadero', html);

    await pool.query(
      'UPDATE login SET reenviado = true WHERE usuario = $1',
      [usuario]
    );

    res.json({ mensaje: 'Credenciales reenviadas con éxito' });
  } catch (err) {
    console.error('Error al reenviar credenciales:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Correo manual
app.post('/enviar-correo-manual', async (req, res) => {
  const { correo, asunto, mensaje_html } = req.body;

  if (!correo || !asunto || !mensaje_html) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    await enviarCorreo(correo, asunto, mensaje_html);
    res.json({ mensaje: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar correo manual:', error);
    res.status(500).json({ error: 'Error interno al enviar correo manual' });
  }
});

// Helpers
function generarCorreoHTML(nombre, usuario, contraseña, mensaje) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #333;">👋 Hola ${nombre},</h2>
      <p>Tu solicitud ha sido aprobada y ya puedes acceder a la plataforma Prestadero.</p>
      <p><strong>Usuario:</strong> ${usuario}</p>
      <p><strong>Contraseña:</strong> ${contraseña}</p>
      <p style="margin-top: 20px;"><strong>Mensaje del asesor:</strong></p>
      <blockquote style="background:rgb(0, 0, 0); padding: 15px; border-left: 5px solid #ffd700;">
        ${mensaje || 'Ningún mensaje personalizado.'}
      </blockquote>
      <br>
      <p>Puedes ingresar desde: <a href="http://prestadero.com/login" target="_blank">prestadero.com/login</a></p>
      <p style="font-size: 13px; color: #666;">Este mensaje ha sido generado automáticamente. No respondas a este correo.</p>
    </div>
  `;
}

async function enviarCorreo(destino, asunto, html) {
  await transporter.sendMail({
    from: `"Prestadero" <${process.env.EMAIL_USER}>`,
    to: destino,
    subject: asunto,
    html
  });
}

// Iniciar servidor
const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`🟢 Servidor de credenciales activo en http://localhost:${PORT}`);
});
