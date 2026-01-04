const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Movie = require("../models/movie.js");
const router = express.Router();

// create
router.post("/", verifyToken, async (req, res) => {
  try {
    req.body.user = req.user._id;
    const movie = await Movie.create(req.body);
    
    movie._doc.user = req.user;
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// index - get all movies
router.get("/", verifyToken, async (req, res) => {
  try {
    const movies = await Movie.find()
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// show - get one movie
router.get("/:movieId", verifyToken, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId).populate("user");
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// update
router.put("/:movieId", verifyToken, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);

    if (!movie.user.equals(req.user._id)) {
      return res.status(403).json({ err: "You're not allowed to do that!" });
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.movieId,
      req.body,
      { new: true }
    );

    updatedMovie._doc.user = req.user;
    res.status(200).json(updatedMovie);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// delete
router.delete("/:movieId", verifyToken, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);

    if (!movie.user.equals(req.user._id)) {
      return res.status(403).json({ err: "You're not allowed to do that!" });
    }

    const deletedMovie = await Movie.findByIdAndDelete(req.params.movieId);
    res.status(200).json(deletedMovie);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;