import {
  Avatar,
  Badge,
  Title2,
  Title3,
  Body1,
  Text,
  Divider,
  Button,
} from "@fluentui/react-components";
import { Sparkle20Filled } from "@fluentui/react-icons";
import { clientReviews } from "../data/homeData";

export default function SeccionResenas({ onBookClick }) {
  return (
    <section className="reviews-section section-wrap" id="resenas">
      <div className="reviews-header">
        <Badge
          appearance="outline"
          size="extra-large"
          shape="circular"
          className="luxury-kicker-pill"
          icon={<Sparkle20Filled className="sparkle-dot" />}
        >
          EXPERIENCIAS REALES 
        </Badge>

        <Title2 className="section-main-title">
          Voces de Nuestro <span className="shimmer-inline">Studio</span>
        </Title2>

        <Body1 className="reviews-subtitle">
          Cada visita a Lumière Studio es un momento dedicado a tu belleza y bienestar. Descubre las experiencias de nuestras clientas y déjate inspirar por sus diseños, acabados y momentos de relajación.
        </Body1>

        <div className="reviews-summary-pill">
          <span className="summary-stars" aria-label="5 de 5 estrellas">★★★★★</span>
          <Text className="summary-score">4.9 / 5.0</Text>
          <Divider vertical className="summary-divider" />
          <Text className="summary-count">Reseñas verificadas de nuestras clientas</Text>
        </div>
      </div>

      <div className="reviews-grid">
        {clientReviews.map((resena) => (
          <article key={resena.id} className="review-glass-panel">
            <div className="review-top-row">
              <div className="review-stars" aria-label={`${resena.rating} estrellas`}>
                {"★".repeat(resena.rating)}
              </div>
              <Badge appearance="tint" shape="circular" className="review-service-badge">
                {resena.service}
              </Badge>
            </div>

            <Body1 className="review-comment">“{resena.comment}”</Body1>

            <Divider className="review-divider" />

            <div className="review-author-row">
              <div className="avatar-tornasol-ring">
                <Avatar name={resena.name} size={40} color={resena.avatarColor} />
              </div>
              <div className="review-author-info">
                <Title3 className="review-author-name">{resena.name}</Title3>
                <Text className="review-author-role">
                  <span>{resena.date}</span>
                </Text>
              </div>
            </div>
          </article>
        ))}
      </div>

    </section>
  );
}

