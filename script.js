const resultsTitle = document.getElementById("resultsTitle");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const movieContainer = document.getElementById("movieContainer");
const genreSelect = document.getElementById("genreSelect");

const apiKey = "YOUR_TMDB_API_KEY";
const genres = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
};
searchButton.addEventListener("click", searchMovies);
searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchMovies();
    }
});
async function searchMovies() {
    resultsTitle.textContent = "🔍Search Results";
    const movieName = searchInput.value.trim();

    if (movieName === "") {
        alert("Please enter a movie name.");
        return;
    }

    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieName)}`;
    movieContainer.innerHTML = "<p>Searching for movies...</p>";
    try {
        const response = await fetch(url);
    
        if (!response.ok) {
            throw new Error("Failed to fetch movie data");
        }
    
        const data = await response.json();

    if (data.results.length === 0) {
        movieContainer.innerHTML = "<p>No movies found.</p>";
        return;
    }

    displayMovies(data.results);
} catch (error) {
    console.error(error);
    movieContainer.innerHTML = "<p>Something went wrong. Please try again.</p>";
}
}
function displayMovies(movies) {
    movieContainer.innerHTML = "";

    movies.forEach(movie => {

        const movieCard = document.createElement("div");

        movieCard.classList.add("movie-card");

        movieCard.innerHTML = `
            ${
                movie.poster_path
                ? `<img 
                        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                        alt="${movie.title}"
                   >`
                : `<div class="no-poster">No Poster Available</div>`
            }

            <h3>${movie.title}</h3>

            <p>Release: ${movie.release_date || "Unknown"}</p>

            <p>⭐ ${movie.vote_average.toFixed(1)}/10</p>
        `;

        movieCard.addEventListener("click", () => {
            showMovieDetails(movie);
        });

        movieContainer.appendChild(movieCard);
    });
}
async function loadPopularMovies() {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch popular movies");
        }

        const data = await response.json();

        displayMovies(data.results);

    } catch (error) {
        console.error(error);
        movieContainer.innerHTML =
            "<p>Unable to load popular movies.</p>";
    }
}
function showMovieDetails(movie) {
    const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "";

    const movieGenres = movie.genre_ids
        .map(id => genres[id])
        .filter(Boolean)
        .join(", ");

    const details = `
        <div class="movie-details">
            <button class="close-button" onclick="closeMovieDetails()">×</button>

            ${
                poster
                ? `<img src="${poster}" alt="${movie.title}">`
                : `<div class="no-poster">No Poster Available</div>`
            }

            <div class="movie-info">
                <h2>${movie.title}</h2>

                <p><strong>Release Date:</strong> ${movie.release_date || "Unknown"}</p>

                <p><strong>Rating:</strong> ⭐ ${movie.vote_average.toFixed(1)}/10</p>

                <p><strong>Genres:</strong> ${movieGenres || "Unknown"}</p>

                <p><strong>Overview:</strong></p>

                <p>${movie.overview || "No overview available."}</p>
            </div>
        </div>
    `;

    const modal = document.createElement("div");
    modal.classList.add("modal");
    
    modal.id = "movieModal";

    modal.innerHTML = details;

    document.body.appendChild(modal);
    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeMovieDetails();
        }
    });
    document.addEventListener("keydown", handleEscapeKey);
}

function closeMovieDetails() {
    const modal = document.getElementById("movieModal");

    if (modal) {
        modal.remove();
        document.removeEventListener("keydown", handleEscapeKey);
    }
    
}
function handleEscapeKey(event) {
    if (event.key === "Escape") {
        closeMovieDetails();
    }
}
loadPopularMovies();

genreSelect.addEventListener("change", () => {
    const genreId = genreSelect.value;

    if (genreId === "") {
        resultsTitle.textContent = "🎬 Popular Movies";
        loadPopularMovies();
    } else {
        fetchMoviesByGenre(genreId);
    }
});

async function fetchMoviesByGenre(genreId) {
    resultsTitle.textContent = "🎭 Movies by Genre";

    movieContainer.innerHTML = "<p>Loading movies...</p>";

    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch movies");
        }

        const data = await response.json();

        if (data.results.length === 0) {
            movieContainer.innerHTML = "<p>No movies found.</p>";
            return;
        }

        displayMovies(data.results);

    } catch (error) {
        console.error(error);
        movieContainer.innerHTML =
            "<p>Something went wrong. Please try again.</p>";
    }
}