const http = require('http');
const express = require('express');
const firebase = require('firebase');
const request = require('request');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const firebase = require('firebase-admin');

const app = express();

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send("home page");
})

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  let items = "boba";

  // main app commands
  if(req.body.Body.toLowerCase().indexOf("hello") != -1)
  	twiml.message("Hey! Welcome to Foodoo. If you need help, text INSTRUCTIONS")
  else if(req.body.Body.toLowerCase().indexOf("instructions") != -1)
  	twiml.message("1) If you want to see what your favorite food are, text: What are my cravings?\n2) If you want to say what food you like, text: I like ____. Example: I like donuts\n3) If you want to see nearby restaurants that satisfy your craving, text: I am craving _____. Example: I am craving boba\n\nOnce you arrive at a specific restaurant, we will text you a number to communicate to recommend what items in the menu you would like to try. Enjoy! :)")
  else if(req.body.Body.toLowerCase().indexOf("what are my cravings") != -1)
  	twiml.message("Your top cravings are " + items)
  else if(req.body.Body.toLowerCase().indexOf("i am craving") != -1) {
  	let str = req.body.Body;
  	let item = str.substring(str.indexOf("g") + 2, str.length);
  	twiml.message(item);
  	// call Foursquare API on place recommedations
  	var options = { method: 'GET',
	  url: 'https://api.foursquare.com/v2/venues/explore',
	  qs: 
	   { ll: '34.0708,-118.4502',
	     section: 'trending',
	     query: 'boba',
	     limit: '5',
	     '': '',
	     client_id: 'DXQLMKCJW1RARE51SGEEGTULGJNQSNAYD3G1CVSJMGPJMH3S',
	     client_secret: 'D0SWAN4H4GNBOM3YPJQUPILVTQSEZ55LLVMHT02ZVDDKWHYD',
	     v: '20180331',
	     null: '' },
	  headers: 
	   {
	     'Content-Type': 'application/json'
	   },
	  json: true 
	};
	request(options, function (error, response, body) {
  		if (error) throw new Error(error);
  		console.log(body);
	});
  }
  else if(req.body.Body.toLowerCase().indexOf("i like") != -1) {
  	let str = req.body.Body;
  	let item = str.substring(str.indexOf("e") + 2, str.length);
  	twiml.message(item);
  }
  else
  	twiml.message('No Body param match, Twilio sends this in the request to your server.')

  //twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

// establish different ports for different numbers
// then do ngrok http <port #> to establish
http.createServer(app).listen(4848, () => {
  console.log('Express server listening on port 4848');
});
