/*********************************************************************************
 * WEB422 – Assignment 1
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Koji Saeki Student ID: 148443203 Date: 2023/01/15
 * Cyclic Link: https://real-yoke-fawn.cyclic.app/
 * ********************************************************************************/

const express = require("express");
const app = express();

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const HTTP_PORT = process.env.PORT || 8080;

const cors = require("cors");
app.use(cors());
require("dotenv").config();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API listening" });
});

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on : ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// *** ADD ROUTS ***
// ADD A NEW MOVIE
// return the newly created movie object or error msg
app.post("/api/movies", (req, res) => {
  db.addNewMovie(req.body)
    .then((data) => {
      res.status(201).json({ message: `added a new movie ${data}` }); //201: Created
    })
    .catch((err) => {
      res.status(500).json({ errorMessage: "couldn't add a new movie"}); // or send?
    });
});

// GET/api/movies
// get movie objects depending on the params
app.get("/api/movies", (req, res) => {
  db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json({ errorMessage: "invalid params (on getAllMovies)" }); // or send?
    });
});

// GET ONE MOVIE BY ID
app.get("/api/movies/:id", (req, res) => {
  db.getMovieById(req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json({ errorMessage: `requested ID:${req.params.id} not found (on getMovieById)`}); // or send?
    });
});

// UPDATE MOVIE BY ID
app.put("/api/movies/:id", (req, res) => {
  db.updateMovieById(req.body, req.params.id)
    .then((data) => {
      res.json(data);
      console.log(`ID(${req.params.id}) has been updated`);
    })
    .catch((err) => {
        res.status(500).json({ errorMessage: `requested ID:${req.params.id} not found (on update)`}); // or send?
    });
});

// DELETE MOVIE BY ID
app.delete("/api/movies/:id", (req, res) => {
  db.deleteMovieById(req.params.id)
    .then(() => {
      res.status(204).json({ message: `ID(${req.params.id}) has been deleted` }).end(); // 204: No Content
      console.log(`ID(${req.params.id}) has been deleted`);
    })
    .catch((err) => {
        res.status(500).json({ errorMessage: `requested ID:${req.params.id} not found (on delete)`}); // or send?
    });
});
