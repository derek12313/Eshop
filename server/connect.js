const mysql = require('mysql2');

// i download a SQL database in my computer and i use it to test the server.js so the host is localhost

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',     // Replace with actual database username
  password: 'XXX', // Replace with actual password
  database: 'online_shopping_app'
});

// Connect to MySQL and check for errors
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Export the connection for use in other files
module.exports = connection;
