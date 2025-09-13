import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../../components/MovieCard";
import PersonCard from "../../components/PersonCard";
import Skeleton from "../../components/Skeleton";
import { searchMulti } from "../../util/API";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const page = Number(params.get("page") || 1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({ results: [], page: 1, total_pages: 1 });

  useEffect(() => {
    if (!q.trim()) { setData({ results: [], page: 1, total_pages: 1 }); return; }
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await searchMulti(q, page);
        if (!ignore) setData(data);
      } catch (e) {
        if (!ignore) setError("Failed to search");
        console.error(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [q, page]);

  const goPage = (p) => {
    const next = new URLSearchParams(params);
    next.set("q", q);
    next.set("page", String(Math.max(1, Math.min(p, data?.total_pages || 1))));
    setParams(next, { replace: true });
  };

  const movies = data.results?.filter((r) => r.media_type === "movie") || [];
  const tv = data.results?.filter((r) => r.media_type === "tv") || [];
  const people = data.results?.filter((r) => r.media_type === "person") || [];

  return (
    <div className="container my-4">
      <h2 className="mb-3">Search</h2>
      {!q.trim() && (
        <div className="alert alert-info">Type something in the search box above and press Enter.</div>
      )}
      {loading && (
        <div className="row g-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <Skeleton />
            </div>
          ))}
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && q.trim() && (
        <>
          {/* Movies */}
          {!!movies.length && (
            <section className="mb-4">
              <h4 className="mb-3">Movies</h4>
              <div className="row g-4">
                {movies.map((m) => (
                  <div key={`movie-${m.id}`} className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <MovieCard
                      type="movie"
                      id={m.id}
                      title={m.title}
                      poster={m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : ""}
                      rating={m.vote_average?.toFixed?.(1) ?? m.vote_average}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TV Shows */}
          {!!tv.length && (
            <section className="mb-4">
              <h4 className="mb-3">TV Shows</h4>
              <div className="row g-4">
                {tv.map((t) => (
                  <div key={`tv-${t.id}`} className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <MovieCard
                      type="tv"
                      id={t.id}
                      title={t.name}
                      poster={t.poster_path ? `https://image.tmdb.org/t/p/w500${t.poster_path}` : ""}
                      rating={t.vote_average?.toFixed?.(1) ?? t.vote_average}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* People */}
          {!!people.length && (
            <section className="mb-4">
              <h4 className="mb-3">People</h4>
              <div className="row g-4">
                {people.map((p) => (
                  <div key={`person-${p.id}`} className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <PersonCard
                      id={p.id}
                      name={p.name}
                      profile={p.profile_path ? `https://image.tmdb.org/t/p/w500${p.profile_path}` : ""}
                      popularity={p.popularity}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {!movies.length && !tv.length && !people.length && (
            <div className="alert alert-warning">No results found for "{q}".</div>
          )}

          {/* Pagination */}
          <div className="d-flex align-items-center justify-content-center gap-3 my-4">
            <button className="btn btn-outline-primary" disabled={page <= 1} onClick={() => goPage(page - 1)}>
              Prev
            </button>
            <span>Page {data?.page || 1} / {data?.total_pages || 1}</span>
            <button className="btn btn-outline-primary" disabled={page >= (data?.total_pages || 1)} onClick={() => goPage(page + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

