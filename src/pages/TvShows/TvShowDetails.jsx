import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getTvDetails, getTvCredits, getTvVideos, getSimilarTv, getTvSeason } from "../../util/API";
import MovieCard from "../../components/MovieCard";

export default function TvShowDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState(null);
  const [similar, setSimilar] = useState([]);

  const [seasonEpisodes, setSeasonEpisodes] = useState({});
  const [loadingSeason, setLoadingSeason] = useState({});

  const toggleSeason = async (season) => {
    const num = season.season_number;
    // collapse if already loaded
    if (seasonEpisodes[num]) {
      setSeasonEpisodes((prev) => ({ ...prev, [num]: undefined }));
      return;
    }
    try {
      setLoadingSeason((prev) => ({ ...prev, [num]: true }));
      const { data } = await getTvSeason(id, num);
      setSeasonEpisodes((prev) => ({ ...prev, [num]: data.episodes || [] }));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to load season", num, e);
    } finally {
      setLoadingSeason((prev) => ({ ...prev, [num]: false }));
    }
  };

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const [d, c, v, s] = await Promise.all([
          getTvDetails(id),
          getTvCredits(id),
          getTvVideos(id),
          getSimilarTv(id, 1),
        ]);
        if (!ignore) {
          setDetails(d.data);
          setCredits(c.data);
          setVideos(v.data);
          setSimilar(s.data?.results || []);
        }
      } catch (e) {
        if (!ignore) setError("Failed to load TV show details");
        console.error(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [id]);

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
          <img src={poster} alt={details.name} className="img-fluid rounded" loading="lazy" />
        </div>
        <div className="col-12 col-md-8">
          <h2 className="mb-2">{details.name}</h2>
          <p className="text-muted">{details.first_air_date?.slice(0,4)} - {details.original_language?.toUpperCase()}</p>
          <div className="mb-2">
            {details.genres?.map((g) => (
              <span key={g.id} className="badge bg-secondary me-2">{g.name}</span>
            ))}
          </div>
          <ul className="list-unstyled small">
            {details.number_of_seasons != null && <li><strong>Seasons:</strong> {details.number_of_seasons}</li>}
            {details.number_of_episodes != null && <li><strong>Episodes:</strong> {details.number_of_episodes}</li>}
            {details.episode_run_time?.length ? <li><strong>Episode runtime:</strong> {details.episode_run_time[0]} min</li> : null}
          </ul>
          {details.vote_average != null && <p><strong>Rating:</strong> ⭐ {details.vote_average?.toFixed?.(1) ?? details.vote_average}</p>}
          <p className="mt-3">{details.overview}</p>
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
              <div key={m.credit_id} className="col-6 col-sm-4 col-md-3 col-lg-2">
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


      {/* Seasons */}
      {details.seasons?.length ? (
        <section className="mt-5">
          <h3 className="mb-3">Seasons</h3>
          <ul className="list-group">
            {details.seasons.map((season) => (
              <li key={season.id} className="list-group-item">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="fw-bold">{season.name}</div>
                    <div className="small text-muted">
                      {(season.air_date || "").slice(0,4) || "\u2014"} \u2022 {season.episode_count} episodes
                    </div>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => toggleSeason(season)}
                  >
                    {seasonEpisodes[season.season_number] ? "Hide episodes" : "View episodes"}
                  </button>
                </div>

                {loadingSeason[season.season_number] && (
                  <div className="small text-muted mt-2">Loading...</div>
                )}

                {Array.isArray(seasonEpisodes[season.season_number]) && (
                  <div className="mt-3">
                    <div className="row g-3">
                      {seasonEpisodes[season.season_number].map((ep) => (
                        <div key={ep.id} className="col-12 col-md-6">
                          <div className="border rounded p-2 h-100">
                            <div className="fw-semibold">E{ep.episode_number}: {ep.name}</div>
                            <div className="small text-muted">{ep.air_date || ""}</div>
                            {ep.still_path && (
                              <img
                                src={`https://image.tmdb.org/t/p/w300${ep.still_path}`}
                                alt={ep.name}
                                loading="lazy"
                                className="img-fluid rounded mt-2"
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Similar */}
      {!!similar.length && (
        <section className="mt-5">
          <h3 className="mb-3">Similar TV Shows</h3>
          <div className="row g-4">
            {similar.slice(0, 12).map((t) => (
              <div key={t.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <MovieCard
                  id={t.id}
                  type="tv"
                  title={t.name}
                  poster={t.poster_path ? `https://image.tmdb.org/t/p/w500${t.poster_path}` : ""}
                  rating={t.vote_average?.toFixed?.(1) ?? t.vote_average}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
