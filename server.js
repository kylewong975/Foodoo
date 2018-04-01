const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser());

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  let items = "boba";

  if(req.body.Body.toLowerCase().indexOf("hello") != -1)
  	twiml.message("Hey! Welcome to Foodoo. If you need help, text INSTRUCTIONS")
  else if(req.body.Body.toLowerCase().indexOf("instructions") != -1)
  	twiml.message("1) If you want to see what your favorite food are, text: What are my cravings?\n2) If you want to say what food you like, text: I like ____. Example: I like donuts\n3) If you want to see nearby restaurants that satisfy your craving, text: I am craving _____. Example: I am craving boba\nOnce you arrive at a specific restaurant, we will text you a number to communicate to recommend what items in the menu you would like to try. Enjoy! :)")
  else if(req.body.Body.toLowerCase().indexOf("what are my cravings") != -1)
  	twiml.message("Your top cravings are " + items)
  else
  	twiml.message('No Body param match, Twilio sends this in the request to your server.')

  //twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

http.createServer(app).listen(4848, () => {
  console.log('Express server listening on port 4848');
});