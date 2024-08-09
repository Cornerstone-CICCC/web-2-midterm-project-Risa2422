const body = document.querySelector("body");
const screenModeButton = document.querySelectorAll('input[type="radio"]');
const genreList = document.querySelector("genre");
const form = document.querySelector("form");
const showType = document.querySelector(".showType");
const genre = document.querySelector(".genre");
const language = document.querySelector(".language");
const search = document.querySelector(".search");
const age = document.querySelector(".age");

let inputSearch;
let selectedGenre;
let selectedLanguage;
let isAdult = true;
let resultone;
const AllGenreDatas = [];
const commonOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNDhhMDdiNzMxNjI0NmQxMmYyNDUwZmU1NjU1OWEyNSIsIm5iZiI6MTcyMzEzNTg0NC4wOTYwMjYsInN1YiI6IjY2YjNiNzQyMDFlZjcyMTgzMjg4NmM0ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wc-OqAOtpMotV1UABiNEA2U77iZ3oIIlfykK0ReJJWQ",
  },
};

showGenreListByType();
showLanguageList();

/* Event */
genre.addEventListener("click", (e) => {
  showGenreListByType();
});

language.addEventListener("click", (e) => {
  showLanguageList();
});

form.addEventListener("submit", async function (e) {
  let typeOfShow;
  let currentGenreId;

  e.preventDefault();
  if (search.value !== "") {
    if (age.value == "youth") {
      isAdult = false;
    }

    let selectedLanguage = language.value.substring(0, 2).toLowerCase();
    result = await getAllShowBySearch(search.value, selectedLanguage, isAdult);

    if (genre.value === "---") {
      resultone = result;
    } else {
      resultone = filterShowData(result);
    }
  }
  // show the trends
  else {
    if (showType.value === "all") {
      typeOfShow = "all";
    } else if (showType.value === "movie") {
      typeOfShow = "movie";
    } else {
      typeOfShow = "tv";
    }

    const result2 = await getTrends(typeOfShow, language.value);

    if (genre.value === "---") {
      resultone = result2;
    } else {
      resultone = filterShowData(result2);
    }
    console.log(resultone);
  }
});

// filter the showing data
function filterShowData(responsData) {
  // get a selected genre
  AllGenreDatas.forEach((data) => {
    if (data.name === genre.value) {
      currentGenreId = data.id;
    }
  });

  return responsData.results.filter((data) => {
    if (data.genre_ids && Array.isArray(data.genre_ids)) {
      return data.genre_ids.some((genreId) => genreId === currentGenreId);
    } else {
      return false;
    }
  });
}

// show genre list
async function showGenreListByType() {
  let response;
  genre.innerHTML = "";

  if (showType.value === "all") {
    // just for now
    response = await getGenreList();
  } else if (showType.value === "movies") {
    // get a movie list
    response = await getGenreList("movie");
  } else {
    // get a TV list
    response = await getGenreList("tv");
  }

    genre.innerHTML = "";
    response.genres.forEach((data, index) => {
      const element = document.createElement("option");
      if (index === 0) {
        element.append("---");
        element.classList.add("no-genre");
      } else {
        element.append(data.name);
      }
      genre.append(element);
      AllGenreDatas.push(data);
    });
  } catch (e) {
    console.log(e);
  }
    response.genres.forEach((data, index) => {
      const element = document.createElement("option");
      if (index === 0) {
        element.append("---");
        element.classList.add("no-genre");
      } else {
        element.append(data.name);
      }
      genre.append(element);
      AllGenreDatas.push(data);
    });
  } catch (e) {
    console.log(e);
  }
}

// show a language list
async function showLanguageList() {
  let response = await getLanguageList();

  language.innerHTML = "";
  response.forEach((data) => {
    const element = document.createElement("option");
    element.append(data.english_name);
    language.append(element);
  });
}

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
    throw e;
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
    console.log(e);
  }
}

// get show info
async function getAllShowBySearch(inputSearch, selectedLanguage, isAdult) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/multi?query=${inputSearch}&include_adult=${isAdult}&language=${selectedLanguage}&page=1`,
      commonOptions
    );

    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
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
    console.log(e);
  }
}
