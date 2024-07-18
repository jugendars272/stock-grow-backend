const http = require('http');
const fs = require('fs');
const express = require('express');
const { connectDb } = require('./db/connection');
const cors = require('cors');
const routes = require('./routes/index');
const morgan = require("morgan");
require('dotenv').config();

const app = express();
const hostname = process.env.HOSTNAME;
const port = process.env.PORT || 3000;


app.use(morgan('tiny'));

// Parse incoming JSON
app.use(express.json());
app.use(cors());
// Set up routes
app.use('/', routes);
app.get('/',(req,res)=>{res.send("Server is Live!!!")});

const server = http.createServer(app);

// Connect to MongoDB
connectDb()
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    server.listen(port, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });
