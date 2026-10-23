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
        <FondoAmbiental />

        <BarraNavegacion onBookClick={() => handleBookClick()} />

        <main>
          <SeccionInicio onBookClick={handleBookClick} />

          <SeccionResenas onBookClick={handleBookClick} />
        </main>

        <PiePagina onBookClick={handleBookClick} />

        <AsistenteChat />
      </div>
    </FluentProvider>
  );
}
