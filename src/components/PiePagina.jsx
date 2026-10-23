import {
  Badge,
  Button,
  Divider,
  Link,
  Text,
  Title2,
  Title3,
  Body1,
} from "@fluentui/react-components";
import {
  Clock24Regular,
  Location24Regular,
  Phone24Regular,
  Sparkle20Filled,
} from "@fluentui/react-icons";
import { studioInfo } from "../data/homeData";

export default function PiePagina({ onBookClick }) {
  const redesConEnlace = studioInfo.socials.filter((red) => red.url);

  return (
    <footer className="footer-contact-wrap" id="contacto">
      <div className="footer-inner section-wrap">
        {/* CUADRO DE RESERVAS SUPERIOR JUNTO A LOS BOTONES */}
        <div className="contact-hero-banner">
          <div className="contact-banner-copy">
            <Badge
              appearance="outline"
              shape="circular"
              className="luxury-kicker-pill"
              icon={<Sparkle20Filled className="sparkle-dot" />}
            >
              CONCIERGE PRIVADO & RESERVAS
            </Badge>
            <Title2 className="contact-banner-title">
              Reserva tu Momento en <span className="shimmer-inline">Lumière Studio</span>
            </Title2>
            <Body1 className="contact-banner-desc">
              Atención personalizada bajo cita previa, en un ambiente exclusivo pensado para que vivas un ritual de belleza inolvidable.
            </Body1>
          </div>

          <div className="contact-banner-actions">
            <Button
              className="luxury-btn primary-glow-btn"
              appearance="primary"
              size="large"
              shape="circular"
              onClick={() => onBookClick?.("Cita desde el pie de página")}
            >
              Agendar Cita Ahora
            </Button>
            <Button
              as="a"
              href={studioInfo.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="luxury-btn outline-glow-btn"
              appearance="outline"
              size="large"
              shape="circular"
            >
              Escríbenos por WhatsApp
            </Button>
          </div>
        </div>

        {/* PIE DE PÁGINA ABIERTO (SIN CARDS) */}
        <div className="footer-open-grid">
          <div className="footer-col footer-col-brand">
            <div className="footer-brand-header">
              <img
                src="/logo-lumiere.png"
                alt="Lumière Studio"
                className="footer-logo-img"
              />
            </div>
            <Text className="footer-brand-bio">
              Estudio de alta calidad, cuidando los mejores detalles y las manos de nuestros clientes.
            </Text>

            {redesConEnlace.length > 0 && (
              <div className="footer-socials-row" aria-label="Redes sociales de Lumière Studio">
                {redesConEnlace.map((red, i) => (
                  <span key={red.name} className="footer-social-item">
                    {i > 0 && <span className="footer-dot">·</span>}
                    <Link
                      href={red.url}
                      target="_blank"
                      rel="noreferrer"
                      className="footer-social-link"
                    >
                      {red.name}
                    </Link>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="footer-col">
            <Title3 className="footer-col-heading">Ubicación</Title3>
            <Text className="footer-plain-line footer-line-icon">
              <Location24Regular className="footer-line-glyph" />
              <span>
                {studioInfo.address}
                <br />
                {studioInfo.city}
              </span>
            </Text>
          </div>

          <div className="footer-col">
            <Title3 className="footer-col-heading">Horarios</Title3>
            {studioInfo.hours.map((h) => (
              <Text key={h.days} className="footer-plain-line footer-line-icon">
                <Clock24Regular className="footer-line-glyph" />
                <span>
                  <strong>{h.days}:</strong> {h.time}
                </span>
              </Text>
            ))}
          </div>

          <div className="footer-col">
            <Title3 className="footer-col-heading">Contacto</Title3>
            <Link
              href={studioInfo.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="footer-contact-link footer-line-icon"
            >
              <Phone24Regular className="footer-line-glyph" />
              <span>{studioInfo.phoneDisplay}</span>
            </Link>
            <Text className="footer-plain-line">WhatsApp y llamadas</Text>
          </div>
        </div>

        <Divider className="footer-bottom-divider" />

        <div className="footer-bottom-bar">
          <Text className="footer-copy">
            © 2026 Lumière Studio · Todos los derechos reservados.
          </Text>

          <div className="footer-nav-links">
            <Link href="#inicio" appearance="subtle" className="footer-link">Inicio</Link>
            <Link href="#resenas" appearance="subtle" className="footer-link">Reseñas</Link>
            <Link href="#contacto" appearance="subtle" className="footer-link">Contacto</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

