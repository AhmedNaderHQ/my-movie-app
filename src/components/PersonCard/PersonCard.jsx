import { Link } from "react-router-dom";

export default function PersonCard({ id, name, profile, popularity }) {
  const img = profile || "https://via.placeholder.com/500x750?text=No+Image";
  return (
    <div className="card h-100 shadow-sm">
      <img src={img} className="card-img-top" alt={name} loading="lazy" style={{ height: "350px", objectFit: "cover" }} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-truncate">{name}</h5>
        {popularity != null && <p className="card-text">⭐ {Math.round(popularity)}</p>}
        <Link to={`/actors/${id}`} className="btn btn-secondary mt-auto">View Profile</Link>
      </div>
    </div>
  );
}

