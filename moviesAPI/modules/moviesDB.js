const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the "movies" collection
const movieSchema = new Schema({
    plot: String,
    genres: [String],
    runtime: Number,
    cast: [String],
    num_mflix_comments: Number,
    poster: String,
    title: String,
    fullplot: String,
    languages: [String],
    released: Date,
    directors: [String],
    rated: String,
    awards: {
        wins: Number,
        nominations: Number,
        text: String
    },
    lastupdated: Date,
    year: Number,
    imdb: {
        rating: Number,
        votes: Number,
        id: Number
    },
    countries: [String],
    type: String,
    tomatoes: {
        viewer: {
            rating: Number,
            numReviews: Number,
            meter: Number
        },
        dvd: Date,
        lastUpdated: Date
    }
});

// Define the MoviesDB class
module.exports = class MoviesDB {
    constructor() {
        this.Movie = null; // This will hold the model once initialized
    }


    initialize(connectionString) {
      return new Promise((resolve, reject) => {
          const db = mongoose.createConnection(connectionString, {
            
          });
  
          db.on("error", (err) => reject(err));
          db.once("open", () => {
              console.log("Database connection established");
              this.Movie = db.model("movies", movieSchema); // Create the model
              resolve();
          });
      });
  }
  








      // Add a new movie to the database
    async addNewMovie(data) {
        const newMovie = new this.Movie(data);
        return newMovie.save(); // Save the new movie document
    }

    // Fetch all movies with optional pagination and title filtering
    getAllMovies(page, perPage, title) {
        const filter = title ? { title: new RegExp(title, "i") } : {};

        // Construct the pipeline
        const pipeline = [{ $match: filter }, { $sort: { year: 1 } }];

        // Add pagination stages if page and perPage are provided
        if (page && perPage) {
            const skip = (page - 1) * perPage;
            pipeline.push({ $skip: skip });
            pipeline.push({ $limit: perPage });
        }

        // Use aggregate with allowDiskUse
        return this.Movie.aggregate(pipeline).allowDiskUse(true).exec();
    }

    // Fetch a movie by its ID
    getMovieById(id) {
        return this.Movie.findOne({ _id: id }).exec();
    }

    // Update a movie by its ID
    updateMovieById(data, id) {
        return this.Movie.updateOne({ _id: id }, { $set: data }).exec();
    }

    // Delete a movie by its ID
    deleteMovieById(id) {
        return this.Movie.deleteOne({ _id: id }).exec();
    }
};
