import {
  Button,
  Title1,
  Title3,
  Body1,
  Text,
  Badge,
  Divider,
} from "@fluentui/react-components";
import { Sparkle20Filled } from "@fluentui/react-icons";

export default function SeccionInicio({ onBookClick }) {
  return (
    <section className="hero-stage section-wrap" id="inicio">
      <div className="hero-copy hero-open-center">
        <Badge
          appearance="outline"
          size="extra-large"
          shape="circular"
          className="luxury-kicker-pill"
          icon={<Sparkle20Filled className="sparkle-dot" />}
        >
          SANTUARIO DE ALTA MANICURA & SPA · NEIVA, HUILA
        </Badge>

        <Title1 className="hero-title">
          El Arte Supremo del
          <span className="shimmer-headline">Spa de Uñas</span>
        </Title1>

        <Body1 className="hero-description">
          Descubre una experiencia de belleza y relajación donde la elegancia se une con el cuidado de tus manos. Disfruta de acabados cromados, destellos tornasol y tratamientos diseñados para resaltar tu estilo.
        </Body1>

        <div className="hero-actions">
          <Button
            className="luxury-btn primary-glow-btn"
            appearance="primary"
            size="large"
            shape="circular"
            onClick={() => onBookClick?.("Reserva desde el inicio")}
          >
            Reservar Experiencia
          </Button>
          <Button
            className="luxury-btn outline-glow-btn"
            appearance="outline"
            size="large"
            shape="circular"
            onClick={() =>
              document
                .getElementById("resenas")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Ver Reseñas ↓
          </Button>
        </div>

        <Divider appearance="brand" className="hero-fluent-divider" />

        <div className="hero-metrics">
          <div className="metric-item">
            <Title3 className="metric-number">100%</Title3>
            <Text className="metric-label">Esmaltes de alta calidad</Text>
          </div>
          <Divider vertical className="metric-divider" />
          <div className="metric-item">
            <Title3 className="metric-number">CHROME</Title3>
            <Text className="metric-label">Acabados cromados, destellos y brillo</Text>
          </div>
          <Divider vertical className="metric-divider" />
          <div className="metric-item">
            <Title3 className="metric-number">VIP</Title3>
            <Text className="metric-label">Atención personalizada</Text>
          </div>
        </div>
      </div>
    </section>
  );
}

