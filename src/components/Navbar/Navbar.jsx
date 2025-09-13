import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Dropdown } from "bootstrap";
import { getMovieGenres, getTvGenres } from "../../util/API";

function AppNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [genres, setGenres] = useState([]);
  const [tvGenres, setTvGenres] = useState([]);

  const [q, setQ] = useState("");
  const [theme, setTheme] = useState("dark");

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    try {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
      setTheme(initial);
      document.documentElement.setAttribute('data-bs-theme', initial);
    } catch {
      /* ignore */
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-bs-theme', next);
    try { localStorage.setItem('theme', next); } catch { /* noop */ }
  };

  useEffect(() => {
    (async () => {
      try {
        const [mg, tg] = await Promise.all([getMovieGenres(), getTvGenres()]);
        setGenres(mg.data.genres || []);
        setTvGenres(tg.data.genres || []);
      } catch (e) {
        console.error("Failed to load genres", e);
      }
    })();


  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    setQ("");
    // Close navbar collapse on mobile after submitting search
    const collapse = document.getElementById('navbarContent');
    if (collapse?.classList?.contains('show')) {
      collapse.classList.remove('show');
      const toggler = document.querySelector('[data-bs-target="#navbarContent"]');
      if (toggler) toggler.setAttribute('aria-expanded', 'false');
    }
  };

  // Ensure dropdowns are initialized (in case data API isn’t auto-bound)
  useEffect(() => {
    const triggers = document.querySelectorAll(".dropdown-toggle");
    triggers.forEach((el) => {
      try { new Dropdown(el); } catch { /* noop */ }
    });
  }, []);


  const isMovies = location.pathname.startsWith("/movies");
  const isTV = location.pathname.startsWith("/tv");
  const themeClasses = theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-light';

  return (
    <nav className={`navbar navbar-expand-lg ${themeClasses} sticky-top shadow-sm navbar-blur`}>
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          🎬 Movie App
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Movies Dropdown */}
            <li className="nav-item dropdown">
              <a
                className={`nav-link dropdown-toggle ${isMovies ? 'active' : ''}`}
                href="#"
                id="moviesDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Movies
              </a>
              <ul className="dropdown-menu" aria-labelledby="moviesDropdown">
                <li><Link className="dropdown-item" to="/movies?category=now_playing">Now Playing</Link></li>
                <li><Link className="dropdown-item" to="/movies?category=popular">Popular</Link></li>
                <li><Link className="dropdown-item" to="/movies?category=top_rated">Top Rated</Link></li>
                <li><Link className="dropdown-item" to="/movies?category=upcoming">Upcoming</Link></li>
              </ul>
            </li>

            {/* Genres Dropdown (Movies) */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="genresDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Genres
              </a>
              <ul className="dropdown-menu" aria-labelledby="genresDropdown">
                {genres.map((g) => (
                  <li key={g.id}>
                    <button className="dropdown-item" onClick={() => navigate(`/movies?with_genres=${g.id}`)}>
                      {g.name}
                    </button>
                  </li>
                ))}
              </ul>
            </li>

            {/* Actors */}
            <li className="nav-item">
              <NavLink to="/actors" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Actors</NavLink>
            </li>

            {/* TV Shows Dropdown */}
            <li className="nav-item dropdown">
              <a
                className={`nav-link dropdown-toggle ${isTV ? 'active' : ''}`}
                href="#"
                id="tvDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                TV Shows
              </a>
              <ul className="dropdown-menu" aria-labelledby="tvDropdown">
                <li><Link className="dropdown-item" to="/tv?category=airing_today">Airing Today</Link></li>
                <li><Link className="dropdown-item" to="/tv?category=on_the_air">On TV</Link></li>
                <li><Link className="dropdown-item" to="/tv?category=popular">Popular</Link></li>
                <li><Link className="dropdown-item" to="/tv?category=top_rated">Top Rated</Link></li>
              </ul>
            </li>

            {/* TV Genres Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="tvGenresDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                TV Genres
              </a>
              <ul className="dropdown-menu" aria-labelledby="tvGenresDropdown">
                {tvGenres.map((g) => (
                  <li key={g.id}>
                    <button className="dropdown-item" onClick={() => navigate(`/tv?with_genres=${g.id}`)}>
                      {g.name}
                    </button>
                  </li>
                ))}
              </ul>
            </li>

          </ul>

          {/* Search */}
          <form className="d-flex" onSubmit={onSearch} role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search"
            />
            <button className={`btn ${theme==='dark' ? 'btn-outline-light' : 'btn-outline-secondary'}`} type="submit">Search</button>
          </form>

          {/* Theme toggle */}
          <button
            type="button"
            className={`btn ms-2 ${theme==='dark' ? 'btn-outline-light' : 'btn-outline-secondary'}`}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme==='dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

        </div>
      </div>
    </nav>
  );
}

export default AppNavbar;
