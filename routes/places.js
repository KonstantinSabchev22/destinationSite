var express = require('express');
var router = express.Router();
const Places = require('../models/Places');

router.get('/', async function(req, res, next) {
  try {
    // Query all places from the database
    const allPlaces = await Places.findAll();
    console.log(allPlaces);
    // Render the index.jade template and pass the places as a variable
    res.render('places/index', { places: allPlaces });
  } catch (error) {
    // Handle errors
    next(error);
  }
});

module.exports = router;