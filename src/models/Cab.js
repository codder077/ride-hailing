const mongoose = require('mongoose');

const cabSchema = new mongoose.Schema({
  driverName: {
    type: String,
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true,
    unique: true
  },
  vehicleType: {
    type: String,
    enum: ['sedan', 'suv', 'hatchback'],
    required: true
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
});

cabSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('Cab', cabSchema); 