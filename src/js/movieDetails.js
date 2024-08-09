import { getMovieDetails } from "./services.js";

import {
  languageCodeToName,
  countryCodeToName,
  genreIdToName,
} from "./services.staticLists.js";

const cardsContainer = document.querySelector(".cards-container");
const detailsDiv = document.querySelector(".details");
const similarMoviesSection = document.querySelector(".similar-movies");

async function showMovieDetails(movieDetails) {
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
                ${new Date(movieDetails.release_date).toDateString().slice(4)}
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

async function cards(movies) {
  // const movies = movieslist.similar.results;

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

document.addEventListener("DOMContentLoaded", async function () {
  const id = window.location.href.split("id=")[1];
  const movieDetails = await getMovieDetails(id);

  showMovieDetails(movieDetails);
  movieDetails.similar.results.length != 0
    ? cards(movieDetails.similar.results)
    : (similarMoviesSection.style.display = "none");
});
