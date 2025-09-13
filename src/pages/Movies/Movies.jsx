import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../../components/MovieCard";
import { getMoviesByCategory, searchMovies } from "../../util/API";

export default function Movies() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || (params.get("query") ? null : "popular");
  const with_genres = params.get("with_genres") || undefined;
  const query = params.get("query") || undefined;
  const page = Number(params.get("page") || 1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({ results: [], page: 1, total_pages: 1 });

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = query
          ? await searchMovies(query, page)
          : await getMoviesByCategory(category || "popular", page, with_genres);
        if (!ignore) setData(data);
      } catch (e) {
        const msg = e?.response?.data?.status_message || e?.message || "Failed to load movies";
        if (!ignore) setError(msg);
        console.error(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [category, with_genres, query, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === undefined || value === null || value === "") next.delete(key);
    else next.set(key, String(value));
    // Reset page when filters change
    if (key !== "page") next.delete("page");
    setParams(next, { replace: true });
  };

  const goPage = (p) => updateParam("page", Math.max(1, Math.min(p, data?.total_pages || 1)));

  return (
    <div className="container my-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">
          {query ? `Search: "${query}"` : category ? `Movies • ${category.replace("_", " ")}` : "Movies"}
          {with_genres ? ` • genre ${with_genres}` : ""}
        </h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading && (
        <div className="row g-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 placeholder-card">
                <div className="card-img-top placeholder-glow"></div>
                <div className="card-body">
                  <span className="placeholder col-8"></span>
                  <div className="mt-2">
                    <span className="placeholder col-6"></span>
                  </div>
                  <div className="mt-3 d-grid">
                    <span className="btn btn-primary disabled placeholder col-12">&nbsp;</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="row g-4">
            {data?.results?.map((m) => (
              <div key={m.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <MovieCard
                  id={m.id}
                  title={m.title || m.name}
                  poster={m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : ""}
                  rating={m.vote_average?.toFixed?.(1) ?? m.vote_average}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="d-flex align-items-center justify-content-center gap-3 my-4">
            <button className="btn btn-outline-primary" disabled={page <= 1} onClick={() => goPage(page - 1)}>
              Prev
            </button>
            <span>
              Page {data?.page || 1} / {data?.total_pages || 1}
            </span>
            <button
              className="btn btn-outline-primary"
              disabled={page >= (data?.total_pages || 1)}
              onClick={() => goPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
