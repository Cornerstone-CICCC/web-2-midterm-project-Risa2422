const body = document.querySelector("body");
const screenModeButton = document.querySelectorAll('input[type="radio"]');
const genreList = document.querySelector("genre");
const form = document.querySelector("form");
const showType = document.querySelector(".showType");
const genre = document.querySelector(".genre");
const language = document.querySelector(".language");

/* Event */
genre.addEventListener("click", (e) => {
  showGenreListByType();
});

language.addEventListener("click", (e) => {
  showLanguageList();
});

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

  showOptions(response.genres, genre);
}

// show a language list
async function showLanguageList() {
  let response = await getLanguageList();

  showOptions(response, language);
}

// show the option
function showOptions(response, targetElement) {
  response.genres.forEach((data) => {
    const element = document.createElement("option");
    element.append(data.name);
    genre.append(element);
  });
}

// Toggle between light mode and dark mode
screenModeButton.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.classList.contains("dark-mode")) {
      body.classList.add("theme-dark");
    } else {
      body.classList.remove("theme-dark");
    }
  });
});

// get a genre list
async function getGenreList(showType) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNDhhMDdiNzMxNjI0NmQxMmYyNDUwZmU1NjU1OWEyNSIsIm5iZiI6MTcyMzEzNTg0NC4wOTYwMjYsInN1YiI6IjY2YjNiNzQyMDFlZjcyMTgzMjg4NmM0ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wc-OqAOtpMotV1UABiNEA2U77iZ3oIIlfykK0ReJJWQ",
    },
  };

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/${showType}/list?language=en`,
      options
    );

    const data = await response.json();
    return data;
  } catch (e) {
    throw e;
  }
}

// get a language list
async function getLanguageList() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNDhhMDdiNzMxNjI0NmQxMmYyNDUwZmU1NjU1OWEyNSIsIm5iZiI6MTcyMzEzNTg0NC4wOTYwMjYsInN1YiI6IjY2YjNiNzQyMDFlZjcyMTgzMjg4NmM0ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wc-OqAOtpMotV1UABiNEA2U77iZ3oIIlfykK0ReJJWQ",
    },
  };

  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/configuration/languages",
      options
    );

    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
  }
}
