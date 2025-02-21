const Order = require('../models/Order');
const Cab = require('../models/Cab');

exports.createOrder = async (req, res) => {
  try {
    const {
      cabId,
      pickup,
      dropoff,
      fare
    } = req.body;

    // Check if cab exists and is available
    const cab = await Cab.findById(cabId);
    if (!cab || !cab.isAvailable) {
      return res.status(400).json({ error: 'Cab not available' });
    }

    // Create order
    const order = new Order({
      user: req.user.userId,
      cab: cabId,
      pickup: {
        type: 'Point',
        coordinates: pickup
      },
      dropoff: {
        type: 'Point',
        coordinates: dropoff
      },
      fare
    });

    // Update cab availability
    cab.isAvailable = false;
    await cab.save();
    await order.save();

    res.status(201).json({ order });
  } catch (error) {
    res.status(500).json({
      error: 'Error creating order',
      details: error.message
    });
  }
};

exports.trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate('cab', 'currentLocation driverName vehicleNumber')
      .populate('user', 'name phone');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user is authorized to track this order
    if (order.user._id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({
      error: 'Error tracking order',
      details: error.message
    });
  }
}; 