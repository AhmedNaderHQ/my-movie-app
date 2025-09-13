import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
if (!API_KEY) {
  // Helpful log in dev to indicate missing key
  // eslint-disable-next-line no-console
  console.error("[TMDB] Missing VITE_TMDB_API_KEY. Create a .env file with VITE_TMDB_API_KEY=YOUR_KEY and restart the dev server.");
}

export const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: { api_key: API_KEY },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // eslint-disable-next-line no-console
    console.error("[TMDB] Request failed:", err?.response?.status, err?.response?.data?.status_message || err.message);
    return Promise.reject(err);
  }
);

// Movies
export const getMovieGenres = () => api.get("/genre/movie/list");
export const getMoviesByCategory = (category = "popular", page = 1, with_genres) =>
  api.get(`/movie/${category}`, {
    params: {
      page,
      ...(with_genres ? { with_genres } : {}),
    },
  });
export const searchMovies = (query, page = 1) =>
  api.get("/search/movie", { params: { query, page, include_adult: false } });
export const getMovieDetails = (id) => api.get(`/movie/${id}`);
export const getMovieCredits = (id) => api.get(`/movie/${id}/credits`);
export const getSimilarMovies = (id, page = 1) => api.get(`/movie/${id}/similar`, { params: { page } });
export const getMovieVideos = (id) => api.get(`/movie/${id}/videos`);

// TV
export const getTvGenres = () => api.get("/genre/tv/list");
export const getTvByCategory = (category = "popular", page = 1, with_genres) =>
  api.get(`/tv/${category}`, {
    params: {
      page,
      ...(with_genres ? { with_genres } : {}),
    },
  });
export const searchTv = (query, page = 1) =>
  api.get("/search/tv", { params: { query, page, include_adult: false } });
export const getTvDetails = (id) => api.get(`/tv/${id}`);
export const getTvSeason = (id, seasonNumber) => api.get(`/tv/${id}/season/${seasonNumber}`);

export const getTvCredits = (id) => api.get(`/tv/${id}/credits`);
export const getSimilarTv = (id, page = 1) => api.get(`/tv/${id}/similar`, { params: { page } });
export const getTvVideos = (id) => api.get(`/tv/${id}/videos`);

// Trending
export const getTrendingMovies = (window = "day") => api.get(`/trending/movie/${window}`);
export const getTrendingTv = (window = "day") => api.get(`/trending/tv/${window}`);

// People
export const getTrendingPeople = (page = 1) => api.get("/trending/person/week", { params: { page } });
export const getPersonDetails = (id) => api.get(`/person/${id}`);
export const getPersonCombinedCredits = (id) => api.get(`/person/${id}/combined_credits`);
export const searchMulti = (query, page = 1) => api.get("/search/multi", { params: { query, page } });



// Extra helpers
export const getPersonExternalIds = (id) => api.get(`/person/${id}/external_ids`);
export const getMovieRecommendations = (id, page = 1) => api.get(`/movie/${id}/recommendations`, { params: { page } });
export const getTvRecommendations = (id, page = 1) => api.get(`/tv/${id}/recommendations`, { params: { page } });
