import React, { useState } from "react";
import "./SolicitaCredito.css";

const SolicitaCredito = () => {
  // Estados para los campos del formulario
  const [typeDocument, setTypeDocument] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');

  // Estados para el simulador
  const [monto, setMonto] = useState(1000000);
  const [cuotas, setCuotas] = useState(1);
  const interesMensual = 0.02;

  // Cálculo de la cuota mensual
  const calcularCuota = () => {
    const i = interesMensual;
    const n = cuotas;
    const cuota = monto * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    return Math.round(cuota);
  };

  const cuotaMensual = calcularCuota();
  const total = cuotaMensual * cuotas;

  // Enviar datos al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      typedocument: typeDocument,
      numerodocumento: numeroDocumento,
      nombre,
      telefono,
      correo,
      monto,
      cuotas,
      cuotaMensual,
      total
    };

    try {
      const response = await fetch("https://backformulario-wqva.onrender.com/solicitudes", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error en la respuesta del servidor");
      const data = await response.json();
      alert("Solicitud guardada Con exito");
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar: " + error.message);
    }
  };

  return (
    <div className="formulario-credito-container">
      {/* Formulario */}
      <form className="formulario-solicita-credito" onSubmit={handleSubmit}>
        <h2>Solicita tu crédito</h2>

        <label>
          Tipo de documento:
          <select
            value={typeDocument}
            onChange={(e) => setTypeDocument(e.target.value)}
            required
          >
            <option value="">Seleccione</option>
            <option value="Cedula">Cédula</option>
            <option value="NIT">NIT</option>
          </select>
        </label>

        {typeDocument && (
          <label>
            Número de {typeDocument.toLowerCase()}:
            <input
              type="text"
              value={numeroDocumento}
              onChange={(e) => setNumeroDocumento(e.target.value)}
              required
            />
          </label>
        )}

        <label>
          Nombre completo:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </label>

        <label>
          Teléfono:
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
        </label>

        <label>
          Ingresa tu correo:
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </label>

        <button id="btn-enviar-credito" type="submit">Enviar</button>
      </form>

      {/* Simulador */}
      <div className="simulador">
        <h2>Simulador de Crédito</h2>

        <label>
          Monto del préstamo: ${monto.toLocaleString()}
          <input
            type="range"
            min={1000000}
            max={10000000}
            step={50000}
            value={monto}
            onChange={(e) => setMonto(Number(e.target.value))}
          />
        </label>

        <label>
          Plazo en cuotas:
          <div className="selector-cuotas">
            {[1, 3, 6, 12, 36].map((num) => (
              <button
                key={num}
                type="button"
                className={`btn-cuota ${cuotas === num ? 'activa' : ''}`}
                onClick={() => setCuotas(num)}
              >
                {num} {num === 1 ? 'Cuota' : 'Cuotas'}
              </button>
            ))}
          </div>
        </label>

        <div style={{ marginTop: '1rem' }}>
          <p><strong>Cuota mensual:</strong> ${cuotaMensual.toLocaleString()}</p>
          <p><strong>Total a pagar:</strong> ${total.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default SolicitaCredito;
