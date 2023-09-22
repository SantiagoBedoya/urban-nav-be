const Role = require('./role');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const adminRole = new Role({
  _id: process.env.ADMIN_ROLE_ID,
  name: 'Administrator',
  description: 'Role for adminstrator',
  permissions: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
    40, 41, 42, 43,
  ],
});

const clientRole = new Role({
  _id: process.env.CLIENT_ROLE_ID,
  name: 'Client',
  description: 'Role for client',
  permissions: [],
});

const driverRole = new Role({
  _id: process.env.DRIVER_ROLE_ID,
  name: 'Driver',
  description: 'Role for driver',
  permissions: [],
});

mongoose.connect(process.env.MONGODB_URL).then(async () => {
  console.log('Connected', process.env.MONGODB_URL);
  try {
    await adminRole.save();
    console.log('Admin role created');
  } catch (err) {
    console.log('Admin role already exists');
  }
  try {
    await clientRole.save();
    console.log('Client role created');
  } catch (err) {
    console.log('Client role already exists');
  }
  try {
    await driverRole.save();
    console.log('Driver role created');
  } catch (err) {
    console.log('Driver role already exists');
  }
  await mongoose.disconnect();
});