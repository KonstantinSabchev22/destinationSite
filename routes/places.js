var express = require('express');
var router = express.Router();
const { Op } = require('sequelize');
const Places = require('../models/Places');
const UserPlaces = require('../models/UserPlaces');
const middleware = require('../middleware/auth');

router.get('/', async function(req, res, next) {
  try {
    // Check for placeFilter query parameter
    const placeFilter = req.query.placeFilter;

    let queryOptions = {};

    if (placeFilter) {
      queryOptions = {
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${placeFilter}%` } },
            { description: { [Op.like]: `%${placeFilter}%` } }
          ]
        }
      };
    }

    // Query all places from the database
    const allPlaces = await Places.findAll(queryOptions);
    console.log(allPlaces);
    // Render the index.jade template and pass the places as a variable
    res.render('places/index', { places: allPlaces });
  } catch (error) {
    // Handle errors
    next(error);
  }
});

router.get('/new', middleware.ensureRole("admin"), function(req, res, next) {
  res.render('places/newPlace');
});

router.post('/new', middleware.ensureRole("admin"), async function(req, res, next){
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

router.get('/:id', async function(req, res, next) {
  try {
    const placeId = req.params.id;
    const place = await Places.findByPk(placeId);
    if (!place) {
      return res.status(404).send('Place not found');
    }
    let isFavorite = false;
    console.log(req.user);
    if (req.user){
      isFavorite = await UserPlaces.findOne({
        where: {
          userId: req.user.id,
          placeId: placeId,
        }
      });
      console.log(isFavorite);
    }
    
    res.render('places/placeDetails', { place: place, isFavorite: !!isFavorite });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/edit', middleware.ensureRole("admin"), async function(req, res, next) {
  try {
    const placeId = req.params.id;
    const place = await Places.findByPk(placeId);
    if (!place) {
      return res.status(404).send('Place not found');
    }
    res.render('places/editPlace', { place: place });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/edit', middleware.ensureRole("admin"), async function(req, res, next) {
  try {
    const placeId = req.params.id;
    const { name, howToReach, description, phone, imageUrl } = req.body;

    const place = await Places.findByPk(placeId);
    if (!place) {
      return res.status(404).send('Place not found');
    }

    // Update the place with new data
    await place.update({
      name: name,
      howToReach: howToReach,
      description: description,
      phone: phone,
      imageUrl: imageUrl
    });

    res.redirect(`/places/${placeId}`);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/add-favorite', middleware.ensureAuthenticated, async function(req, res, next){
const data = {
  userId: req.user.id,
  placeId: req.params.id,
};

try {
  // Check if the place is already added as a favorite
  const existingFavorite = await UserPlaces.findOne({ where: data });

  if (existingFavorite) {
    // If yes, remove it
    await existingFavorite.destroy();
    return res.status(200).send("Place removed from favorites");
  } else {
    // If not, add it
    await UserPlaces.create(data);
    return res.status(200).send("Place added to favorites");
  }
} catch (error) {
  // Handle errors
  console.error(error);
  return res.status(500).send("An error occurred while processing your request");
}

});

module.exports = router;