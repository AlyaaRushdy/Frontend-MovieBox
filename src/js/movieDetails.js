const cardsContainer = document.querySelector(".cards-container");
const detailsDiv = document.querySelector(".details");

// get request headers
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNTA2ZGRkNjExM2Q5MDgzZWU5MjdlM2VhNDdjYzgyNSIsIm5iZiI6MTcyMDQ0NTk3NC40NDA1NzEsInN1YiI6IjY2OGE2YmU0NWUxZGYzYWQzMTU3ZWFlMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.yF88ur3H_q8MhuIdcuuTCCOOX1OxzXz4DiVjlMVhEaI",
  },
};

//fetching the genre list from the api
async function getGenresList() {
  const genreList = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list?language=en",
    options
  )
    .then((response) => response.json())
    .then((response) => response.genres)
    .catch((err) => console.error(err));
  return genreList;
}
//fetching the language list from the api
async function getLanguageList() {
  const languageList = await fetch(
    "https://api.themoviedb.org/3/configuration/languages",
    options
  )
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => console.error(err));
  return languageList;
}
//fetching the countries list from the api
async function getCountriesList() {
  const countriesList = await fetch(
    "https://api.themoviedb.org/3/configuration/countries",
    options
  )
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => console.error(err));
  return countriesList;
}

// saving the genre, countries and language array to a variable to avoid sending get requests
const languageList = (async () => {
  const languages = await getLanguageList().then((response) => response);
  return languages;
})();
const genresList = (async () => {
  const genres = await getGenresList().then((response) => response);
  return genres;
})();
const countriesList = (async () => {
  const countries = await getCountriesList().then((response) => response);
  return countries;
})();

// return language name from code
async function languageCodeToName(code) {
  let language = await languageList;
  for (const obj of language) {
    if (code === obj.iso_639_1) {
      return obj.english_name;
    }
  }
}
// return country name from code
async function countryCodeToName(code) {
  let language = await countriesList;
  for (const obj of language) {
    if (code === obj.iso_3166_1) {
      return obj.english_name;
    }
  }
}
// return genre name from id
async function genreIdToName(id) {
  let genres = await genresList;
  for (const obj of genres) {
    if (id === obj.id) {
      return obj.name;
    }
  }
}

// fetch movie details from api
async function getMovieDetails(movieId) {
  const baseURL = ` https://api.themoviedb.org/3/movie/${movieId}?append_to_response=similar,credits`;

  let movies = await fetch(baseURL, options)
    .then((response) => response.json())
    .catch((err) => console.error(err));
  return movies;
}

async function showMovieDetails(movieId) {
  const movieDetails = await getMovieDetails(movieId);
  document.title = `${movieDetails.title} - MovieBox`;
  detailsDiv.innerHTML = "";

  let genres = "";
  for (const genre of movieDetails.genres) {
    const genreSpan = document.createElement("span");
    genreSpan.classList = `rounded-2 bg-primary p-1 me-2 text-white`;
    genreSpan.innerHTML = `<small>${genre.name}</small>`;
    genres += genreSpan.outerHTML;
  }

  let actors = "";
  if (movieDetails.credits.cast.length <= 4) {
    for (const actor of movieDetails.credits.cast) {
      const actorsSpan = document.createElement("span");
      actorsSpan.classList = `after-comma me-1`;
      actorsSpan.innerHTML = `${actor.name}`;
      actors += actorsSpan.outerHTML;
    }
  } else {
    for (let i = 0; i < 5; i++) {
      const actorsSpan = document.createElement("span");
      actorsSpan.classList = `after-comma me-1`;
      actorsSpan.innerHTML = `${movieDetails.credits.cast[i].name}`;
      actors += actorsSpan.outerHTML;
    }
  }

  let countries = "";
  for (const country of movieDetails.origin_country) {
    const countrySpan = document.createElement("span");
    countrySpan.classList = `after-comma pe-1`;
    countrySpan.innerHTML = `${await countryCodeToName(country)}`;
    countries += countrySpan.outerHTML;
  }

  let companies = "";
  for (const company of movieDetails.production_companies) {
    const companySpan = document.createElement("span");
    companySpan.classList = `after-comma pe-1`;
    companySpan.innerHTML = `${company.name}`;
    companies += companySpan.outerHTML;
  }

  console.log(movieDetails);
  let div = document.createElement("div");
  div.classList = "my-4";
  div.innerHTML = `
      <img
        src="http://image.tmdb.org/t/p/w1280/${movieDetails.backdrop_path}"
        alt="${movieDetails.title}"
        class="object-fit-cover h-100 w-100 rounded-3"
      />
      

      <div class="row justify-content-around my-5">
        <div class="col-lg-4 col-6 d-none d-md-block">
          <img
            src=${
              movieDetails.poster_path
                ? `http://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`
                : `../images/placeholder.jpg`
            }
            alt="${movieDetails.title}"
            class="h-100 w-100 rounded-3"
          />
        </div>
        <div class="col-lg-8 col-md-6 col-12 ps-3">
            <h1 class="h3 text-primary mb-4">
                ${movieDetails.title}
            </h1>
            <p class="card-text d-flex flex-wrap gap-3 ">
                <span>${genres}</span>
                <span>
                    <small class="me-3">
                        <i class="fa-regular fa-calendar text-primary me-1"></i> 
                        ${movieDetails.release_date.split("-")[0]}
                    </small>
                    <small class="me-3">
                        <i class="fa-regular fa-star text-primary "></i> 
                        ${movieDetails.vote_average.toFixed(1)}
                    </small>
                    <small>
                        <i class="fa-regular fa-clock text-primary"></i> 
                        ${movieDetails.runtime} min
                    </small>
                </span>
            </p>

            <p class="my-4">${movieDetails.overview}</p>
            
            <p class="m-2">
                <span class="fw-bold">Original Title: </span>
                ${movieDetails.original_title}
            </p>
            <p class="m-2">
                <span class="fw-bold">Actors: </span>
                ${actors}
            </p>
            <p class="m-2">
                <span class="fw-bold">Release Status: </span>
                ${movieDetails.status}
            </p>
            <p class="m-2">
                <span class="fw-bold">Release Date: </span>
                ${new Date(movieDetails.release_date).toDateString()}
            </p>
            <p class="m-2">
                <span class="fw-bold">Language: </span>
                ${await languageCodeToName(movieDetails.original_language)}
            </p>
            <p class="m-2">
                <span class="fw-bold">Origin Country: </span>
                ${countries}
            </p>
            <p class="m-2">
                <span class="fw-bold">Production Companies: </span>
                ${companies ? companies : "-"}
            </p>
        </div>
    </div>`;
  detailsDiv.appendChild(div);
}

async function cards(movieId) {
  // numOfTotalPages, moviesArray
  // if (arguments.length == 2) {
  //   movies = moviesArray;
  //   totalPages = numOfTotalPages;
  // } else if (arguments.length != 0) {
  //   totalPages = numOfTotalPages;
  // }

  const movies = await getMovieDetails(movieId).then(
    (res) => res.similar.results
  );

  cardsContainer.innerHTML = "";

  for (const movie of movies) {
    let genres = "";
    for (const genreId of movie.genre_ids) {
      const genreSpan = document.createElement("span");
      genreSpan.classList = `after-comma`;
      genreSpan.innerHTML = `<small>${await genreIdToName(genreId)}</small>`;
      genres += genreSpan.outerHTML;
    }

    const card = document.createElement("div");
    card.classList = "p-2 ";
    card.innerHTML = `
        <div class="card border-0 p-0 bg-transparent">
          <a href="details.html?id=${movie.id}">
            <img
            src=${
              movie.poster_path
                ? `http://image.tmdb.org/t/p/w500/${movie.poster_path}`
                : `../images/placeholder.jpg`
            }
            class="card-img-top"
            alt="${movie.title} image"
          />
          </a>
          <div class="card-body text-color ps-0">
            <p class="d-flex justify-content-between align-items-center text-main-muted my-0">
              <span class="text-main-muted"> 
                <i class="fa-regular fa-calendar text-primary me-1"></i> 
                ${movie.release_date.split("-")[0]} 
              </span>
              <span class="text-main-muted">
                <i class="fa-regular fa-star text-primary"></i>
                ${movie.vote_average.toFixed(1)}
              </span> 
              
            </p>
            <a href="details.html?id=${movie.id}">
              <h3 class="card-title h4 text-color hover d-inline-block my-2">${
                movie.title
              }</h3>
            </a>
            <p class="card-text d-flex flex-wrap column-gap-1 text-main-muted">${genres}</p>
            
          </div>
        </div>
      `;
    cardsContainer.appendChild(card);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const id = window.location.href.split("id=")[1];
  showMovieDetails(id);
  cards(id);
});

//* change color mode
const colorSchemeToggler = document.querySelector("#color-scheme-toggler");
colorSchemeToggler.addEventListener("click", function () {
  console.log("clicked!");
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    colorSchemeToggler.childNodes[1].classList.remove("fa-sun");
    colorSchemeToggler.childNodes[1].classList.add("fa-moon");
  } else {
    document.documentElement.classList.add("dark");
    colorSchemeToggler.childNodes[1].classList.remove("fa-moon");
    colorSchemeToggler.childNodes[1].classList.add("fa-sun");
  }
});
