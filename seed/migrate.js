const Role = require('./role');
const User = require('./user');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const adminRole = new Role({
  _id: process.env.ADMIN_ROLE_ID,
  name: 'Administrator',
  description: 'Role for adminstrator',
  permissions: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
    40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
  ],
});

const clientRole = new Role({
  _id: process.env.CLIENT_ROLE_ID,
  name: 'Client',
  description: 'Role for client',
  permissions: [44],
});

const driverRole = new Role({
  _id: process.env.DRIVER_ROLE_ID,
  name: 'Driver',
  description: 'Role for driver',
  permissions: [45, 46, 47, 48, 49],
});

// users
const client1User = new User({
  firstName: 'client1',
  lastName: 'Testing',
  email: 'client1@google.com',
  password: bcrypt.hashSync('client1123', 10),
  roleId: new mongoose.Types.ObjectId(process.env.CLIENT_ROLE_ID),
});
const client2User = new User({
  firstName: 'client2',
  lastName: 'Testing',
  email: 'client2@google.com',
  password: bcrypt.hashSync('client2123', 10),
  roleId: new mongoose.Types.ObjectId(process.env.CLIENT_ROLE_ID),
});
const client3User = new User({
  firstName: 'client3',
  lastName: 'Testing',
  email: 'client3@google.com',
  password: bcrypt.hashSync('client3123', 10),
  roleId: new mongoose.Types.ObjectId(process.env.CLIENT_ROLE_ID),
});
const client4User = new User({
  firstName: 'client4',
  lastName: 'Testing',
  email: 'client4@google.com',
  password: bcrypt.hashSync('client4123', 10),
  roleId: new mongoose.Types.ObjectId(process.env.CLIENT_ROLE_ID),
});

const admin1User = new User({
  firstName: 'admin1',
  lastName: 'Testing',
  email: 'admin1@google.com',
  password: bcrypt.hashSync('admin1123', 10),
  roleId: new mongoose.Types.ObjectId(process.env.ADMIN_ROLE_ID),
});
const admin2User = new User({
  firstName: 'admin2',
  lastName: 'Testing',
  email: 'admin2@google.com',
  password: bcrypt.hashSync('admin2123', 10),
  roleId: new mongoose.Types.ObjectId(process.env.ADMIN_ROLE_ID),
});
const admin3User = new User({
  firstName: 'admin3',
  lastName: 'Testing',
  email: 'admin3@google.com',
  password: bcrypt.hashSync('admin3123', 10),
  roleId: new mongoose.Types.ObjectId(process.env.ADMIN_ROLE_ID),
});
const admin4User = new User({
  firstName: 'admin4',
  lastName: 'Testing',
  email: 'admin4@google.com',
  password: bcrypt.hashSync('admin4123', 10),
  roleId: new mongoose.Types.ObjectId(process.env.ADMIN_ROLE_ID),
});

const driver1User = new User({
  firstName: 'driver1',
  lastName: 'Testing',
  email: 'driver1@google.com',
  password: bcrypt.hashSync('driver1123', 10),
  roleId: new mongoose.Types.ObjectId(process.env.DRIVER_ROLE_ID),
});
const driver2User = new User({
  firstName: 'driver2',
  lastName: 'Testing',
  email: 'driver2@google.com',
  password: bcrypt.hashSync('driver2123', 10),
  roleId: new mongoose.Types.ObjectId(process.env.DRIVER_ROLE_ID),
});
const driver3User = new User({
  firstName: 'driver3',
  lastName: 'Testing',
  email: 'driver3@google.com',
  password: bcrypt.hashSync('driver3123', 10),
  roleId: new mongoose.Types.ObjectId(process.env.DRIVER_ROLE_ID),
});
const driver4User = new User({
  firstName: 'driver4',
  lastName: 'Testing',
  email: 'driver4@google.com',
  password: bcrypt.hashSync('driver4123', 10),
  roleId: new mongoose.Types.ObjectId(process.env.DRIVER_ROLE_ID),
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

  // users
  try {
    await client1User.save();
    await client2User.save();
    await client3User.save();
    await client4User.save();

    await admin1User.save();
    await admin2User.save();
    await admin3User.save();
    await admin4User.save();

    await driver1User.save();
    await driver2User.save();
    await driver3User.save();
    await driver4User.save();
    console.log('Users created');
  } catch (err) {
    console.log('Error creating Users:', err);
  }
  await mongoose.disconnect();
});
