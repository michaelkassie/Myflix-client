export const MovieCard = ({ movie, onMovieClick }) => {
  return (
    <div
      onClick={() => onMovieClick(movie)}
      style={{
        border: "1px solid #ccc",
        padding: "12px",
        marginBottom: "10px",
        cursor: "pointer",
        borderRadius: "8px"
      }}
    >
      <div style={{ fontWeight: "bold" }}>{movie.Title}</div>
    </div>
  );
};
