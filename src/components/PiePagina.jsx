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
import { useNavigate } from "react-router-dom";
import { studioInfo } from "../data/homeData";

function InstagramIcon({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function PiePagina({ onBookClick }) {
  const navigate = useNavigate();
  const redesConEnlace = studioInfo.socials.filter((red) => red.url);

  return (
    <footer className="footer-contact-wrap" id="contacto">
      <div className="footer-inner section-wrap">
        <div className="contact-hero-banner">
          <div className="contact-banner-copy">
            <Badge
              appearance="outline"
              shape="circular"
              className="luxury-kicker-pill"
              icon={<Sparkle20Filled className="sparkle-dot" />}
            >
              ATENCIÓN EXCLUSIVA & RESERVAS
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
              onClick={() => navigate("/reservas")}
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
                {redesConEnlace.map((red) => (
                  <a
                    key={red.name}
                    href={red.url}
                    target="_blank"
                    rel="noreferrer"
                    className="footer-social-pill"
                    aria-label={red.name}
                  >
                    {red.name.toLowerCase().includes("instagram") && (
                      <InstagramIcon className="footer-social-svg" />
                    )}
                    {red.name.toLowerCase().includes("facebook") && (
                      <FacebookIcon className="footer-social-svg" />
                    )}
                    <span className="footer-social-name">{red.name}</span>
                  </a>
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
        </div>
      </div>
    </footer>
  );
}

