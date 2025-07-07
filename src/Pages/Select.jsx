import React, { useRef, useEffect } from "react";
import "./Select.css";
import mujer from "./mujer.png";
// Cambia la importación temporalmente
import cuotasImage from "./placeholder.jpg";

const benefitItems = [
  {
    icon: "/icons/whatsapp.png",
    text: "WhatsApp exclusiva con 100 asesores para ayudarte.",
  },
  {
    icon: "/icons/coworking.png",
    text: "Sin codeudores, no solicitamos referencias.",
  },
  {
    icon: "/icons/terms-check.png",
    text: "Solo tu cédula y cuenta bancaria personal.",
  },
  {
    icon: "/icons/subscription-model.png",
    text: "Desembolsos en minutos en bancos principales.",
  },
  {
    icon: "/icons/dashboard-monitor.png",
    text: "Calcula las cuotas dentro del sistema.",
  },
  {
    icon: "/icons/reservation-smartphone.png",
    text: "Realiza todo online sin lugares físicos.",
  },
];

function Select() {
  const scrollRef = useRef(null);
  const extendedItems = [...benefitItems, ...benefitItems, ...benefitItems]; // Triple para margen

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const totalItems = extendedItems.length;
    const itemWidth = el.scrollWidth / totalItems;
    const midpoint = itemWidth * (totalItems / 3);

    el.scrollLeft = midpoint;

    const handleScroll = () => {
      if (el.scrollLeft <= 0) {
        el.scrollLeft = midpoint;
      } else if (el.scrollLeft >= itemWidth * (totalItems * 2 / 3)) {
        el.scrollLeft = midpoint;
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [extendedItems]);

  const scrollByAmount = 300;

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: scrollByAmount, behavior: "smooth" });
  };

  // Datos de testimonios
  const testimonios = [
    {
      iniciales: "RIS",
      nombre: "Ricardo Alberto Bernal",
      comentario: "Mi experiencia fue maravillosa, cuentan con un personal con excelentes valores corporativos y personales.",
      calificacion: 5
    },
    {
      iniciales: "WP",
      nombre: "Wuilber Pueblo vega",
      comentario: "Muy buena la experiencia, todo fue autogestión y el crédito llegó muy rápido.",
      calificacion: 5
    },
    {
      iniciales: "RB",
      nombre: "Robinson Bravo",
      comentario: "Me parece una entidad responsable y respetuosa a la hora de dar información, en lo personal me sacaron de un apuro.",
      calificacion: 5
    },
    {
      iniciales: "CF",
      nombre: "Gina Paola Figueroa",
      comentario: "Aún llevo realizando préstamos con ellos, ya son varios y no he tenido inconvenientes de nada, eso se debe a que pago en la fecha acordada o a veces antes.",
      calificacion: 5
    },
    
  ];

  return (
    <div className="App">
      <section id="Inicio">
        <div className="content">
          <h1>¡Bienvenido a Prestadero!</h1>
          <p>Somos pioneros en préstamos rápidos y fáciles para todos.</p>
          <button className="btn-conocenos">Conócenos más</button>
        </div>
      </section>

      <section id="SobreNosotros" className="about-section">
        <div className="about-container">
          <div className="about-content">
            <h2 className="about-title">Cuotas que se adaptan a ti.</h2>
            <p className="about-subtitle">
              Compra en tus marcas favoritas y paga hasta en 24 cuotas.*<br />
              ¡Solo necesitas tu Celular!
            </p>
            <p className="about-note">*Sujeto a criterios de elegibilidad.</p>
            
            <div className="about-buttons">
              <button className="about-button">Dónde comprar</button>
              <button className="about-button primary">Solicita tu cupo</button>
            </div>
          </div>
          
          <div className="about-image">
            <img src={cuotasImage} alt="Cuotas adaptadas" />
          </div>
        </div>
      </section>

      <section id="Beneficios" className="benefits-section">
        <h2 className="benefits-title">
          Beneficios de tu <span>Crédito en línea</span>
        </h2>

        <div className="benefits-carousel">
          <button className="scroll-button left" onClick={scrollLeft}>←</button>

          <div className="benefits-grid" ref={scrollRef}>
            {extendedItems.map((item, index) => (
              <div className="benefit-card" key={index}>
                <img src={item.icon} alt="icono" />
                <p>
                  <strong>{item.text.split(" ")[0]}</strong>{" "}
                  {item.text.split(" ").slice(1).join(" ")}
                </p>
              </div>
            ))}
          </div>

          <button className="scroll-button right" onClick={scrollRight}>→</button>
        </div>
      </section>

      <section id="PideTuCredito" className="credit-section">
        <div className="credit-content">
          <div className="credit-left">
            <img src={mujer} alt="Persona feliz" />
            <p className="credit-etiqueta">¡Recibe el dinero en <strong>minutos</strong>!</p>
          </div>
          <div className="credit-right">
            <h2>Pide tu crédito ahora</h2>
            <p>Ingresa tus datos y obtén tu crédito fácil y rápido.</p>
            <button className="credit-button">Solicitar ahora</button>
          </div>
        </div>
      </section>

      {/* Sección de Testimonios */}
      <section className="testimonios-section" id="Testimonios">
        <div className="section-header">
          <h1>¿QUÉ DICEN NUESTROS CLIENTES SOBRE NUESTROS PRÉSTAMOS EN LÍNEA?</h1>
          <p>Únete a los más de miles de colombianos que ya confían en Prestadero</p>
        </div>

        <div className="testimonios-grid">
          {testimonios.map((testimonio, index) => (
            <div className="testimonio-card" key={index}>
              <div className="cliente-info">
                <div className="cliente-iniciales">{testimonio.iniciales}</div>
                <div className="cliente-details">
                  <h3>{testimonio.nombre}</h3>
                  <div className="estrellas">
                    {'★'.repeat(testimonio.calificacion)}
                  </div>
                </div>
              </div>
              <p className="testimonio-text">"{testimonio.comentario}"</p>
            </div>
          ))}
        </div>

        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">+10,000</div>
            <div className="stat-label">Clientes Satisfechos</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">99%</div>
            <div className="stat-label">Aprobación</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24h</div>
            <div className="stat-label">Desembolso Récord</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Select;