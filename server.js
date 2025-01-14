/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: ______________________ Student ID: ______________ Date: ________________
*  Vercel Link: _______________________________________________________________
********************************************************************************/

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const MoviesDB = require("./moviesAPI/modules/moviesDB.js");

dotenv.config();


const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const db = new MoviesDB();

app.use(cors());
app.use(express.json());

console.log("Server file is running");

// Default route to check if the server is running
app.get("/", (req, res) => {
    res.json({ message: "API Listening" });
});

// Add a new movie
app.post("/api/movies", (req, res) => {
    db.addNewMovie(req.body)
        .then((newMovie) => res.status(201).json(newMovie))
        .catch((err) => res.status(500).json({ error: "Unable to add movie", details: err }));
});

app.get("/api/movies", (req, res) => {
    const { page, perPage, title } = req.query;
  
    db.getAllMovies(parseInt(page), parseInt(perPage), title)
      .then((movies) => {
        res.json(movies); // Return movies on success
      })
      .catch((err) => {
        console.error("Error fetching movies:", err); // Log the error in the console
        res.status(500).json({ error: "Unable to fetch movies", details: err.message || err }); // Send error response
      });
  });
  

// Get a movie by its ID
app.get("/api/movies/:id", (req, res) => {
    db.getMovieById(req.params.id)
        .then((movie) => {
            if (movie) res.json(movie);
            else res.status(404).json({ error: "Movie not found" });
        })
        .catch((err) => res.status(500).json({ error: "Unable to fetch movie", details: err }));
});

// Update a movie by its ID
app.put("/api/movies/:id", (req, res) => {
    db.updateMovieById(req.body, req.params.id)
        .then(() => res.status(204).end())
        .catch((err) => res.status(500).json({ error: "Unable to update movie", details: err }));
});

// Delete a movie by its ID
app.delete("/api/movies/:id", (req, res) => {
    db.deleteMovieById(req.params.id)
        .then(() => res.status(204).end())
        .catch((err) => res.status(500).json({ error: "Unable to delete movie", details: err }));
});


// Initialize the database connection and start the server
db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`Server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.error("Unable to start the server:", err);
});
