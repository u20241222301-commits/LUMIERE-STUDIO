import { useEffect } from "react";
import { FluentProvider } from "@fluentui/react-components";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { customLuxuryTheme } from "./data/homeData";
import "./styles/index.css";
import FondoAmbiental from "./components/FondoAmbiental";
import BarraNavegacion from "./components/BarraNavegacion";
import SeccionInicio from "./components/SeccionInicio";
import SeccionResenas from "./components/SeccionResenas";
import PaginaServicios from "./components/PaginaServicios";
import PaginaInspiracion from "./components/PaginaInspiracion";
import PaginaReservas from "./components/PaginaReservas";
import PaginaConsultarCita from "./components/PaginaConsultarCita";
import PaginaSobreNosotros from "./components/PaginaSobreNosotros";
import PaginaAdmin from "./components/PaginaAdmin";
import PiePagina from "./components/PiePagina";
import AsistenteChat from "./components/AsistenteChat";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const mapaVista = {
    "/": "inicio",
    "/servicios": "servicios",
    "/inspiracion": "servicios",
    "/reservas": "reservas",
    "/consultar-cita": "consultar-cita",
    "/sobre-nosotros": "sobre-nosotros",
    "/admin": "admin",
  };
  const vistaActual = mapaVista[location.pathname] || "servicios";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const handleBookClick = (selectedItem) => {
    navigate("/reservas", {
      state: { selectedService: selectedItem },
    });
  };

  return (
    <FluentProvider theme={customLuxuryTheme}>
      <div className="site-shell">
        <FondoAmbiental vistaActual={vistaActual} />

        <BarraNavegacion onBookClick={() => handleBookClick()} />

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <SeccionInicio onBookClick={handleBookClick} />
                  <SeccionResenas onBookClick={handleBookClick} />
                </>
              }
            />
            <Route
              path="/servicios"
              element={<PaginaServicios onBookClick={handleBookClick} />}
            />
            <Route
              path="/inspiracion"
              element={<PaginaInspiracion />}
            />
            <Route
              path="/reservas"
              element={<PaginaReservas />}
            />
            <Route
              path="/consultar-cita"
              element={<PaginaConsultarCita />}
            />
            <Route
              path="/sobre-nosotros"
              element={<PaginaSobreNosotros />}
            />
            <Route
              path="/admin"
              element={<PaginaAdmin />}
            />
          </Routes>
        </main>

        <PiePagina onBookClick={handleBookClick} />
        <AsistenteChat />
      </div>
    </FluentProvider>
  );
}
