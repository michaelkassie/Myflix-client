import PropTypes from "prop-types";
import { useParams, Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";

export const MovieView = ({ movies }) => {
  const { movieId } = useParams();
  const movie = movies.find((m) => m._id === movieId);

  if (!movie) {
    return <div>Movie not found.</div>;
  }

  return (
    <Card>
      <Card.Body>
        <Link to="/" className="p-0 mb-3 d-inline-block">
          <Button variant="link" className="p-0">
            ← Back
          </Button>
        </Link>

        <Card.Title as="h2" className="mb-3">
          {movie.Title}
        </Card.Title>

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

        {movie.Description && (
          <Card.Text className="mb-4">{movie.Description}</Card.Text>
        )}

        <div className="mb-4">
          <h3 className="h5 mb-2">Genre</h3>
          <p className="mb-0">
            <b>{movie.Genre?.Name}</b>
            {movie.Genre?.Description ? `: ${movie.Genre.Description}` : ""}
          </p>
        </div>

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
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      Title: PropTypes.string.isRequired,
      Description: PropTypes.string,
      ImagePath: PropTypes.string,
      Genre: PropTypes.shape({
        Name: PropTypes.string.isRequired,
        Description: PropTypes.string,
      }),
      Director: PropTypes.shape({
        Name: PropTypes.string.isRequired,
        Birth: PropTypes.string,
        Bio: PropTypes.string,
      }),
    })
  ).isRequired,
};
