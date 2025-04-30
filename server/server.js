const express = require('express');
const cors = require('cors');
const create = require('./init');
const insert = require('./insert');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());


create.createUsersTable();
create.createProductsTable();
create.createOrdersTable();
create.createOrderItemsTable();
create.createCategoryTypeTable();
create.createCategoryItemTable();

// POST endpoint to insert a new user
app.post('/api/users', (req, res) => {
  // Retrieve user data sent in JSON format from the frontend
  const userData = req.body; // Expected keys: Name, Email, Password, Role

  // Use the insertUser function from the insert module
  insert.insertUser(userData, (err, userId) => {
    if (err) {
      // In case of error, return a 500 status with an error message
      return res.status(500).json({
        error: 'Error inserting user',
        details: err.message
      });
    }
    // On success, return a 201 status with the new user's ID
    res.status(201).json({
      message: 'User inserted successfully',
      userId
    });
  });
});


app.get('/', (req, res) => {
  res.send('API is running and database tables have been initialized.');
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
