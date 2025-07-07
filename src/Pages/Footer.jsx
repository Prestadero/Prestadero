import React from "react";
import "./Footer.css";
import logo from "./logo.jpg"; // Ajusta la ruta según tu estructura de archivos

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <img src={logo} alt="Company Logo" className="footer-logo" />
          <p className="footer-description">
            Recurda que somo Prestadero: <br />
            Porque pedir un préstamo no tiene que ser difícil.
          </p>
        </div>
      </div>

      <div className="footer-middle">
        <div className="footer-column">
          <h3 className="footer-column-title">Solutiones</h3>
          <ul className="footer-links">
            <li className="footer-subheading">Analitica:</li>
            <li><a href="#">Intereses</a></li>
            <li><a href="#">Creditos</a></li>
            <li><a href="#">Historias de vida</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-column-title">Soporte</h3>
          <ul className="footer-links">
            <li><a href="#">Preguntas Frecuentes</a></li>
            <li><a href="#">Documentation</a></li>
            <li><a href="#">Ayuda al usuario</a></li>
            <li><a href="#">Mi credito</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-column-title">Nosotros</h3>
          <ul className="footer-links">
            <li><a href="#">Acerca de nosotros</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Trabaja con nosotros</a></li>
            
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-column-title">Legal</h3>
          <ul className="footer-links">
            <li><a href="#">Solicitudes</a></li>
            <li><a href="#">Politica</a></li>
            <li><a href="#">Terminos</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copyright">
          © {new Date().getFullYear()} Prototipo. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

export default Footer;