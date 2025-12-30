
import PropTypes from "prop-types";



export const MovieView = ({ movie, onBackClick }) => {
  return (
    <div>
      <button onClick={onBackClick} style={{ marginBottom: "12px" }}>
        Back
      </button>

      <h2>{movie.Title}</h2>

      <img
        src={movie.ImagePath}
        alt={`${movie.Title} poster`}
        style={{
          width: "220px",
          display: "block",
          marginBottom: "12px",
          borderRadius: "8px"
        }}
      />

      <p>{movie.Description}</p>

      <div style={{ marginTop: "12px" }}>
        <h3>Genre</h3>
        <p>
          <b>{movie.Genre.Name}</b>: {movie.Genre.Description}
        </p>
      </div>

      <div style={{ marginTop: "12px" }}>
        <h3>Director</h3>
        <p>
          <b>{movie.Director.Name}</b> (Born: {movie.Director.Birth})
        </p>
        <p>{movie.Director.Bio}</p>
      </div>
    </div>
  );
};

MovieView.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string,
    ImagePath: PropTypes.string,   // ✅ matches JSX

    Genre: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Description: PropTypes.string
    }).isRequired,

    Director: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Birth: PropTypes.string,
      Bio: PropTypes.string
    }).isRequired
  }).isRequired,

  onBackClick: PropTypes.func.isRequired
};
