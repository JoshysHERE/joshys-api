const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { getRandomName, getRandomApplications } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');


  await Thought.deleteMany({});
  await User.deleteMany({});
  const users = [
    {
    username: "Joshy",
    email: "joshy@gmail.com"
    },
    {
    username: "Joshy",
    email: "joshy@gmail.com"
    }
  ];

  const thoughts = [
  {
    thoughtText: "blah blah blah",
    username: "Joshy"
  },
  {
    thoughtText: "blah blah blah",
    username: "Joshy"
    }
  ]


  await User.collection.insertMany(users);

  await Thought.collection.insertMany(thoughts);
  

  await User.collection.insertMany(users);
  await Application.collection.insertMany(applications);
  console.table(users);
  console.table(applications);
  console.info('Seeding complete! 🌱');
  process.exit(0);
});