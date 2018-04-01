const http = require('http');
const express = require('express');
const request = require('request');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const firebase = require('firebase-admin');
const firebase_server = require('./firebase_server.js');

const app = express();

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send(firebase_server.getTopThree());
})

app.get('/test/:test_key', function(req, res) {
    firebase_server.addToFreqs(req.params.test_key);
    res.send("Done!");
})

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  let items = "1) Boba\n2) Chicken\n3) Ramen\n4) Burger\n5) Pizza";

  // main app commands
  if(req.body.Body.toLowerCase().indexOf("hello") != -1)
  	twiml.message("Hey! Welcome to Foodoo. If you need help, text INSTRUCTIONS")
  else if(req.body.Body.toLowerCase().indexOf("instructions") != -1)
  	twiml.message("1) If you want to see what your favorite food are, text: What are my cravings?\n2) If you want to say what food you like, text: I like ____. Example: I like donuts\n3) If you want to see nearby restaurants that satisfy your craving, text: I am craving _____. Example: I am craving boba\n\nOnce you arrive at a specific restaurant, text I am here, and then we will text you a number to communicate to recommend what items in the menu you would like to try. Enjoy! :)")
  else if(req.body.Body.toLowerCase().indexOf("what are my cravings") != -1)
  	twiml.message("Your top cravings are: \n" + items)
  else if(req.body.Body.toLowerCase().indexOf("i am craving") != -1) {
  	let str = req.body.Body;
  	let item = str.substring(str.indexOf("g") + 2, str.length);
  	let msg = "Here are some places you may like:\n1) In-N-Out Burger at 922 Gayley Ave, Los Angeles, CA 90024\n2) Diddy Riese at 926 Broxton Ave, Los Angeles, CA 90024\n3) Chick-fil-A at 900 Westwood Blvd, Los Angeles, CA 90024\n4) Fat Sal's at 950 Gayley Ave, Los Angeles, CA 90024\n5) The Boiling Crab at 10875 Kinross Ave., Los Angeles, CA 90024";
    //twiml.message(item);
  	// call Foursquare API on place recommedations
  	var options = {
      method: 'GET',
  	  url: 'https://api.foursquare.com/v2/venues/explore',
  	  qs:
  	   {
         ll: '34.0708,-118.4502',
  	     section: 'food',
  	     query: 'burger',
  	     limit: '5',
  	     '': '',
  	     client_id: 'DXQLMKCJW1RARE51SGEEGTULGJNQSNAYD3G1CVSJMGPJMH3S',
  	     client_secret: 'D0SWAN4H4GNBOM3YPJQUPILVTQSEZ55LLVMHT02ZVDDKWHYD',
  	     v: '20180331',
  	     null: ''
       },
  	   headers:
  	   {
  	     'Content-Type': 'application/json'
  	   },
  	   json: true
	  };
	  request(options, function (error, response, body) {
  		if (error) throw new Error(error);
  		//console.log(response.body.response);
      let arr = response.body.response.groups[0].items;
      for(let x = 0; x < arr.length; x++) {
        let c = x+1;
        msg += c.toString() + ") " + arr[x].venue.name + " at " + arr[x].venue.location.address + ", " + arr[x].venue.location.city + ", " + arr[x].venue.location.state + " " + arr[x].venue.location.postalCode + "\n";
      }
      //console.log(msg);
	  });
    twiml.message(msg);
  }
  else if(req.body.Body.toLowerCase().indexOf("i like") != -1) {
  	let str = req.body.Body;
  	let item = str.substring(str.indexOf("e") + 2, str.length);
  	//twiml.message(item);
    //getscript("./firebase_server.js",function(){
    //    addToFreqs(item);
    //});
  	//twiml.message(item);
  }
  else if(req.body.Body.toLowerCase().indexOf("i am here") != -1) {
    twiml.message("Awesome! Welcome to In-N-Out Burger. Text +1 626-238-0241 to get some menu recommendations!")
  }
  else
  	twiml.message('No Body param match, Twilio sends this in the request to your server.')

  //twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});


// establish different ports for different numbers
// then do ngrok http <port #> to establish
http.createServer(app).listen(3000, () => {
  console.log('Express server listening on port 3000');
});
