// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Pages/Navbar";
import Footer from "./Pages/Footer";
import Select from "./Pages/Select";
import SolicitaCredito from "./Pages/SolicitaCredito";
import Login from "./Pages/Login";
import PrimerIngreso from "./Pages/PrimerIngreso";
import DashboardUsuario from "./Pages/DashboardUsuario";
import DashboardAsesor from "./Pages/DashboardAsesor";
import RutaPrivada from "./Pages/RutaPrivada";

const AppContent = () => {
  const { pathname } = useLocation();
  // Define rutas en las que NO quieres mostrar Navbar ni Footer
  const hideNavAndFooter = ["/login", "/primer-ingreso"];

  const shouldHide = hideNavAndFooter.includes(pathname);

  return (
    <>
      {!shouldHide && <Navbar />}
      <Routes>
        <Route path="/" element={<Select />} />
        <Route path="/solicita-credito" element={<SolicitaCredito />} />
        <Route path="/login" element={<Login />} />
        <Route path="/primer-ingreso" element={<PrimerIngreso />} />

        {/* Rutas protegidas */}
        <Route
          path="/dashboardusuario"
          element={
            <RutaPrivada>
              <DashboardUsuario />
            </RutaPrivada>
          }
        />
        <Route
          path="/dashboard-asesor"
          element={
            <RutaPrivada>
              <DashboardAsesor />
            </RutaPrivada>
          }
        />
      </Routes>
      {!shouldHide && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router basename="/it">
      <AppContent />
    </Router>
  );
}

export default App;
