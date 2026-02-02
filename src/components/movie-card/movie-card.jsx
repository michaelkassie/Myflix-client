import PropTypes from "prop-types";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

export const MovieCard = ({ movie }) => {
  const poster = movie.ImagePath || "";

  return (
    <Link to={`/movies/${encodeURIComponent(movie._id)}`} className="text-decoration-none">
      <Card className="movieTile h-100">
        <div className="movieTile__media">
          {poster ? (
            <img className="movieTile__img" src={poster} alt={movie.Title} />
          ) : (
            <div className="movieTile__fallback">No poster</div>
          )}
          <div className="movieTile__shade" />
          <div className="movieTile__title">{movie.Title}</div>
        </div>
      </Card>
    </Link>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    Title: PropTypes.string.isRequired,
    ImagePath: PropTypes.string,
  }).isRequired,
};
