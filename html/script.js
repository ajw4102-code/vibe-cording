const API_KEY = "fda95f3f2735339b8cc88eda89cf5530";
const BASE_URL = "https://api.themoviedb.org/3/movie/now_playing";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const movieGrid = document.getElementById("movieGrid");
const template = document.getElementById("movieTemplate");

const PLACEHOLDER_SVG = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750">'
  + '<rect width="100%" height="100%" fill="#1b1b1b"/>'
  + '<text x="50%" y="50%" font-size="24" fill="#fff" dominant-baseline="middle" text-anchor="middle">No Poster</text>'
  + '</svg>'
);

async function fetchMovies() {
  try {
    const res = await fetch(`${BASE_URL}?api_key=${API_KEY}&language=ko-KR&page=1`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    displayMovies(data.results || []);
  } catch (err) {
    console.error("에러 발생:", err);
    movieGrid.innerHTML = '<p class="error">영화를 불러오는 중 에러가 발생했습니다.</p>';
  }
}

function displayMovies(movies) {
  movieGrid.innerHTML = "";
  if (!movies.length) {
    movieGrid.innerHTML = '<p class="empty">현재 상영중인 영화가 없습니다.</p>';
    return;
  }

  movies.forEach(movie => {
    const frag = template.content.cloneNode(true);
    const card = frag.querySelector(".movie-card");
    const img = frag.querySelector(".poster");
    const titleEl = frag.querySelector(".movie-title");

    titleEl.textContent = movie.title || movie.name || "제목 없음";

    if (movie.poster_path) {
      img.src = `${IMAGE_BASE}${movie.poster_path}`;
      img.alt = movie.title || "poster";
    } else {
      img.src = PLACEHOLDER_SVG;
      img.alt = "포스터 없음";
    }

    img.addEventListener("error", () => {
      img.src = PLACEHOLDER_SVG;
    });

    card.addEventListener("click", () => {
      if (movie.id) window.open(`https://www.themoviedb.org/movie/${movie.id}`, "_blank");
    });

    movieGrid.appendChild(frag);
  });
}

fetchMovies();
