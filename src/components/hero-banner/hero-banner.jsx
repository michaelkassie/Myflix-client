import { useMemo } from "react";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import { useNavigate } from "react-router-dom";

export const HeroBanner = ({ movies }) => {
  const navigate = useNavigate();

  // Pick a "featured" movie (random, stable per render)
  const featured = useMemo(() => {
    if (!movies || movies.length === 0) return null;
    return movies[Math.floor(Math.random() * movies.length)];
  }, [movies]);

  if (!featured) return null;

  const title = featured.Title;
  const description = featured.Description;
  const image = featured.ImagePath; // adjust if your field name differs
  const genre = featured.Genre?.Name;

  return (
    <div className="hero">
      <div
        className="hero__bg"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden="true"
      />

      <div className="hero__overlay" />

      <div className="hero__content">
        <div className="hero__meta">
          <Badge bg="light" text="dark" className="hero__badge">
            Featured
          </Badge>
          {genre ? <span className="hero__dot">•</span> : null}
          {genre ? <span className="hero__genre">{genre}</span> : null}
        </div>

        <h1 className="hero__title">{title}</h1>

        <p className="hero__desc">{description}</p>

        <div className="hero__actions">
          <Button
            variant="light"
            className="hero__btn hero__btn--primary"
            onClick={() => navigate(`/movies/${encodeURIComponent(title)}`)}
          >
            ▶ Watch
          </Button>

          <Button
            variant="outline-light"
            className="hero__btn"
            onClick={() => navigate(`/movies/${encodeURIComponent(title)}`)}
          >
            More Info
          </Button>
        </div>
      </div>
    </div>
  );
};
