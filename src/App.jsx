import { FluentProvider } from "@fluentui/react-components";
import { customLuxuryTheme } from "./data/homeData";
import "./styles/index.css";
import FondoAmbiental from "./components/FondoAmbiental";
import BarraNavegacion from "./components/BarraNavegacion";
import SeccionInicio from "./components/SeccionInicio";
import SeccionResenas from "./components/SeccionResenas";
import PiePagina from "./components/PiePagina";
import AsistenteChat from "./components/AsistenteChat";

export default function App() {
  const handleBookClick = (selectedItem) => {
    console.log("Reserva solicitada para:", selectedItem || "Cita General VIP");
  };

  return (
    <FluentProvider theme={customLuxuryTheme}>
      <div className="site-shell">
        {/* Doble fondo de video dinámico con transición suave al hacer scroll */}
        <FondoAmbiental />

        {/* Barra de navegación con efecto de resplandor al pasar el mouse */}
        <BarraNavegacion onBookClick={() => handleBookClick()} />

        {/* Contenido completo del Index */}
        <main>
          <SeccionInicio onBookClick={handleBookClick} />

          <SeccionResenas onBookClick={handleBookClick} />
        </main>

        {/* Pie de página tradicional con reservas, redes sociales, correo y ubicación */}
        <PiePagina onBookClick={handleBookClick} />

        {/* Widget flotante con API de Chatbot IA Concierge */}
        <AsistenteChat />
      </div>
    </FluentProvider>
  );
}
