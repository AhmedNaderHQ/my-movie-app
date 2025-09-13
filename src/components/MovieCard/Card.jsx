import { Link } from "react-router-dom";

export default function MovieCard({ title, poster, rating, id, type = "movie" }) {
  const base = type === "tv" ? "/tv" : "/movies";

  return (
    <div className="card h-100 shadow-sm card-zoom">
      <div className="poster-wrap">
        <img
          src={poster || "https://via.placeholder.com/500x750?text=No+Image"}
          className="card-img-top"
          alt={title}
          loading="lazy"
          style={{ height: "350px", objectFit: "cover" }}
        />
        {rating != null && (
          <span className="rating-badge">⭐ {rating}</span>
        )}
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-truncate">{title}</h5>
        <Link to={`${base}/${id}`} className="btn btn-primary mt-auto">
          View Details
        </Link>
      </div>
    </div>
  );
}

