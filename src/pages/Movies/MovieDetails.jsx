import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieDetails, getMovieCredits, getMovieVideos, getSimilarMovies } from "../../util/API";
import MovieCard from "../../components/MovieCard";

export default function MovieDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState(null);
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const [d, c, v, s] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id),
          getMovieVideos(id),
          getSimilarMovies(id, 1),
        ]);
        if (!ignore) {
          setDetails(d.data);
          setCredits(c.data);
          setVideos(v.data);
          setSimilar(s.data?.results || []);
        }
      } catch (e) {
        if (!ignore) setError("Failed to load movie details");
        console.error(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [id]);

  const director = useMemo(() => credits?.crew?.find((m) => m.job === "Director"), [credits]);
  const trailer = useMemo(() => {
    const vids = videos?.results || [];
    return vids.find((v) => v.site === "YouTube" && v.type === "Trailer") || vids[0];
  }, [videos]);

  if (loading) return <div className="container my-4"><p>Loading...</p></div>;
  if (error) return <div className="container my-4"><div className="alert alert-danger">{error}</div></div>;
  if (!details) return null;

  const poster = details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <div className="container my-5">
      <div className="row g-4">
        <div className="col-12 col-md-4">
          <img src={poster} alt={details.title} className="img-fluid rounded" loading="lazy" />
        </div>
        <div className="col-12 col-md-8">
          <h2 className="mb-2">{details.title}</h2>
          <p className="text-muted">{details.release_date?.slice(0,4)} • {details.original_language?.toUpperCase()}</p>
          <div className="mb-2">
            {details.genres?.map((g) => (
              <span key={g.id} className="badge bg-secondary me-2">{g.name}</span>
            ))}
          </div>
          {details.runtime ? <p><strong>Runtime:</strong> {details.runtime} min</p> : null}
          {director ? <p><strong>Director:</strong> {director.name}</p> : null}
          {details.vote_average != null && <p><strong>Rating:</strong> ⭐ {details.vote_average?.toFixed?.(1) ?? details.vote_average}</p>}
          <p className="mt-3">{details.overview}</p>

          {/* Companies */}
          {!!details.production_companies?.length && (
            <div className="mt-3">
              <h6>Production Companies</h6>
              <div className="d-flex flex-wrap gap-3">
                {details.production_companies.map((c) => (
                  <div key={c.id} className="d-flex align-items-center gap-2">
                    {c.logo_path && (
                      <img src={`https://image.tmdb.org/t/p/w200${c.logo_path}`} alt={c.name} loading="lazy" style={{ height: 24, objectFit: "contain" }} />
                    )}
                    <span className="small">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trailer */}
      {trailer && (
        <section className="mt-5">
          <h3 className="mb-3">Trailer</h3>
          <div className="ratio ratio-16x9">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* Cast */}
      {!!credits?.cast?.length && (
        <section className="mt-5">
          <h3 className="mb-3">Top Cast</h3>
          <div className="row g-4">
            {credits.cast.slice(0, 10).map((m) => (
              <div key={m.cast_id || m.credit_id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                <div className="card h-100">
                  <img
                    src={m.profile_path ? `https://image.tmdb.org/t/p/w300${m.profile_path}` : "https://via.placeholder.com/300x300?text=No+Image"}
                    className="card-img-top"
                    alt={m.name}
                    loading="lazy"
                    style={{ height: 150, objectFit: "cover" }}
                  />
                  <div className="card-body p-2">
                    <div className="small fw-bold text-truncate">{m.name}</div>
                    <div className="small text-muted text-truncate">{m.character}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Similar */}
      {!!similar.length && (
        <section className="mt-5">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h3 className="mb-0">Similar Movies</h3>
            <Link to={`/movies?category=similar&id=${id}`} className="btn btn-sm btn-outline-secondary" onClick={(e) => e.preventDefault()}> </Link>
          </div>
          <div className="row g-4">
            {similar.slice(0, 12).map((m) => (
              <div key={m.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <MovieCard
                  id={m.id}
                  title={m.title}
                  poster={m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : ""}
                  rating={m.vote_average?.toFixed?.(1) ?? m.vote_average}
                  type="movie"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
