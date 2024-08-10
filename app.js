const body = document.querySelector("body");
const screenModeButton = document.querySelectorAll('input[type="radio"]');
const genreList = document.querySelector("genre");
const form = document.querySelector("form");
const showType = document.querySelector(".showType");
const genre = document.querySelector(".genre");
const language = document.querySelector(".language");
const search = document.querySelector(".search");
const age = document.querySelector(".age");
const showsList = document.querySelector(".shows-list");

let inputSearch;
let selectedGenre;
let selectedLanguage;
let isAdult = true;
let resultone;
let selectedGenreId;
let isGenreSelected;
let genreName;
const AllGenreDatas = [];
const commonOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNDhhMDdiNzMxNjI0NmQxMmYyNDUwZmU1NjU1OWEyNSIsIm5iZiI6MTcyMzEzNTg0NC4wOTYwMjYsInN1YiI6IjY2YjNiNzQyMDFlZjcyMTgzMjg4NmM0ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wc-OqAOtpMotV1UABiNEA2U77iZ3oIIlfykK0ReJJWQ",
  },
};

/* Event *****************************************/
genre.addEventListener("click", (e) => {
  showGenreListByType();
});

language.addEventListener("click", (e) => {
  showLanguageList();
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // search the name of TV and movies
  if (search.value !== "") {
    if (age.value == "youth") {
      isAdult = false;
    }

    let selectedLanguage = language.value.substring(0, 2).toLowerCase();
    const result = await getAllShowBySearch(
      search.value,
      selectedLanguage,
      isAdult
    );

    if (isGenreSelected) {
      resultone = filterShowData(result);
    } else {
      resultone = result.results;
    }

    showsList.innerHTML = "";
    showListOfShow(resultone);
  }
  // get the trends
  else {
    genreName = genre.value;
    if (genre.value === "---") {
      isGenreSelected = false;
    } else {
      isGenreSelected = true;
    }

    main();
  }

  form.reset();
});

/* Functions *****************************************/
function load() {
  showGenreListByType();
  showLanguageList();
  main();
}

async function main() {
  let typeOfShow;
  if (showType.value === "all") {
    typeOfShow = "all";
  } else if (showType.value === "movies") {
    typeOfShow = "movie";
  } else {
    typeOfShow = "tv";
  }

  const result = await getTrends(typeOfShow, language.value);

  if (isGenreSelected) {
    resultone = filterShowData(result);
  } else {
    resultone = result.results;
  }

  showsList.innerHTML = "";
  showListOfShow(resultone);
}

// filter the showing datas
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
async function showGenreListByType() {
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

    genre.innerHTML = "<option>---</option>";
    response.genres.forEach((data) => {
      const element = document.createElement("option");
      element.append(data.name);
      genre.append(element);

      // store the datas of genre
      AllGenreDatas.push(data);
    });
  } catch (e) {
    alert(e);
  }
}

// show a language list
async function showLanguageList() {
  let response = await getLanguageList();

  language.innerHTML = "<option>---</option>";
  response.forEach((data) => {
    const element = document.createElement("option");
    element.append(data.english_name);
    language.append(element);
  });
}

// toggle between light mode and dark mode
screenModeButton.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.classList.contains("dark-mode")) {
      body.classList.add("theme-dark");
    } else {
      body.classList.remove("theme-dark");
    }
  });
});

// show the lists of shows
function showListOfShow(showDatas) {
  showDatas.forEach((data) => {
    if ((data.original_name || data.original_title) && data.poster_path) {
      const div = document.createElement("div");
      div.classList.add("show-list");
      div.innerHTML = `<div class="imgframe">
    <img src="https://image.tmdb.org/t/p/w500/${data.poster_path}" alt="${data.original_name}">
  </div>
  <div class="card_textbox">
    <div class="card_titletext">
      ${data.original_name}
    </div>
    <div class="card_overviewtext">
      ${data.overview}
    </div>
    <p>${data.release_date}</p>
  </div>`;

      showsList.append(div);
    }
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
async function getAllShowBySearch(inputSearch, selectedLanguage, isAdult) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/multi?query=${inputSearch}&include_adult=${isAdult}&language=${selectedLanguage}&page=1`,
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
