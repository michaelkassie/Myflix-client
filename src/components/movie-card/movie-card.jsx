import PropTypes from "prop-types";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

export const MovieCard = ({ movie }) => {
  return (
    <Link
      to={`/movies/${encodeURIComponent(movie._id)}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Card className="h-100" style={{ cursor: "pointer" }}>
        <Card.Body className="d-flex align-items-center justify-content-center">
          <Card.Title className="text-center mb-0">
            {movie.Title}
          </Card.Title>
        </Card.Body>
      </Card>
    </Link>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    Title: PropTypes.string.isRequired,
  }).isRequired,
};
