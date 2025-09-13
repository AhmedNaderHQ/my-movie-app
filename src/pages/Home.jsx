import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { getTrendingMovies, getTrendingTv } from "../util/API";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);
  const [tv, setTv] = useState([]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const [m, t] = await Promise.all([
          getTrendingMovies("day"),
          getTrendingTv("day"),
        ]);
        if (!ignore) {
          setMovies(m.data?.results?.slice(0, 16) || []);
          setTv(t.data?.results?.slice(0, 16) || []);
        }
      } catch (e) {
        if (!ignore) setError(e?.response?.data?.status_message || e.message || "Failed to load home data");
        console.error(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  return (
    <div className="container my-4">
      {error && <div className="alert alert-danger">{error}</div>}

      <h2 className="mb-3">Trending Movies</h2>
      {loading ? (
        <div className="h-scroll mb-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ minWidth: 230, maxWidth: 230 }}>
              <div className="card h-100 placeholder-card">
                <div className="card-img-top placeholder-glow"></div>
                <div className="card-body">
                  <span className="placeholder col-8"></span>
                  <div className="mt-2"><span className="placeholder col-6"></span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-scroll mb-4">
          {movies.map((m) => (
            <div key={m.id} style={{ minWidth: 230, maxWidth: 230 }}>
              <MovieCard
                id={m.id}
                title={m.title || m.name}
                poster={m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : ""}
                rating={m.vote_average?.toFixed?.(1) ?? m.vote_average}
                type="movie"
              />
            </div>
          ))}
        </div>
      )}

      <h2 className="mb-3">Trending TV</h2>
      {loading ? (
        <div className="h-scroll">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ minWidth: 230, maxWidth: 230 }}>
              <div className="card h-100 placeholder-card">
                <div className="card-img-top placeholder-glow"></div>
                <div className="card-body">
                  <span className="placeholder col-8"></span>
                  <div className="mt-2"><span className="placeholder col-6"></span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-scroll">
          {tv.map((t) => (
            <div key={t.id} style={{ minWidth: 230, maxWidth: 230 }}>
              <MovieCard
                id={t.id}
                title={t.name}
                poster={t.poster_path ? `https://image.tmdb.org/t/p/w500${t.poster_path}` : ""}
                rating={t.vote_average?.toFixed?.(1) ?? t.vote_average}
                type="tv"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
