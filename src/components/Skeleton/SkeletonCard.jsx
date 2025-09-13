export default function SkeletonCard() {
  return (
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
  );
}

