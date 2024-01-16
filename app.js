const cors = require("cors"); 
const express = require("express"); 
require("dotenv").config(); 
 
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); 
 
const app = express(); 

app.use(express.json()); 
app.use(cors()); 
 

app.get("/", (req, res) => { 
  res.send("You are at root of mini payment app"); 
}); 
 

app.post("/api/create-checkout-session", async (req, res) => { 
  //this will get the name of product
  const { product } = req.body; 

  //this will call stripe api for payments
  const session = await stripe.checkout.sessions.create({ 
    payment_method_types: ["card"], 
    line_items: [ 
      { 
        price_data: { 
          currency: "mad", 
          product_data: { 
            name: product.name, 
          }, 
          unit_amount: product.price, 
        }, 
        quantity: product.quantity, 
      }, 
    ], 
    mode: "payment", 
    success_url: "http://localhost:3000/success", 
    cancel_url: "http://localhost:3000/cancel", 
  }); 


  res.json({ id: session.id }); 
}); 


//this will listen

app.listen(8000, () => { 
  console.log("Server started at port 8000"); 
}); 