import { genreIdToName } from "./services.staticLists.js";
import { getMovies, getSearchResults } from "./services.js";

const navbar = document.querySelector(".navbar");
const searchBtn = document.querySelector(".search-btn");
const carousel = document.querySelector(".carousel");
const carouselInner = document.querySelector(".carousel-inner");
const cardsContainer = document.querySelector(".cards-container");
const cardsHeading = document.querySelector(".cards-h2");
const paginationList = document.querySelector(".pagination");
const paginationNav = document.querySelector(".pagination-nav");
const prevButton = document.querySelector(".prevButton");
const nextButton = document.querySelector(".nextButton");
let page = 1;
let searchPage = 1;
let requestType;

async function showMovies(movies) {
  async function carousel() {
    for (let i = 0; i < 3; i++) {
      const carouselItemDiv = document.createElement("div");
      carouselItemDiv.classList.add("carousel-item");
      carouselItemDiv.innerHTML = `
        <div class="card text-bg-dark rounded-0 border-0">
          <img
            src="http://image.tmdb.org/t/p/w1280/${movies[i].backdrop_path}"
            class="card-img object-fit-cover rounded-0"
            alt="${movies[i].title} image"
          />
          <div
            class="card-img-overlay align-content-center rounded-0 border-0"
          >
            <div class="container mx-auto">
              <div class="col col-md-8 col-lg-6 d-flex flex-column justify-content-center align-items-start">
                <a href="./src/html/details.html?id=${movies[i].id}"
                 class="link-offset-3-hover text-decoration-underline link-underline-light link-underline-opacity-0 link-underline-opacity-100-hover">
                  <h2 class="card-title h1 link-light" >${movies[i].title}</h2>
                </a>
                <p class="card-text ">
                  ${movies[i].overview.slice(
                    0,
                    150
                  )}... <a href="./src/html/details.html?id=${movies[i].id}"
                   class="text-primary">Read more</a>
                </p>
    
                <p class="card-text d-flex justify-content-between align-items-center flex-wrap gap-1 my-0 w-50">
                  <small >${await genreIdToName(movies[i].genre_ids[0])}</small>
                  <small>
                    <i class="fa-regular fa-calendar text-primary me-1"></i> 
                    ${movies[i].release_date.split("-")[0]}</small>
                  <small>
                    <i class="fa-regular fa-star text-primary "></i> 
                    ${movies[i].vote_average.toFixed(1)}
                  </small>
                </p>
              </div>
            </div>  
          </div>
        </div>
      `;
      carouselInner.appendChild(carouselItemDiv);
    }
    carouselInner.firstChild.classList.add("active");
  }

  async function cards() {
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
      card.classList = "p-2 col-8 col-sm";
      card.innerHTML = `
          <div class="card border-0 p-0 bg-transparent">
            <a href="./src/html/details.html?id=${movie.id}">
              <img
              src=${
                movie.poster_path
                  ? `http://image.tmdb.org/t/p/w500/${movie.poster_path}`
                  : `./src/images/placeholder.jpg`
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
              <a href="./src/html/details.html?id=${movie.id}">
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

  return { carousel: carousel, cards: cards };
}

async function pagination(totalPages, reqType, searchQuery) {
  console.log(`total pages = ${totalPages}`);
  console.log(reqType);
  pagesNumbers(searchPage, totalPages);

  paginationNav.addEventListener("click", async (event) => {
    if (event.target === nextButton) {
      if (reqType === "search") {
        searchPage++;
        let { searchResults, totalPages } = await getSearchResults(
          searchQuery,
          searchPage
        );
        await showMovies(searchResults, totalPages).then((response) => {
          response.cards();
          pagesNumbers(searchPage, totalPages);
        });
      } else if (reqType === "allMovies") {
        page++;
        let { movies, totalPages } = await getMovies(page);
        await showMovies(movies, totalPages).then((response) => {
          response.cards();
          pagesNumbers(page, totalPages);
        });
      }
      cardsHeading.scrollIntoView();
      disablePrevAndNextButtons(totalPages);
    } else if (event.target === prevButton) {
      if (reqType === "search") {
        searchPage--;
        let { searchResults, totalPages } = await getSearchResults(
          searchQuery,
          searchPage
        );
        await showMovies(searchResults, totalPages).then((response) => {
          response.cards();
          pagesNumbers(searchPage, totalPages);
        });
      } else if (reqType === "allMovies") {
        page--;
        let { movies, totalPages } = await getMovies(page);
        await showMovies(movies, totalPages).then((response) => {
          response.cards();
          pagesNumbers(page, totalPages);
        });
      }
      cardsHeading.scrollIntoView();
      disablePrevAndNextButtons(totalPages);
    } else if (event.target.classList.contains("page-num")) {
      if (reqType === "search") {
        if (Number(event.target.textContent) === searchPage) {
          return;
        } else {
          searchPage = Number(event.target.textContent);
          let { searchResults, totalPages } = await getSearchResults(
            searchQuery,
            searchPage
          );
          await showMovies(searchResults, totalPages).then((response) => {
            response.cards();
            pagesNumbers(searchPage, totalPages);
          });
        }
      } else if (reqType === "allMovies") {
        if (Number(event.target.textContent) === page) {
          return;
        } else {
          page = Number(event.target.textContent);
          let { movies, totalPages } = await getMovies(page);
          await showMovies(movies, totalPages).then((response) => {
            response.cards();
            pagesNumbers(page, totalPages);
          });
        }
      }
      cardsHeading.scrollIntoView();
      disablePrevAndNextButtons(totalPages);
    } else {
      return;
    }
  });

  disablePrevAndNextButtons(totalPages);
}

function pagesNumbers(currentPage, totalPages) {
  paginationList.innerHTML = "";
  if (totalPages - 2 < currentPage + 2 && totalPages >= 5) {
    for (let i = totalPages - 4; i <= totalPages; i++) {
      const li = document.createElement("li");
      li.classList = i === currentPage ? "page-item active" : "page-item";
      li.innerHTML = `<button class="btn btn-outline-primary page-num">${i}</button>`;
      paginationList.appendChild(li);
    }
    console.log("in total-2<cu+2");
  } else if (currentPage >= 3 && totalPages >= 5) {
    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
      const li = document.createElement("li");
      li.classList = i === currentPage ? "page-item active" : "page-item";
      li.innerHTML = `<button class="btn btn-outline-primary page-num">${i}</button>`;
      paginationList.appendChild(li);
    }
    console.log("in current>3");
  } else if (totalPages >= 5) {
    for (let i = 1; i <= 5; i++) {
      const li = document.createElement("li");
      li.classList = i === currentPage ? "page-item active" : "page-item";
      li.innerHTML = `<button class="btn btn-outline-primary page-num">${i}</button>`;
      paginationList.appendChild(li);
    }
    console.log("in total>5");
  } else {
    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement("li");
      li.classList = i === currentPage ? "page-item active" : "page-item";
      li.innerHTML = `<button class="btn btn-outline-primary page-num">${i}</button>`;
      paginationList.appendChild(li);
    }
    console.log("in else");
  }
}

function disablePrevAndNextButtons(totalPages) {
  if (page === 1 && searchPage === 1) {
    prevButton.classList.add("disabled");
  } else {
    prevButton.classList.remove("disabled");
  }

  if (page === totalPages && searchPage === totalPages) {
    nextButton.classList.add("disabled");
  } else {
    nextButton.classList.remove("disabled");
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  let { movies, totalPages } = await getMovies(page);
  requestType = "allMovies";
  await showMovies(movies, totalPages).then((response) => {
    response.carousel();
    response.cards();
    pagination(totalPages, requestType);
  });
});

searchBtn.addEventListener("click", async function (event) {
  event.preventDefault();

  searchPage = 1;
  const searchQuery = document.querySelector(".search-input").value;
  if (searchQuery) {
    const { searchResults, totalPages } = await getSearchResults(
      searchQuery,
      searchPage
    );

    requestType = "search";
    await showMovies(searchResults, totalPages).then((response) => {
      navbar.classList.remove("position-absolute", "bg-transparent");
      navbar.classList.add("position-relative", "bg-primary");
      document
        .querySelector(".navbar-collapse")
        .classList.remove("bg-primary", "bg-gradient");
      carousel.remove();
      cardsHeading.textContent = `Search results for: ${searchQuery}`;
      response.cards();
      pagination(totalPages, requestType, searchQuery);
    });
  }
});
