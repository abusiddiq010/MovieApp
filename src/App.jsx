import React, { useCallback, useEffect, useState } from "react";
import AddMovie from "./components/AddMovie";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://react-sample-36279-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json"
      );
      if (!response.ok) {
        throw new Error("something went wrong!");
      }
      const data = await response.json();
      console.log(data);

      const loadedmovies = [];

      for (const key in data) {
        loadedmovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate
        });
      }

      // const transformedMovies = data.map((moviesData) => {
      //   return {
      //     id: moviesData.episode_id,
      //     title: moviesData.title,
      //     openingText: moviesData.opening_crawl,
      //     releaseDate: moviesData.release_date
      //   };
      // });
      setMovies(loadedmovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movies) {
    const response = await fetch(
      "https://react-sample-36279-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movies),
        headers: {
          "content-type": "application/json"
        }
      }
    );
    const data = await response.json();
    console.log(data);
  }

  let content = <p>Found no movies</p>;

  if (isLoading) {
    content = <p>Loading...</p>;
  }
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  console.log(movies);

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
