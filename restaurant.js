const http = require('http');
const express = require('express');
const request = require('request');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser());

//app.get('/', function(req, res) {
//	res.send("home page");
//})

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  let items = "1) Boba\n2) Chicken\n3) Ramen\n4) Pie\n5) Pizza";

  // main app commands
  if(req.body.Body.toLowerCase().indexOf("hello") != -1)
  	twiml.message("Hey! Welcome to In-N-Out Burger! If you need help, text INSTRUCTIONS")
  else if(req.body.Body.toLowerCase().indexOf("instructions") != -1)
  	twiml.message("1) If you want to see top favorites based on your current cravings, text: I am hungry\n2) If you want recommendations based on what you like, text: I like ____. Example: I like fries\n\nHope you enjoy your meal at In-N-Out! When you're done ordering, just text: I ordered. Then, we will give you a brief survey to further improve the dining experience.")
  else if(req.body.Body.toLowerCase().indexOf("i am hungry") != -1 || req.body.Body.toLowerCase().indexOf("i like burger") != -1)
    twiml.message("Here are some users' favorites: \n1) Double Double ($3.95)\n2) Cheeseburger ($2.80)\n3) Hamburger ($2.50)")
  else if(req.body.Body.toLowerCase().indexOf("i like soda") != -1) {
    for(let x = 0; x < items.length; x++) {
      let arr = []
      let s = items.indexOf(" ");
      let str = ""
      // based on if this is soda or not for example
      if(items.substr(0, s) == str) {
        arr.push(items.substr(0, s))
      }
    }
    twiml.message("Here are some recommendations: \n1) Seven-Up\n2) Dr Pepper\n3) Iced Tea")
  }
  else if(req.body.Body.toLowerCase().indexOf("i like milk") != -1) {
    twiml.message("Here are some recommendations: \n1) Milk")
  }
  else if(req.body.Body.toLowerCase().indexOf("i like fries") != -1) {
    twiml.message("Here are some recommendations: \n1) French Fries ($1.85)")
  }
  else
  	twiml.message('No Body param match, Twilio sends this in the request to your server.')

  //twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

// establish different ports for different numbers
// then do ngrok http <port #> to establish
http.createServer(app).listen(3001, () => {
  console.log('Express server listening on port 3001');
});
