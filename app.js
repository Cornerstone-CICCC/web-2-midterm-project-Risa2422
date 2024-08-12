const genreList = document.querySelector("genre");
const form = document.querySelector("form");
const showType = document.querySelector(".showType");
const genre = document.querySelector(".genre");
const language = document.querySelector(".language");
const search = document.querySelectorAll(".search");
const age = document.querySelector(".age");
const showsList = document.querySelector(".shows-list");
let inputSearch;
let selectedGenre;
let selectedLanguage;
let displayData;
let selectedGenreId;
let isGenreSelected;
let genreName;

const AllGenreDatas = [];
const showArr = [];
const commonOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNDhhMDdiNzMxNjI0NmQxMmYyNDUwZmU1NjU1OWEyNSIsIm5iZiI6MTcyMzEzNTg0NC4wOTYwMjYsInN1YiI6IjY2YjNiNzQyMDFlZjcyMTgzMjg4NmM0ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wc-OqAOtpMotV1UABiNEA2U77iZ3oIIlfykK0ReJJWQ",
  },
};

/* Event *****************************************/
// avoid selecting a language when searching for titles.
search.forEach((element) => {
  element.addEventListener("input", (event) => {
    const inputValue = event.target.value;

    if (inputValue !== "") {
      language.style.backgroundColor = "#EBEBEB";
      language.disabled = true;
    } else {
      language.style.backgroundColor = "white";
      language.disabled = false;
    }
  });
});

genre.addEventListener("click", (e) => {
  showGenreList();
});

language.addEventListener("click", (e) => {
  showLanguageList();
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // get the selected genre name and the condition
  genreName = genre.value;
  if (genre.value === "---") {
    isGenreSelected = false;
  } else {
    isGenreSelected = true;
  }

  // search the name of TV and movies
  if (search.value !== "") {
    let selectedLanguage = language.value.substring(0, 2).toLowerCase();

    // get data based on the search input
    const result = await getAllShowBySearch(search.value, selectedLanguage);

    if (isGenreSelected) {
      displayData = filterShowData(result);
    } else {
      displayData = result.results;
    }

    showsList.innerHTML = "";
    displayListOfShow(displayData, false, false);
  } else {
    // get the trends
    getTrendDatas();
  }

  form.reset();
  language.style.backgroundColor = "white";
  language.disabled = false;
});

/* Functions *****************************************/
function load() {
  showGenreList();
  showLanguageList();
  getTrendDatas();
}

async function getTrendDatas() {
  let typeOfShow;
  let isTV = false;

  if (showType.value === "all") {
    typeOfShow = "all";
  } else if (showType.value === "movies") {
    typeOfShow = "movie";
    isTV = true;
  } else {
    typeOfShow = "tv";
  }

  const trendDatas = await getTrends(typeOfShow, language.value);

  if (isGenreSelected) {
    displayData = filterShowData(trendDatas);
  } else {
    displayData = trendDatas.results;
  }

  showsList.innerHTML = "";
  displayListOfShow(displayData, true, isTV);
}

// filter showing datas
function filterShowData(responsData) {
  // get a selected genreId
  AllGenreDatas.forEach((data) => {
    if (data.name === genreName) {
      selectedGenreId = data.id;
    }
  });

  return responsData.results.filter((data) => {
    if (data.genre_ids && Array.isArray(data.genre_ids)) {
      return data.genre_ids.some((genreId) => genreId === selectedGenreId);
    } else {
      return false;
    }
  });
}

// show a genre list
async function showGenreList() {
  let response;
  try {
    if (showType.value === "all") {
      // just for now
      response = await getGenreList("movie");
    } else if (showType.value === "movie") {
      // get a movie list
      response = await getGenreList("movie");
    } else {
      // get a TV list
      response = await getGenreList("tv");
    }

    setOptions(genre, response.genres, "name");
  } catch (e) {
    alert(e);
  }
}

// show a language list
async function showLanguageList() {
  let response = await getLanguageList();

  setOptions(language, response, "english_name");
}

// build HTML for setting options
function setOptions(genres, responses, name) {
  genres.innerHTML = "<option>---</option>";
  responses.forEach((data) => {
    const element = document.createElement("option");
    element.append(data[name]);
    genres.append(element);

    AllGenreDatas.push(data);
  });
}

// diplay search result
function displayListOfShow(showDatas, isSearchTrends, isTV) {
  let showId = 1;
  const showArr = [];
  let fetchTitle;

  showDatas.forEach((data) => {
    // ※avoid showing data that does not have a title or overview
    if ((data.name || data.title) && data.poster_path && data.overview) {
      if (isSearchTrends || isTV) {
        fetchTitle = data.title;
        if (!fetchTitle) {
          fetchTitle = data.name;
        }
      } else {
        fetchTitle = data.name;
        if (!fetchTitle) {
          fetchTitle = data.title;
        }
      }

      const showData = document.createElement("div");
      showData.classList.add("show-list");
      showData.innerHTML = `
        <div class="imgframe">
          <img src="https://image.tmdb.org/t/p/w500/${data.poster_path}" alt="${fetchTitle}">
        </div>
        <div class="card-textbox">
          <div class="card-text">
            ${fetchTitle}
          </div>
          <div class="card-overview">
            ${data.overview}
          </div>
          <button id="button-${showId}">More Info</button>
        </div>`;
      showsList.append(showData);

      // store the data related to the current modal when it is displayed
      const showObj = {
        id: showId,
        name: fetchTitle,
        overview: data.overview,
        release_date: data.release_date,
        img: `https://image.tmdb.org/t/p/w500/${data.poster_path}`,
      };
      showArr.push(showObj);
      showId++;
    }
  });

  // show a modal
  document.querySelectorAll(".show-list button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const buttonId = e.target.id.replace("button-", "");

      const selectedData = showArr.find(
        (data) => data.id.toString() === buttonId
      );

      if (selectedData) {
        const overlay = document.createElement("div");
        overlay.classList.add("overlay");

        const modal = document.createElement("div");
        modal.classList.add("modal");
        modal.innerHTML = `
        <div class="modal-imgframe">
            <img src="${selectedData.img}" alt="${selectedData.name}">
        </div>
        <div class="modal-card-textbox">
            <div class="modal-card-text">
            ${selectedData.name}
            </div>
            <div class="modal-card-overview ">
            ${selectedData.overview}
            </div>
            <button class="close-modal">Close</button>
        </div>
        `;

        overlay.appendChild(modal);
        body.append(overlay);
        body.style.overflow = "hidden";

        // close a modal
        document.querySelector(".close-modal").addEventListener("click", () => {
          overlay.remove();
          body.style.overflow = "";
        });
      }
    });
  });
}

/* API *****************************************/
// get a genre list
async function getGenreList(showType) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/${showType}/list?language=en`,
      commonOptions
    );

    const data = await response.json();
    return data;
  } catch (e) {
    alert(e);
  }
}

// get a language list
async function getLanguageList() {
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/configuration/languages",
      commonOptions
    );

    const data = await response.json();
    return data;
  } catch (e) {
    alert(e);
  }
}

// get the show info
async function getAllShowBySearch(inputSearch, selectedLanguage) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/multi?query=${inputSearch}&include_adult=false&language=${selectedLanguage}&page=1`,
      commonOptions
    );

    const data = await response.json();
    return data;
  } catch (e) {
    alert(e);
  }
}

// get the trends
async function getTrends(typeOfShow, selectedLanguage) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/trending/${typeOfShow}/day?${selectedLanguage}`,
      commonOptions
    );

    const data = await response.json();
    return data;
  } catch (e) {
    alert(e);
  }
}

load();
