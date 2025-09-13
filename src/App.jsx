import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Movies from "./pages/Movies/Movies";
import MovieDetails from "./pages/Movies/MovieDetails";
import Actors from "./pages/Actors/Actors";
import ActorDetails from "./pages/Actors/ActorDetails";
import TvShows from "./pages/TvShows/TvShows";
import TvShowDetails from "./pages/TvShows/TvShowDetails";
import Search from "./pages/Search/Search";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/actors" element={<Actors />} />
          <Route path="/actors/:id" element={<ActorDetails />} />
          <Route path="/tv" element={<TvShows />} />
          <Route path="/tv/:id" element={<TvShowDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
