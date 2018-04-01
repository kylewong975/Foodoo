// Twilio Credentials
const accountSid = 'ACc054d82b2d2df04a2adea88729e975a8';
const authToken = 'dab4cd020539cc5fadcfc6f94d42362f';

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);
client.messages
  .create({
    to: '+17146816055',
    from: '+16264363362',
    body: "Tomorrow's forecast in Financial District, San Francisco is Clear",
    mediaUrl: 'https://climacons.herokuapp.com/clear.png',
  })
  .then((message) => console.log(message.sid));