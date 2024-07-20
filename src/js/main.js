let page = 1;
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
// saving the genres array to a variable to avoid sending get requests
const genresList = (async () => {
  const list = await getGenresList().then((response) => response);
  return list;
})();
// return genra name from id
async function genreIdToName(id) {
  let genres = await genresList;
  for (const obj of genres) {
    if (id === obj.id) {
      return obj.name;
    }
  }
}

// fetch movies from api
async function getMovies() {
  const baseURL = `https://api.themoviedb.org/3/movie/popular?page=${page}`;

  let movies = await fetch(baseURL, options)
    .then((response) => response.json())
    .then((response) => {
      totalPages = response.total_pages;
      results = response.results;
      return { results, totalPages };
    })
    .catch((err) => console.error(err));
  return movies;
}

// fetch search results from api
async function getSearchResults(searchQuery) {
  const baseURL = `https://api.themoviedb.org/3/search/movie?query=${searchQuery}`;

  let movies = await fetch(baseURL, options)
    .then((response) => response.json())
    .then((response) => {
      totalPages = response.total_pages;
      results = response.results;
      return { results, totalPages };
    })
    .catch((err) => console.error(err));
  return movies;
}

async function showMovies() {
  let { movies = results, totalPages } = await getMovies().then((res) => res);

  async function carousel() {
    // const { movies = results, totalPages } = await getMovies().then(
    //   (res) => res
    // );

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

  async function cards(numOfTotalPages, moviesArray) {
    // let movies;
    // if (arguments.length === 0) {
    //   movies = await getMovies();
    // } else {
    //   movies = moviesArray;
    // }

    if (arguments.length == 2) {
      movies = moviesArray;
      totalPages = numOfTotalPages;
    } else if (arguments.length != 0) {
      totalPages = numOfTotalPages;
    }

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
    // pagination(totalPages);
  }

  return { carousel: carousel, cards: cards };
}

async function pagination(totalPages) {
  console.log(`total pages = ${totalPages}`);

  paginationNav.addEventListener("click", async (event) => {
    console.log(page);

    if (event.target === nextButton) {
      page++;
      await showMovies().then((response) => {
        response.cards();
        scrollToCardsStart();
      });
    } else if (event.target === prevButton) {
      page--;
      await showMovies().then((response) => {
        response.cards();
        scrollToCardsStart();
      });
    }

    if (page === 1) {
      prevButton.classList.add("disabled");
    } else if (page === totalPages) {
      nextButton.classList.add("disabled");
    } else {
      prevButton.classList.remove("disabled");
      nextButton.classList.remove("disabled");
    }

    console.log(event.target.textContent);
    console.log(page);
  });
}
//* scroll to top
function scrollToCardsStart() {
  let vh = document.documentElement.clientHeight;
  window.scrollTo({
    top: vh - (20 * vh) / 100,
    behavior: "smooth",
  });
}

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

// function setMovieIdToLocalStorage(id) {
//   localStorage.setItem("movieId", id);
//   console.log("added!");
// }
// localStorage.clear();

document.addEventListener("DOMContentLoaded", async function () {
  await showMovies().then((response) => {
    response.carousel();
    response.cards();
    pagination();
  });
});

searchBtn.addEventListener("click", async function (event) {
  event.preventDefault();

  const searchQuery = document.querySelector(".search-input").value;
  if (searchQuery) {
    const { searchResults = results, totalPages } = await getSearchResults(
      searchQuery
    ).then((res) => res);

    await showMovies().then((response) => {
      navbar.classList.remove("position-absolute", "bg-transparent");
      navbar.classList.add("position-relative", "bg-primary");
      document
        .querySelector(".navbar-collapse")
        .classList.remove("bg-primary", "bg-gradient");
      carousel.remove();
      cardsHeading.textContent = `Search results for: ${searchQuery}`;
      response.cards(totalPages, searchResults);
      pagination(totalPages);
    });
  }
});
