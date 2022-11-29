var port = process.env.PORT || 3200;
const express = require('express');
const app = express();
const mysql = require('mysql');
var cors = require('cors')
const HTTPS = require("https");
const fs = require("fs")
app.use(cors())
var bodyParser = require('body-parser')
// data base connection access
const db_config = {
  host: '184.168.119.144',
  user: 'ecodash',
  password: '$DZXw*Ih4s}R',
  database: 'ecodash',
}

// const db_config = {
//   host: '54.254.12.163',
//   user: 'singpoly',
//   password: 'Abitech@123',
//   database: 'ecodash',
// }
// giving access to load the uploads folder
app.use('/uploads',express.static('uploads'))
app.use('/invoice',express.static('invoice'))
// parse various different custom JSON types as JSON
app.use(bodyParser.json({ limit: '500mb' }))
function handleDisconnect() {
  global.connection = mysql.createConnection(db_config); // Recreate the connection, since
  // the old one cannot be reused.

  connection.connect(function (err) {              // The server is either down
    if (err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } else {
      console.log("db is connected")
    }                                    // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on('error', function (err) {

    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually

      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      handleDisconnect();                              // server variable configures this)
    }
  });
}

handleDisconnect();
// const options = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem')
// };
// app.use(express.static('singapor-dashboard'))
app.listen(port, () => { console.log(`App is listening port number:${port}`) })
// HTTPS.createServer(options, app).listen(3200, () => {
//   console.log("Listening at :3200...");
// });


// importing the file
const auth = require("./routes/auth")
app.use('/auth', auth);
// getting the product details
const products = require("./routes/products");
app.use('/products', products);
// getting the product
const cart = require("./routes/cart")
app.use('/cart', cart);
const supplier = require("./routes/supplier");
app.use('/supplier', supplier);
const dashboardUserRole = require("./routes/dashboardUserRole")
app.use('/dashboardUserRole', dashboardUserRole);
const customer = require("./routes/customer")
app.use('/customer', customer);
const order = require("./routes/order")
app.use('/order', order);


