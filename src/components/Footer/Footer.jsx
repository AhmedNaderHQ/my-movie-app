import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer py-4 mt-5">
      <div className="container">
        <div className="row g-4 align-items-start">
          <div className="col-12 col-md-6">
            <h5 className="mb-2">🎬 MyMovies</h5>
            <p className="mb-2 text-secondary">Your destination for movies, TV shows, actors, and more.</p>
            <small className="text-muted">Powered by The Movie Database (TMDb)</small>
          </div>
          <div className="col-12 col-md-6">
            <div className="row">
              <div className="col-6">
                <h6 className="text-uppercase text-secondary">Movies</h6>
                <ul className="list-unstyled mb-0">
                  <li><Link to="/movies?category=popular">Popular</Link></li>
                  <li><Link to="/movies?category=top_rated">Top Rated</Link></li>
                  <li><Link to="/movies?category=upcoming">Upcoming</Link></li>
                </ul>
              </div>
              <div className="col-6">
                <h6 className="text-uppercase text-secondary">Explore</h6>
                <ul className="list-unstyled mb-0">
                  <li><Link to="/tv?category=popular">TV Popular</Link></li>
                  <li><Link to="/actors">Actors</Link></li>
                  <li><Link to="/search">Search</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <hr className="border-secondary-subtle my-4" />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <small className="text-muted">© {year} MyMovies</small>
          <small className="text-muted">This product uses the TMDB API but is not endorsed or certified by TMDB.</small>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
