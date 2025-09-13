import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getPersonDetails, getPersonCombinedCredits, getPersonExternalIds } from "../../util/API";

export default function ActorDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState(null);
  const [external, setExternal] = useState(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const [p, c, e] = await Promise.all([
          getPersonDetails(id),
          getPersonCombinedCredits(id),
          getPersonExternalIds(id),
        ]);
        if (!ignore) {
          setPerson(p.data);
          setCredits(c.data);
          setExternal(e.data);
        }
      } catch (err) {
        if (!ignore) setError("Failed to load person details");
        console.error(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [id]);

  const topWorks = useMemo(() => {
    const list = credits?.cast || [];
    return [...list]
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 12);
  }, [credits]);

  if (loading) return <div className="container my-4"><p>Loading...</p></div>;
  if (error) return <div className="container my-4"><div className="alert alert-danger">{error}</div></div>;
  if (!person) return null;

  const img = person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : "https://via.placeholder.com/500x750?text=No+Image";
  const imdb = external?.imdb_id ? `https://www.imdb.com/name/${external.imdb_id}` : null;

  return (
    <div className="container my-5">
      <div className="row g-4">
        <div className="col-12 col-md-4">
          <img src={img} alt={person.name} className="img-fluid rounded" />
        </div>
        <div className="col-12 col-md-8">
          <h2 className="mb-2">{person.name}</h2>
          <p className="text-muted">{person.known_for_department}</p>
          <ul className="list-unstyled small">
            {person.gender ? <li><strong>Gender:</strong> {person.gender === 1 ? "Female" : person.gender === 2 ? "Male" : "Other"}</li> : null}
            {person.place_of_birth ? <li><strong>Place of Birth:</strong> {person.place_of_birth}</li> : null}
            {person.birthday ? <li><strong>Birthday:</strong> {person.birthday}</li> : null}
            {person.deathday ? <li><strong>Deathday:</strong> {person.deathday}</li> : null}
            {person.popularity != null ? <li><strong>Popularity:</strong> {Math.round(person.popularity)}</li> : null}
            {imdb ? <li><strong>IMDB:</strong> <a href={imdb} target="_blank" rel="noreferrer">Profile</a></li> : null}
          </ul>
          {person.biography && (
            <>
              <h5>Biography</h5>
              <p style={{ whiteSpace: "pre-line" }}>{person.biography}</p>
            </>
          )}
        </div>
      </div>

      {!!topWorks.length && (
        <section className="mt-5">
          <h3 className="mb-3">Known For</h3>
          <div className="row g-4">
            {topWorks.map((w) => (
              <div key={`${w.media_type}-${w.id}`} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100">
                  <img
                    src={w.poster_path ? `https://image.tmdb.org/t/p/w500${w.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image"}
                    className="card-img-top"
                    alt={w.title || w.name}
                    style={{ height: "300px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h6 className="card-title text-truncate">{w.title || w.name}</h6>
                    <span className="badge bg-secondary">{(w.media_type || "").toUpperCase()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
