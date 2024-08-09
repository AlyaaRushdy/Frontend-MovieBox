// get request headers
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNTA2ZGRkNjExM2Q5MDgzZWU5MjdlM2VhNDdjYzgyNSIsIm5iZiI6MTcyMDQ0NTk3NC40NDA1NzEsInN1YiI6IjY2OGE2YmU0NWUxZGYzYWQzMTU3ZWFlMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.yF88ur3H_q8MhuIdcuuTCCOOX1OxzXz4DiVjlMVhEaI",
  },
};

//fetching the genre list from the api and saving it as an array
const genresList = (async function getGenresList() {
  const genreList = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list?language=en",
    options
  )
    .then((response) => response.json())
    .then((response) => response.genres)
    .catch((err) => console.error(err));
  return genreList;
})();

//fetching the language list from the api and saving it as an array
const languageList = (async function getLanguageList() {
  const languageList = await fetch(
    "https://api.themoviedb.org/3/configuration/languages",
    options
  )
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => console.error(err));
  return languageList;
})();

//fetching the countries list from the api and saving it as an array
const countriesList = (async function getCountriesList() {
  const countriesList = await fetch(
    "https://api.themoviedb.org/3/configuration/countries",
    options
  )
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => console.error(err));
  return countriesList;
})();

// return language name from code
export async function languageCodeToName(code) {
  let language = await languageList;
  for (const obj of language) {
    if (code === obj.iso_639_1) {
      return obj.english_name;
    }
  }
}

// return country name from code
export async function countryCodeToName(code) {
  let language = await countriesList;
  for (const obj of language) {
    if (code === obj.iso_3166_1) {
      return obj.english_name;
    }
  }
}

// return genre name from id
export async function genreIdToName(id) {
  let genres = await genresList;
  for (const obj of genres) {
    if (id === obj.id) {
      return obj.name;
    }
  }
}
