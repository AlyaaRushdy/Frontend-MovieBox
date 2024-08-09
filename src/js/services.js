// get request headers
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNTA2ZGRkNjExM2Q5MDgzZWU5MjdlM2VhNDdjYzgyNSIsIm5iZiI6MTcyMDQ0NTk3NC40NDA1NzEsInN1YiI6IjY2OGE2YmU0NWUxZGYzYWQzMTU3ZWFlMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.yF88ur3H_q8MhuIdcuuTCCOOX1OxzXz4DiVjlMVhEaI",
  },
};

// fetch movies from api
export async function getMovies(page) {
  const baseURL = `https://api.themoviedb.org/3/movie/popular?page=${page}`;

  const { movies, totalPages } = await fetch(baseURL, options)
    .then((response) => response.json())
    .then((response) => {
      const totalPages = response.total_pages;
      const movies = response.results;
      return { movies, totalPages };
    })
    .catch((err) => console.error(err));
  console.log("getMovies called!");
  return { movies, totalPages };
}

// fetch search results from api
export async function getSearchResults(searchQuery, page) {
  const baseURL = `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&page=${
    page || 1
  }`;

  let { searchResults, totalPages } = await fetch(baseURL, options)
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      const totalPages = response.total_pages;
      const searchResults = response.results;
      return { searchResults, totalPages };
    })
    .catch((err) => console.error(err));
  console.log("search called!");
  return { searchResults, totalPages };
}

// fetch movie details from api
export async function getMovieDetails(movieId) {
  const baseURL = ` https://api.themoviedb.org/3/movie/${movieId}?append_to_response=similar,credits`;

  let movies = await fetch(baseURL, options)
    .then((response) => response.json())
    .catch((err) => console.error(err));

  return movies;
}
