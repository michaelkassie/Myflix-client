import PropTypes from "prop-types";

// React Bootstrap
import Card from "react-bootstrap/Card";

export const MovieCard = ({ movie, onMovieClick }) => {
  return (
    <Card
      className="h-100 cursor-pointer"
      onClick={() => onMovieClick(movie)}
      style={{ cursor: "pointer" }}
    >
      <Card.Body className="d-flex align-items-center justify-content-center">
        <Card.Title className="text-center mb-0">
          {movie.Title}
        </Card.Title>
      </Card.Body>
    </Card>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    Title: PropTypes.string.isRequired,
  }).isRequired,
  onMovieClick: PropTypes.func.isRequired,
};
