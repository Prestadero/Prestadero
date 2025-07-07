import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "./logo.jpg";

function Navbar() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Referencia para mantener el estado actual del menú
  const menuOpenRef = useRef(menuOpen);
  menuOpenRef.current = menuOpen;

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY) {
        // Scroll hacia abajo - ocultar navbar y menú
        setShow(false);
        if (menuOpenRef.current) {
          setMenuOpen(false);
        }
      } else {
        // Scroll hacia arriba - mostrar navbar
        setShow(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => window.removeEventListener("scroll", controlNavbar);
    }
  }, [lastScrollY]);

  return (
    <nav className={`navbar ${show ? "navbar--visible" : "navbar--hidden"} ${menuOpen ? "open" : ""}`}>
      <div className="navbar-left">
        <img src={logo} alt="logo" />
        <div className="hamburger-menu" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <ul className={`navbar-center ${menuOpen ? "open" : ""}`}>
        <li><a href="#Inicio">Inicio</a></li>
        <li><a href="#SobreNosotros">Sobre nosotros</a></li>
        <li><a href="#Beneficios">Beneficios</a></li>
        <li><a href="#PideTuCredito">Pide tu crédito</a></li>
        <li><a href="#Testimonios">Testimonios</a></li>
      </ul>

      <div className="navbar-right">
        <Link to="/solicita-credito" className="btn btn-signin">Solicitar crédito</Link>
        <Link to="/Login" className="btn btn-signup">Iniciar sesión</Link>
      </div>
    </nav>
  );
}

export default Navbar;