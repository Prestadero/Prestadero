import { Navigate } from "react-router-dom";

const RutaPrivada = ({ children }) => {
  const token = localStorage.getItem("authToken");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default RutaPrivada;
