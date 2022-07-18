"use strict";
const inputSearch = document.querySelector(".js-inputSearch");
const foundMovies = document.querySelector(".js-foundMovies");
const favoriteMovie = document.querySelector(".js-favoriteMovies");
const btnSearch = document.querySelector(".js-btnSearch");
const btnResetSearch = document.querySelector(".js-resetSearch");
const btnRemoveMyMovies = document.querySelector(".js-btnRemoveAll");
const imgWrong =
  "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png";
const imgDefault = "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";

let filmList = []; //array guarda resultado del fetch
let myMovies = [];
let selectedCard = [];

//***********funciones**********************

function callFetch() {
  fetch(`https://api.jikan.moe/v4/anime?q=${inputSearch.value}`)
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      filmList = json.data;
      renderFilmList();
    });
}

function renderFilmList() {
  let html = "";
  let classSelected = "";

  filmList.forEach((item) => {
    const selected = selectedCard.findIndex(
      (selected) => item.mal_id === selected.mal_id
    );
    if (selected !== -1) {
      classSelected = "selected";
    } else {
      classSelected = "";
    }
    if (item.images.jpg.image_url === imgWrong) {
      html += `<li class="film-card js-filmCard  ${classSelected}" id=${item.mal_id}>
    <img src="${imgDefault}" />
            <h3 >${item.title}</h3>
                </li>`;
    } else {
      html += `<li class="film-card js-filmCard  ${classSelected} " id=${item.mal_id}>
      <img src="${item.images.jpg.image_url}" />
              <h3 >${item.title}</h3>
                  </li>`;
    }
  });

  foundMovies.innerHTML = html;
  listenerFilm();
}

function renderMyMovies() {
  let html = "";

  myMovies.forEach((item) => {
    if (item.images.jpg.image_url === imgWrong) {
      html += `<li class="film-card js-favCard" id=${item.mal_id}>
    <img src="${imgDefault}" />
            <h3 >${item.title}</h3>
                </li>`;
    } else {
      html += `<li class="film-card js-favCard " id=${item.mal_id}>
      <img src="${item.images.jpg.image_url}" />
              <h3 >${item.title}</h3>
              </li>`;
    }
  });
  favoriteMovie.innerHTML = html;

  listenerFavorites();
}

function removeMyFavorites() {
  myMovies = [];
  selectedCard = [];
  favoriteMovie.innerHTML = "";
  renderFilmList();
  localStorage.setItem("favoriteMovies", JSON.stringify(myMovies));
}
function saveSelectedCards() {
  localStorage.setItem("selectedCards", JSON.stringify(selectedCard));
}
function loadSelectedCars() {
  const dataLocalStorage = JSON.parse(localStorage.getItem("selectedCards"));
  if (dataLocalStorage === null) {
    console.log("comprobacion null", dataLocalStorage);
  } else {
    selectedCard = dataLocalStorage;
    console.log("cargando seleccionados");
    renderFilmList();
  }
}

function saveMyFavorites() {
  localStorage.setItem("favoriteMovies", JSON.stringify(myMovies));
}

function loadMyFavorites() {
  const dataLocalStorage = JSON.parse(localStorage.getItem("favoriteMovies"));

  if (dataLocalStorage === null) {
    /*  console.log(dataLocalStorage); */
  } else {
    myMovies = dataLocalStorage;
    console.log("cargando favoritos");
    renderMyMovies();
  }
}
// ********funciones manejadoras de eventos********
function handleClickSearch(ev) {
  ev.preventDefault();
  callFetch();
}
function handleClickResetInput(ev) {
  ev.preventDefault();
  inputSearch.value = "";
  foundMovies.innerHTML = "";
}

function handleClickFilm(event) {
  const clickedMovie = parseInt(event.currentTarget.id);
  const match = filmList.find((item) => item.mal_id === clickedMovie);
  if (!myMovies.includes(match)) {
    myMovies.push(match);
    selectedCard.push(match);
  }
  renderFilmList();
  renderMyMovies();
  saveMyFavorites();
  saveSelectedCards();
  console.log(selectedCard);
}
function handleClickFavorite(event) {
  const clickedFav = parseInt(event.currentTarget.id);
  const match = myMovies.findIndex((item) => item.mal_id === clickedFav);

  myMovies.splice(match, 1);
  renderMyMovies();
}
function pressEnter(ev) {
  if (ev.keyCode === 13) {
    ev.preventDefault();
    callFetch();
    return false;
  }
}
function listenerFilm() {
  const film = document.querySelectorAll(".js-filmCard");
  for (const li of film) {
    li.addEventListener("click", handleClickFilm);
  }
}
function listenerFavorites() {
  const film = document.querySelectorAll(".js-favCard");
  for (const li of film) {
    li.addEventListener("click", handleClickFavorite);
  }
}

//*********eventos************
btnResetSearch.addEventListener("click", handleClickResetInput);
btnSearch.addEventListener("click", handleClickSearch);
btnRemoveMyMovies.addEventListener("click", removeMyFavorites);
inputSearch.addEventListener("keydown", pressEnter);

//*********on load*************
loadMyFavorites();
loadSelectedCars();
