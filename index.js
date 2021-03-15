// Add our dependencies
const express = require('express');
const bodyParser = require('body-parser');
const Shopify = require('shopify-api-node'); // https://www.npmjs.com/package/shopify-api-node

// Create our express server
const app = express();
var port = 80; // Set our server port to NGROK port (80)

require('dotenv').config(); // Require our environment variables from our .env file

// Get our API key and Passowrd from our env file
const API_KEY = process.env.SHOPIFY_API_KEY;
const API_PASSWORD = process.env.SHOPIFY_API_PASSWORD;

// Create our Shopify object
const shopify = new Shopify({
  shopName: "bitossi",
  apiKey: API_KEY,
  password: API_PASSWORD,
  apiVersion: '2021-01'
});

// This is a static object. But you could create a function around it to pass


// Our first route
app.get("/", function(req, res) {
  res.send(200); // Every
});

app.get("/carrier_services", function(req, res) {
  // Retrieve our services, and send them back in the response
  shopify.carrierService.list()
    .then((carrierServices) => res.send(carrierServices))
    .catch((err) => console.log(err));
});

app.get("/create_service", function(req, res) {
  // Create our details
    var carrierDetails = {
        name : "Lunch and Learn",
        callback_url : "https://6c920d773d92.ngrok.io/rates",
        service_discovery : "true"
    };

    // // Create our carrier service
    shopify.carrierService.create(carrierDetails)
    .then((newService) => res.status(200).send("Rate created!"))
    .catch((err) => res.status(200).send("Rate note created: " + JSON.stringify(err.response.body)));

    // shopify.carrierService.delete(48216244246);
});

app.post("/rates", function(req, res) {
  // This endpoint is where Shopify will request rates

  /* We create a function that takes in a price, and spits out two rates.
  Standard and express which is 2x standard. You could add variables here for things
  like currency, location, service code etc
  */

  function generateRates(price) {
    var rates = {
      "rates": [{
          "service_name": "Standard", // Title shown to the customer
          "description": "Delivered in 5 days", // Description shown to the customer
          "service_code": "abc1", // Shipping code. Not shown to customer
          "currency": "AUD", // Currency to the rate. Shopify will convert
          "total_price": price // Price of the rate in cents
        },
        {
          "service_name": "Express",
          "description": "Delivered same day",
          "service_code": "abc2",
          "currency": "AUD",
          "total_price": price * 2
        }
      ]
    };
    return rates; // Send them back
  };

  let rates = generateRates(2000); // Use our function to generate some rates
  res.send(JSON.stringify(rates)); // Send them back to Shopify in a nice JSON format :chef-kiss

});

// Open up our port
app.listen(port, console.log("Service listening on: ", port));
