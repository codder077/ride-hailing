const Cab = require('../models/Cab');

exports.listCabs = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5000 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ 
        error: 'Latitude and longitude are required' 
      });
    }

    const radiusInKm = parseFloat(radius) / 1000;
    const cabs = await Cab.find({
      isAvailable: true,
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radiusInKm *1000
        }
      }
    });

    res.status(200).json({ cabs });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error fetching cabs',
      details: error.message 
    });
  }
}; 