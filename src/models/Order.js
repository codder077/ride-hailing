const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cab: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cab',
    required: true
  },
  pickup: {
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
  dropoff: {
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
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  fare: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

orderSchema.index({ pickup: '2dsphere' });
orderSchema.index({ dropoff: '2dsphere' });

module.exports = mongoose.model('Order', orderSchema); 