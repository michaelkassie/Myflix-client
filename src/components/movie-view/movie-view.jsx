import PropTypes from "prop-types";

// React Bootstrap
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";

export const MovieView = ({ movie, onBackClick }) => {
  return (
    <Card>
      <Card.Body>
        <Button variant="link" onClick={onBackClick} className="p-0 mb-3">
          ← Back
        </Button>

        <Card.Title as="h2" className="mb-3">
          {movie.Title}
        </Card.Title>

        {/* Poster */}
        {movie.ImagePath && (
          <div className="mb-3">
            <Image
              src={movie.ImagePath}
              alt={`${movie.Title} poster`}
              rounded
              fluid
            />
          </div>
        )}

        {/* Description */}
        {movie.Description && <Card.Text className="mb-4">{movie.Description}</Card.Text>}

        {/* Genre */}
        <div className="mb-4">
          <h3 className="h5 mb-2">Genre</h3>
          <p className="mb-0">
            <b>{movie.Genre?.Name}</b>
            {movie.Genre?.Description ? `: ${movie.Genre.Description}` : ""}
          </p>
        </div>

        {/* Director */}
        <div>
          <h3 className="h5 mb-2">Director</h3>
          <p className="mb-1">
            <b>{movie.Director?.Name}</b>
            {movie.Director?.Birth ? ` (Born: ${movie.Director.Birth})` : ""}
          </p>
          {movie.Director?.Bio && <p className="mb-0">{movie.Director.Bio}</p>}
        </div>
      </Card.Body>
    </Card>
  );
};

MovieView.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string,
<<<<<<< Updated upstream
    ImagePath: PropTypes.string,   // ✅ matches JSX

=======
    ImagePath: PropTypes.string,
>>>>>>> Stashed changes
    Genre: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Description: PropTypes.string,
    }).isRequired,
    Director: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Birth: PropTypes.string,
      Bio: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onBackClick: PropTypes.func.isRequired,
};
