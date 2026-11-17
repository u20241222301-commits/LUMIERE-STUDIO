import { Button } from "@fluentui/react-components";
import { CalendarLtr24Regular, Search20Regular } from "@fluentui/react-icons";
import { useLocation, useNavigate } from "react-router-dom";

export default function BarraNavegacion() {
  const navigate = useNavigate();
  const location = useLocation();

  const irAInicio = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <header className="navbar">
      <a
        className="brand"
        href="/"
        onClick={irAInicio}
        aria-label="Lumière Studio - Inicio"
      >
        <img
          src="/logo-lumiere.png"
          alt="Lumière Studio"
          className="brand-logo-img"
        />
      </a>

      <nav className="nav-actions" aria-label="Navegación principal">
        <Button
          appearance="subtle"
          shape="circular"
          size="large"
          className={`nav-service-btn ${
            location.pathname === "/" ? "nav-btn-active" : ""
          }`}
          onClick={() => navigate("/")}
        >
          Inicio
        </Button>

        <Button
          appearance="subtle"
          shape="circular"
          size="large"
          className={`nav-service-btn ${
            location.pathname === "/servicios" ? "nav-btn-active" : ""
          }`}
          onClick={() => navigate("/servicios")}
        >
          Servicios
        </Button>

        <Button
          appearance="subtle"
          shape="circular"
          size="large"
          className={`nav-service-btn ${
            location.pathname === "/inspiracion" ? "nav-btn-active" : ""
          }`}
          onClick={() => navigate("/inspiracion")}
        >
          Inspiración
        </Button>

        <Button
          appearance="subtle"
          shape="circular"
          size="large"
          className={`nav-service-btn ${
            location.pathname === "/sobre-nosotros" ? "nav-btn-active" : ""
          }`}
          onClick={() => navigate("/sobre-nosotros")}
        >
          Sobre Nosotros
        </Button>

        <Button
          appearance="subtle"
          shape="circular"
          size="large"
          className={`nav-service-btn ${
            location.pathname === "/consultar-cita" ? "nav-btn-active" : ""
          }`}
          icon={<Search20Regular />}
          onClick={() => navigate("/consultar-cita")}
        >
          Consultar mi Cita
        </Button>

        <Button
          appearance="primary"
          shape="circular"
          size="large"
          className="luxury-btn primary-glow-btn"
          icon={<CalendarLtr24Regular />}
          onClick={() => navigate("/reservas")}
        >
          Reservas
        </Button>
      </nav>
    </header>
  );
}
