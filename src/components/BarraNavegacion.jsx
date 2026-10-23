import { Button } from "@fluentui/react-components";
import { CalendarLtr24Regular } from "@fluentui/react-icons";

export default function BarraNavegacion({ onBookClick }) {
  const irAServicios = () => {
    console.log("Navegar a Servicios");
  };

  return (
    <header className="navbar">
      <a className="brand" href="#inicio" aria-label="Lumière Studio - Inicio">
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
          className="nav-service-btn"
          onClick={irAServicios}
        >
          Servicios
        </Button>
        <Button
          appearance="primary"
          shape="circular"
          size="large"
          className="luxury-btn primary-glow-btn"
          icon={<CalendarLtr24Regular />}
          onClick={onBookClick}
        >
          Reservas
        </Button>
      </nav>
    </header>
  );
}

