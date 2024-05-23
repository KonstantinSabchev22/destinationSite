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

router.get('/:id', async function(req, res, next) {
  try {
    const placeId = req.params.id;
    const place = await Places.findByPk(placeId);
    if (!place) {
      return res.status(404).send('Place not found');
    }
    res.render('places/placeDetails', { place: place });
  } catch (error) {
    next(error);
  }
});

router.get('/new', function(req, res, next) {
  res.render('places/newPlace');
});

router.post('/new', async function(req, res, next){
  const name = req.body.name;
  const howToReach = req.body.howToReach;
  const description = req.body.description;
  const phone = req.body.phone;

  const data = {
    name: name,
    howToReach: howToReach,
    description: description,
    phone: phone
  };

  await Places.create(data);
  res.redirect('/places');
});

module.exports = router;