//Declaring variables

let searchBar = document.querySelector(".header_form-input");
let isVisible = false;
let loader = document.querySelector(".loader");
let logo = document.querySelector(".header__logo");
let movie_icon = document.querySelector("#img_icon");
let movie_seasons = document.querySelector("#movie_seasons");
let errorMessage = document.querySelector(".error-msg");
let fuzzy = document.querySelector(".fuzzy_div");
let recList = document.querySelector(".fuzzy_list");

// Function to fetch API
const get_movie = (value = "Game of thrones") => {
  loader.style.opacity = 1;
  loader.style.zIndex = 0;

  fetch(`https://api.tvmaze.com/singlesearch/shows?q=${value}&embed=episodes`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data._embedded.episodes.length > 0) {
        const new_data = data._embedded.episodes.slice(0, 8);
        create_UI(data);
        return create_episodesUI(new_data);
      } else {
        return create_UI(data);
      }
    })
    .catch((error) => {
      errorMessage.classList.remove("slide-out-right");
      errorMessage.classList.add("slide-in-right");
      errorMessage.style.opacity = "1";
      window.addEventListener("click", () => {
        errorMessage.classList.remove("slide-in-right");
        errorMessage.classList.add("slide-out-right");
        errorMessage.style.opacity = "0";
      });
      console.log(error.message);
    })
    .finally(() =>
      setTimeout(() => {
        loader.style.opacity = 0;
        loader.style.zIndex = -1;
      }, 500)
    );
  searchBar.style.display = "none";
  fuzzy.style.display = "none";
  logo.style.display = "block";
  movie_icon.style.display = "block";
  isVisible = false;
  searchBar.value = "";
};

// Function to alter UI of Html and add data
const create_UI = (data) => {
  const movie_img = document.querySelector("#img_src");
  const movie_icon = document.querySelector("#img_icon");
  const movie_title = document.querySelector(".movie_title");
  const movie_desc = document.querySelector(".movie_desc");
  const movie_link = document.querySelector(".btn");
  const movie_date = document.querySelector("#movie_date");
  const movie_rating = document.querySelector("#movie_rating");
  const movie_runtime = document.querySelector("#movie_runtime");
  const movie_status = document.querySelector("#movie_status");
  const movie_seasons = document.querySelector("#movie_seasons");
  const last_episode = data._embedded.episodes.length - 1;

  // set the UI
  movie_icon.src = data.image.medium;
  movie_img.src = data.image.original;
  movie_title.textContent = data.name;
  movie_desc.innerHTML = data.summary;
  movie_link.href = data.officialSite;
  movie_date.textContent = data.premiered;
  movie_rating.textContent = data.rating.average;
  movie_runtime.textContent = data.runtime;
  movie_status.textContent = data.status;
  movie_seasons.textContent = data._embedded.episodes[last_episode].season;
};

// Create Episode UI
const create_episodesUI = (data) => {
  //episodes
  const episodes_list = document.querySelector("#episodes");

  // remove children if they exist
  episodes_list.innerHTML = "";

  data.forEach((episode) => {
    let li = document.createElement("li");
    const link = document.createElement("a");
    const img = document.createElement("img");
    img.src = episode.image.original;
    // Append the text node to anchor element.
    link.appendChild(img);

    // Set the title.
    link.title = episode.name;

    // Set the href property.
    link.href = episode.url;
    // link.target = "blank"

    // Append the anchor element to the body.
    li.appendChild(link);
    episodes_list.appendChild(li);
  });
};

// getting default UI
get_movie();

// Event handler when we submit form
const search = (event) => {
  event.preventDefault();
  const value = searchBar.value;
  get_movie(value);
};

//Function for fuzzy search
function fuzySearch(valll) {
  recList.innerHTML = "";
  fetch(`https://api.tvmaze.com/search/shows?q=${valll}`)
    .then((response) => {
      return response.json();
    })
    .then((searchResult) => {
      if (searchResult.length > 4) {
        let newResult = searchResult.slice(0, 5);
        newResult.forEach((element) => {
          let li = document.createElement("li");
          li.className = "fuzzy_item";
          li.innerText = `${element.show.name}`;
          recList.appendChild(li);
          li.addEventListener("click", () => {
            searchBar.value = li.innerText;
          });
        });
      } else {
        searchResult.forEach((element) => {
          let li = document.createElement("li");
          li.className = "fuzzy_item";
          li.innerText = `${element.show.name}`;
          recList.appendChild(li);
          li.addEventListener("click", () => {
            searchBar.value = li.innerText;
          });
        });
      }
      return "good";
    });
}

// function for search bar reveal
document.addEventListener("DOMContentLoaded", () => {
  const searchIcon = document.querySelector(".search-icon");
  const searchX = "<i class='fa-solid fa-x search-icon spinning'></i>";
  const searchY =
    "<i class='fa-solid fa-magnifying-glass search-icon spinning'></i>";
  const button = document.querySelector(".lets_get_it");
  searchBar.addEventListener("input", (e) => {
    fuzySearch(e.target.value);
    if (searchBar.value.length == 1) {
      fuzzy.style.display = "block";
      button.innerHTML = searchY;
    } else if (searchBar.value.length > 1) {
      button.innerHTML =
        "<i class='fa-solid fa-magnifying-glass search-icon'></i>";
    } else {
      button.innerHTML = searchX;
      fuzzy.style.display = "none";
    }
  });
  button.addEventListener("click", () => {
    button.innerHTML = searchX;
    searchBar.classList.add("slide-right");
    if (window.matchMedia("(max-width: 600px)").matches) {
      if (!isVisible) {
        searchBar.style.display = "block";
        logo.style.display = "none";
        movie_icon.style.display = "none";
        isVisible = true;
      } else if (isVisible && searchBar.value) {
        get_movie(searchBar.value);
        button.innerHTML = searchY;
        //   searchBar.style.display = "none";
        //   logo.style.display = "block";
        //   movie_icon.style.display = "block";
        //   isVisible = false;
        //   button.innerHTML = searchY;
      } else {
        searchBar.style.display = "none";
        logo.style.display = "block";
        movie_icon.style.display = "block";
        isVisible = false;
        button.innerHTML = searchY;
      }
    } else {
      if (!isVisible) {
        searchBar.style.display = "block";
        isVisible = true;
      } else if (isVisible && searchBar.value) {
        get_movie(searchBar.value);
        button.innerHTML = searchY;
      } else {
        searchBar.style.display = "none";
        isVisible = false;
        button.innerHTML = searchY;
      }
    }
  });
});
