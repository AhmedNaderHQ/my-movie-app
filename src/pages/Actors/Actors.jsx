import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PersonCard from "../../components/PersonCard";
import { getTrendingPeople } from "../../util/API";

export default function Actors() {
  const [params, setParams] = useSearchParams();
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
        const { data } = await getTrendingPeople(page);
        if (!ignore) setData(data);
      } catch (e) {
        if (!ignore) setError("Failed to load trending people");
        console.error(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [page]);

  const goPage = (p) => {
    const next = new URLSearchParams(params);
    next.set("page", String(Math.max(1, Math.min(p, data?.total_pages || 1))));
    setParams(next, { replace: true });
  };

  return (
    <div className="container my-4">
      <h2 className="mb-3">Trending People</h2>
      {loading && <p>Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          <div className="row g-4">
            {data?.results?.map((p) => (
              <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <PersonCard
                  id={p.id}
                  name={p.name}
                  profile={p.profile_path ? `https://image.tmdb.org/t/p/w500${p.profile_path}` : ""}
                  popularity={p.popularity}
                />
              </div>
            ))}
          </div>

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
