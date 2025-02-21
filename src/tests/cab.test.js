const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Cab = require('../models/Cab');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

describe('Cab Listing API', () => {
  let authToken;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Create a test user and generate token
    const user = await User.create({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      phone: '+1234567890'
    });

    authToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Cab.deleteMany({});
  });

  it('should return 400 if latitude and longitude are not provided', async () => {
    const response = await request(app)
      .get('/api/cabs')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(400);

    expect(response.body.error).toBe('Latitude and longitude are required');
  });

  it('should return nearby available cabs', async () => {
    // Create test cab
    await Cab.create({
      driverName: 'Test Driver',
      vehicleNumber: 'TEST123',
      vehicleType: 'sedan',
      currentLocation: {
        type: 'Point',
        coordinates: [-73.9667, 40.7789] // Example coordinates
      },
      isAvailable: true
    });

    const response = await request(app)
      .get('/api/cabs')
      .set('Authorization', `Bearer ${authToken}`)
      .query({
        latitude: 40.7789,
        longitude: -73.9667
      })
      .expect(200);

    expect(response.body.cabs).toHaveLength(1);
    expect(response.body.cabs[0].vehicleNumber).toBe('TEST123');
  });

  it('should not return unavailable cabs', async () => {
    await Cab.create({
      driverName: 'Test Driver',
      vehicleNumber: 'TEST123',
      vehicleType: 'sedan',
      currentLocation: {
        type: 'Point',
        coordinates: [-73.9667, 40.7789]
      },
      isAvailable: false
    });

    const response = await request(app)
      .get('/api/cabs')
      .set('Authorization', `Bearer ${authToken}`)
      .query({
        latitude: 40.7789,
        longitude: -73.9667
      })
      .expect(200);

    expect(response.body.cabs).toHaveLength(0);
  });

  it('should respect the radius parameter', async () => {
    // Create a cab that's 2km away from the search point
    await Cab.create({
      driverName: 'Test Driver',
      vehicleNumber: 'TEST123',
      vehicleType: 'sedan',
      currentLocation: {
        type: 'Point',
        coordinates: [-73.9667, 40.7789] // Base coordinates
      },
      isAvailable: true
    });

    const response = await request(app)
      .get('/api/cabs')
      .set('Authorization', `Bearer ${authToken}`)
      .query({
        latitude: 40.7889, // Roughly 1km north
        longitude: -73.9667,
        radius: 500 // 500 meters radius
      })
      .expect(200);

    expect(response.body.cabs).toHaveLength(0);
  });

  it('should find cabs within the specified radius', async () => {
    // Create a cab that's close to the search point
    await Cab.create({
      driverName: 'Test Driver',
      vehicleNumber: 'TEST123',
      vehicleType: 'sedan',
      currentLocation: {
        type: 'Point',
        coordinates: [-73.9667, 40.7789]
      },
      isAvailable: true
    });

    const response = await request(app)
      .get('/api/cabs')
      .set('Authorization', `Bearer ${authToken}`)
      .query({
        latitude: 40.7789,
        longitude: -73.9667,
        radius: 5000 // 5km radius
      })
      .expect(200);

    expect(response.body.cabs).toHaveLength(1);
  });
});